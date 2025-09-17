import { supabase } from '../lib/supabase';

export const civicIssueService = {
  // Get all civic issues with optional filters
  async getIssues(filters = {}) {
    try {
      let query = supabase?.from('civic_issues')?.select(`
          *,
          departments(name, contact_email),
          user_profiles!reporter_id(full_name, email),
          issue_images(id, image_path, image_url, caption),
          issue_votes(vote_type),
          issue_updates(status, comment, created_at, is_public)
        `)?.order('created_at', { ascending: false });

      // Apply filters
      if (filters?.category) {
        query = query?.eq('category', filters?.category);
      }
      if (filters?.status) {
        query = query?.eq('status', filters?.status);
      }
      if (filters?.priority) {
        query = query?.eq('priority', filters?.priority);
      }
      if (filters?.limit) {
        query = query?.limit(filters?.limit);
      }

      const { data, error } = await query;
      
      if (error) {
        throw error;
      }

      // Add vote counts and user interaction data
      const issuesWithCounts = data?.map(issue => ({
        ...issue,
        upvoteCount: issue?.issue_votes?.filter(vote => vote?.vote_type === 'upvote')?.length || 0,
        importantCount: issue?.issue_votes?.filter(vote => vote?.vote_type === 'important')?.length || 0,
        imageCount: issue?.issue_images?.length || 0,
        updateCount: issue?.issue_updates?.length || 0
      }));

      return { data: issuesWithCounts, error: null };
    } catch (error) {
      console.error('Error fetching civic issues:', error);
      return { data: null, error: error?.message };
    }
  },

  // Get a single issue by ID
  async getIssueById(id) {
    try {
      const { data, error } = await supabase?.from('civic_issues')?.select(`
          *,
          departments(name, description, contact_email, contact_phone),
          user_profiles!reporter_id(full_name, email, phone),
          issue_images(id, image_path, image_url, caption, created_at),
          issue_votes(id, vote_type, user_id),
          issue_updates(id, status, comment, created_at, is_public, user_profiles(full_name))
        `)?.eq('id', id)?.single();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching issue:', error);
      return { data: null, error: error?.message };
    }
  },

  // Create a new civic issue
  async createIssue(issueData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      
      const issueToCreate = {
        title: issueData?.title,
        description: issueData?.description,
        category: issueData?.category,
        priority: issueData?.priority || 'medium',
        address: issueData?.location?.address,
        latitude: issueData?.location?.coordinates?.lat,
        longitude: issueData?.location?.coordinates?.lng,
        reporter_id: user?.id,
        reporter_name: issueData?.contactInfo?.name,
        reporter_email: issueData?.contactInfo?.email,
        reporter_phone: issueData?.contactInfo?.phone
      };

      const { data, error } = await supabase?.from('civic_issues')?.insert([issueToCreate])?.select()?.single();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error creating issue:', error);
      return { data: null, error: error?.message };
    }
  },

  // Update issue status (admin only)
  async updateIssueStatus(issueId, status, comment = null) {
    try {
      const { data, error } = await supabase?.from('civic_issues')?.update({ 
          status,
          updated_at: new Date()?.toISOString(),
          ...(status === 'resolved' && { resolved_at: new Date()?.toISOString() })
        })?.eq('id', issueId)?.select()?.single();

      if (error) {
        throw error;
      }

      // Create an update record if comment provided
      if (comment) {
        await this.addIssueUpdate(issueId, status, comment);
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error updating issue status:', error);
      return { data: null, error: error?.message };
    }
  },

  // Add issue update/comment
  async addIssueUpdate(issueId, status, comment, isPublic = true) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      
      const { data, error } = await supabase?.from('issue_updates')?.insert([{
          issue_id: issueId,
          status,
          comment,
          updated_by: user?.id,
          is_public: isPublic
        }])?.select(`
          *,
          user_profiles(full_name)
        `)?.single();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error adding issue update:', error);
      return { data: null, error: error?.message };
    }
  },

  // Vote on an issue
  async voteOnIssue(issueId, voteType = 'upvote') {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      
      if (!user) {
        throw new Error('Authentication required to vote');
      }

      // Check if user already voted with this type
      const { data: existingVote } = await supabase?.from('issue_votes')?.select('id')?.eq('issue_id', issueId)?.eq('user_id', user?.id)?.eq('vote_type', voteType)?.single();

      if (existingVote) {
        // Remove the vote (toggle)
        const { error } = await supabase?.from('issue_votes')?.delete()?.eq('id', existingVote?.id);

        if (error) throw error;
        return { data: { action: 'removed' }, error: null };
      } else {
        // Add the vote
        const { data, error } = await supabase?.from('issue_votes')?.insert([{
            issue_id: issueId,
            user_id: user?.id,
            vote_type: voteType
          }])?.select()?.single();

        if (error) throw error;
        return { data: { action: 'added', vote: data }, error: null };
      }
    } catch (error) {
      console.error('Error voting on issue:', error);
      return { data: null, error: error?.message };
    }
  },

  // Get user's votes for issues
  async getUserVotes(issueIds) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      
      if (!user) {
        return { data: [], error: null };
      }

      const { data, error } = await supabase?.from('issue_votes')?.select('issue_id, vote_type')?.eq('user_id', user?.id)?.in('issue_id', issueIds);

      if (error) {
        throw error;
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching user votes:', error);
      return { data: [], error: error?.message };
    }
  },

  // Get issues statistics
  async getIssuesStats() {
    try {
      const { data, error } = await supabase?.from('civic_issues')?.select('status, category, priority, created_at');

      if (error) {
        throw error;
      }

      const stats = {
        total: data?.length || 0,
        byStatus: {},
        byCategory: {},
        byPriority: {},
        recentCount: 0
      };

      const oneWeekAgo = new Date();
      oneWeekAgo?.setDate(oneWeekAgo?.getDate() - 7);

      data?.forEach(issue => {
        // Count by status
        stats.byStatus[issue.status] = (stats?.byStatus?.[issue?.status] || 0) + 1;
        
        // Count by category
        stats.byCategory[issue.category] = (stats?.byCategory?.[issue?.category] || 0) + 1;
        
        // Count by priority
        stats.byPriority[issue.priority] = (stats?.byPriority?.[issue?.priority] || 0) + 1;
        
        // Count recent issues
        if (new Date(issue.created_at) > oneWeekAgo) {
          stats.recentCount++;
        }
      });

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error fetching issues stats:', error);
      return { data: null, error: error?.message };
    }
  },

  // Real-time subscription for issue changes
  subscribeToIssueChanges(callback) {
    const subscription = supabase?.channel('civic_issues_changes')?.on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'civic_issues' 
        },
        (payload) => {
          callback?.(payload);
        }
      )?.subscribe();

    return subscription;
  },

  // Unsubscribe from real-time changes
  unsubscribeFromChanges(subscription) {
    if (subscription) {
      supabase?.removeChannel(subscription);
    }
  }
};

export default civicIssueService;