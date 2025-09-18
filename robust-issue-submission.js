// Robust Issue Submission Service
// This handles the complete flow: validation, submission, notifications, and redirection

export class RobustIssueSubmissionService {
    constructor(supabase, notificationService, showToast, navigate) {
        this.supabase = supabase;
        this.notificationService = notificationService;
        this.showToast = showToast;
        this.navigate = navigate;
    }

    async submitIssue(formData, setIsSubmitting, setSubmitError, setShowSuccessMessage) {
        console.log('🚀 Starting robust issue submission...');
        
        try {
            // Step 1: Validate form data
            const validationResult = this.validateIssueData(formData);
            if (!validationResult.isValid) {
                this.showToast(`Validation Error: ${validationResult.error}`, 'error');
                return { success: false, error: validationResult.error };
            }

            setIsSubmitting(true);
            setSubmitError('');

            // Step 2: Get user session and profile
            const userContext = await this.getUserContext();
            if (!userContext.success) {
                const error = 'Please log in to submit a report';
                this.showToast(error, 'error');
                setSubmitError(error);
                return { success: false, error };
            }

            console.log('✅ User context retrieved:', userContext.user.email);

            // Step 3: Prepare issue data
            const issueData = this.prepareIssueData(formData, userContext);
            console.log('📝 Issue data prepared:', issueData);

            // Step 4: Create issue in database
            const createResult = await this.createIssueInDatabase(issueData);
            if (!createResult.success) {
                this.showToast(`Submission Failed: ${createResult.error}`, 'error');
                setSubmitError(createResult.error);
                return createResult;
            }

            console.log('✅ Issue created in database:', createResult.data.id);

            // Step 5: Handle image uploads (if any)
            if (formData.images && formData.images.length > 0) {
                console.log('📸 Uploading images...');
                await this.handleImageUploads(createResult.data.id, formData.images, userContext.user.id);
            }

            // Step 6: Send notifications (non-blocking)
            this.sendNotificationsAsync(createResult.data);

            // Step 7: Show success feedback
            this.showSuccessFlow(createResult.data, setShowSuccessMessage);

            return { success: true, data: createResult.data };

        } catch (error) {
            console.error('💥 Robust submission failed:', error);
            const errorMessage = this.getErrorMessage(error);
            this.showToast(`Submission Error: ${errorMessage}`, 'error');
            setSubmitError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setIsSubmitting(false);
        }
    }

    validateIssueData(formData) {
        console.log('🔍 Validating form data...');

        if (!formData.title || formData.title.trim().length < 10) {
            return { isValid: false, error: 'Title must be at least 10 characters long' };
        }

        if (!formData.description || formData.description.trim().length < 20) {
            return { isValid: false, error: 'Description must be at least 20 characters long' };
        }

        if (!formData.category) {
            return { isValid: false, error: 'Please select a category' };
        }

        if (!formData.location || !formData.location.address) {
            return { isValid: false, error: 'Please provide a location address' };
        }

        console.log('✅ Form data validation passed');
        return { isValid: true };
    }

