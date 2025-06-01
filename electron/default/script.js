async function performSearch() {
    const query = document.getElementById('searchInput').value.trim();
    if (query) {
        // In a real browser, this would perform the actual search
        //window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
		await window.browser.run(query);
    }
}

// Allow Enter key to trigger search
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// Focus search bar on page load
window.addEventListener('load', function() {
    document.getElementById('searchInput').focus();
});

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effect to the leaf icon
    const leafIcon = document.querySelector('.leaf-icon');
    leafIcon.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1) rotate(5deg)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    leafIcon.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
    });
    
    // Add typing indicator effect to search bar
    const searchBar = document.getElementById('searchInput');
    let typingTimer;
    
    searchBar.addEventListener('input', function() {
        clearTimeout(typingTimer);
        this.style.borderColor = '#50fa7b'; // Green while typing
        
        typingTimer = setTimeout(() => {
            this.style.borderColor = '#bd93f9'; // Purple when done
        }, 1000);
    });
});
