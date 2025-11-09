/**
 * Beautiful Scroll to Top Button
 * Smooth scroll functionality with elegant animations
 */

(function() {
    'use strict';
    
    // Create scroll to top button
    function createScrollToTopButton() {
        // Check if button already exists
        if (document.querySelector('.scroll-to-top')) {
            return;
        }
        
        const scrollButton = document.createElement('div');
        scrollButton.className = 'scroll-to-top';
        scrollButton.setAttribute('aria-label', 'Scroll to top');
        scrollButton.setAttribute('role', 'button');
        scrollButton.setAttribute('tabindex', '0');
        
        scrollButton.innerHTML = `
            <div class="scroll-progress"></div>
            <i class="fas fa-arrow-up"></i>
        `;
        
        document.body.appendChild(scrollButton);
        
        // Scroll to top functionality
        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
        
        // Click event
        scrollButton.addEventListener('click', scrollToTop);
        
        // Keyboard support (Enter and Space)
        scrollButton.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                scrollToTop();
            }
        });
        
        // Show/hide button based on scroll position
        let ticking = false;
        
        function updateScrollButton() {
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            const showThreshold = 300; // Show button after scrolling 300px
            
            if (scrollY > showThreshold) {
                scrollButton.classList.add('show');
                
                // Add pulse effect when first shown
                if (!scrollButton.classList.contains('pulse')) {
                    scrollButton.classList.add('pulse');
                    setTimeout(() => {
                        scrollButton.classList.remove('pulse');
                    }, 2000);
                }
            } else {
                scrollButton.classList.remove('show');
            }
            
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                window.requestAnimationFrame(updateScrollButton);
                ticking = true;
            }
        }
        
        // Listen to scroll events
        window.addEventListener('scroll', requestTick, { passive: true });
        
        // Initial check
        updateScrollButton();
        
        // Add smooth scroll behavior for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href !== '#' && href.length > 1) {
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createScrollToTopButton);
    } else {
        createScrollToTopButton();
    }
})();