    async getUserContext() {
        try {
            const { data: { session } } = await this.supabase.auth.getSession();
            
            if (!session?.user) {
                return { success: false, error: 'No user session' };
            }

            // Get user profile
            const { data: profile, error: profileError } = await this.supabase
                .from('user_profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (profileError) {
                console.warn('⚠️ Could not fetch user profile:', profileError);
                // Continue without profile
            }

            return {
                success: true,
                user: session.user,
                profile: profile || null
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    prepareIssueData(formData, userContext) {
        const { user, profile } = userContext;

        return {
            title: formData.title.trim(),
            description: formData.description.trim(),
            category: formData.category,
            priority: formData.priority || 'medium',
            address: formData.location.address.trim(),
            latitude: formData.location.coordinates?.lat || null,
            longitude: formData.location.coordinates?.lng || null,
            reporter_id: user.id,
            reporter_name: formData.contactInfo?.name || profile?.full_name || user.user_metadata?.full_name || user.email.split('@')[0],
            reporter_email: formData.contactInfo?.email || profile?.email || user.email,
            reporter_phone: formData.contactInfo?.phone || profile?.phone || user.user_metadata?.phone || null,
            status: 'submitted',
            created_at: new Date().toISOString()
        };
    }

    async createIssueInDatabase(issueData) {
        try {
            console.log('💾 Creating issue in database...');

            // Remove any undefined values
            const cleanedData = Object.fromEntries(
                Object.entries(issueData).filter(([_, value]) => value !== undefined)
            );

            const { data: issue, error } = await this.supabase
                .from('civic_issues')
                .insert([cleanedData])
                .select()
                .single();

            if (error) {
                console.error('❌ Database insertion failed:', error);
                throw new Error(this.getDatabaseErrorMessage(error));
            }

            return { success: true, data: issue };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async handleImageUploads(issueId, images, userId) {
        try {
            const uploadPromises = images.map(async (image, index) => {
                try {
                    const fileExt = image.file.name.split('.').pop();
                    const fileName = `${issueId}/${Date.now()}-${index}.${fileExt}`;

                    const { data: uploadData, error: uploadError } = await this.supabase.storage
                        .from('issue-images')
                        .upload(fileName, image.file, {
                            cacheControl: '3600',
                            upsert: false
                        });

                    if (uploadError) {
                        console.error('Image upload failed:', uploadError);
                        return null;
                    }

                    // Get public URL
                    const { data: urlData } = this.supabase.storage
                        .from('issue-images')
                        .getPublicUrl(fileName);

                    // Create image record
                    const { data: imageRecord, error: imageError } = await this.supabase
                        .from('issue_images')
                        .insert([{
                            issue_id: issueId,
                            image_path: fileName,
                            image_url: urlData.publicUrl,
                            caption: image.caption || null,
                            uploaded_by: userId
                        }])
                        .select()
                        .single();

                    if (imageError) {
                        console.error('Image record creation failed:', imageError);
                        return null;
                    }

                    return imageRecord;
                } catch (error) {
                    console.error('Image processing failed:', error);
                    return null;
                }
            });

            const results = await Promise.all(uploadPromises);
            const successfulUploads = results.filter(result => result !== null);
            
            console.log(`📸 Images uploaded: ${successfulUploads.length}/${images.length}`);
            return successfulUploads;
        } catch (error) {
            console.error('Image upload batch failed:', error);
            return [];
        }
    }

    sendNotificationsAsync(issue) {
        console.log('📱 Sending notifications asynchronously...');
        
        setTimeout(async () => {
            try {
                const result = await this.notificationService.sendIssueNotifications(issue, 'created');
                console.log('📨 Notification result:', result);
                
                if (result.user?.success) {
                    console.log('✅ User WhatsApp notification sent');
                } else {
                    console.warn('⚠️ User notification failed:', result.user?.error);
                }
                
                if (result.admin?.success) {
                    console.log('✅ Admin WhatsApp notification sent');
                } else {
                    console.warn('⚠️ Admin notification failed:', result.admin?.error);
                }
            } catch (notificationError) {
                console.error('📱 Notification sending failed:', notificationError);
                // Don't fail the submission for notification errors
            }
        }, 500); // Small delay to ensure issue is fully created
    }

    showSuccessFlow(issue, setShowSuccessMessage) {
        // Show immediate toast
        this.showToast(
            '🎉 Report submitted successfully! You will receive WhatsApp confirmation shortly.',
            'success',
            5000
        );

        // Show success page
        setShowSuccessMessage(true);

        // Redirect to reports listing
        setTimeout(() => {
            console.log('🔄 Redirecting to reports listing...');
            this.navigate('/public-reports-listing');
        }, 3000);
    }

    getDatabaseErrorMessage(error) {
        if (error.message.includes('permission denied')) {
            return 'Permission denied. Please ensure you are logged in.';
        } else if (error.message.includes('violates check constraint')) {
            return 'Invalid data provided. Please check all required fields.';
        } else if (error.message.includes('duplicate key')) {
            return 'A similar report already exists.';
        } else if (error.message.includes('foreign key')) {
            return 'Invalid reference data. Please try again.';
        } else {
            return `Database error: ${error.message}`;
        }
    }

    getErrorMessage(error) {
        if (error.message.includes('Failed to fetch')) {
            return 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('permission denied')) {
            return 'Permission denied. Please log in and try again.';
        } else {
            return error.message || 'An unexpected error occurred. Please try again.';
        }
    }
}

// Export a factory function to create the service
export const createRobustIssueSubmissionService = (supabase, notificationService, showToast, navigate) => {
    return new RobustIssueSubmissionService(supabase, notificationService, showToast, navigate);
};