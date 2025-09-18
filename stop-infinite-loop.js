// Emergency script to stop the infinite loop
// Run this in browser console to stop the continuous fetching

function stopInfiniteLoop() {
    console.log('🛑 Stopping infinite loop...');
    
    // Clear all timeouts and intervals
    let id = window.setTimeout(function() {}, 0);
    while (id--) {
        window.clearTimeout(id);
    }
    
    id = window.setInterval(function() {}, 0);
    while (id--) {
        window.clearInterval(id);
    }
    
    console.log('✅ All timeouts and intervals cleared');
    
    // Refresh the page to restart with fixed code
    console.log('🔄 Refreshing page in 2 seconds...');
    setTimeout(() => {
        window.location.reload();
    }, 2000);
}

// Run immediately
stopInfiniteLoop();