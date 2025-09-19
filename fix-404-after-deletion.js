// Fix for 404 errors after deleting database rows
// Run this in browser console to clear all cached data and fix navigation issues

function fix404AfterDeletion() {
    console.log('🔧 Fixing 404 errors after database deletion...');
    
    // Step 1: Clear all browser storage
    console.log('1️⃣ Clearing browser storage...');
    try {
        localStorage.clear();
        sessionStorage.clear();
        console.log('✅ Browser storage cleared');
    } catch (error) {
        console.warn('⚠️ Could not clear storage:', error);
    }
    
    // Step 2: Clear any cached data in memory
    console.log('2️⃣ Clearing cached data...');
    
    // Clear any React Query cache if present
    if (window.queryClient) {
        window.queryClient.clear();
        console.log('✅ React Query cache cleared');
    }
    
    // Step 3: Check current URL for deleted issue references
    console.log('3️⃣ Checking current URL...');
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('/issue/')) {
        const issueId = currentPath.split('/issue/')[1];
        console.log('🔍 Found issue ID in URL:', issueId);
        console.log('💡 This might be a deleted issue causing the 404');
        
        // Redirect to reports listing
        console.log('🔄 Redirecting to reports listing...');
        window.location.href = '/public-reports-listing';
        return;
    }
    
    // Step 4: Force reload the page
    console.log('4️⃣ Force reloading page...');
    setTimeout(() => {
        window.location.reload(true);
    }, 1000);
}

// Also provide a function to safely navigate away from broken pages
function safeNavigateHome() {
    console.log('🏠 Safely navigating to home page...');
    
    // Clear storage first
    localStorage.clear();
    sessionStorage.clear();
    
    // Navigate to safe page
    window.location.href = '/public-landing-page';
}

// Check if we're currently on a broken issue page
function checkForBrokenIssuePage() {
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('/issue/')) {
        console.log('⚠️ Currently on an issue page that might be broken');
        console.log('💡 Run safeNavigateHome() to fix this');
        return true;
    }
    
    return false;
}

// Run the fix
console.log('🚀 Starting 404 Fix Process...');
console.log('Current URL:', window.location.href);

if (checkForBrokenIssuePage()) {
    console.log('🔧 Detected potential broken issue page');
    fix404AfterDeletion();
} else {
    console.log('ℹ️ Not on an issue page, just clearing cache...');
    localStorage.clear();
    sessionStorage.clear();
    console.log('✅ Cache cleared. Refresh the page if issues persist.');
}