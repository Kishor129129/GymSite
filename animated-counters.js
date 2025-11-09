/**
 * Beautiful Animated Number Counter System
 * Animates numbers from 0 to target value when they come into view
 */

(function() {
    'use strict';
    
    class AnimatedCounter {
        constructor(element, targetValue, options = {}) {
            this.element = element;
            this.targetValue = this.parseValue(targetValue);
            this.duration = options.duration || 2000; // 2 seconds default
            this.delay = options.delay || 0;
            this.decimals = options.decimals || 0;
            this.suffix = options.suffix || '';
            this.prefix = options.prefix || '';
            this.animated = false;
            this.startValue = 0;
        }
        
        parseValue(value) {
            // Handle different value types
            if (typeof value === 'string') {
                // Remove commas and extract number
                const numStr = value.replace(/,/g, '').replace(/[^\d.]/g, '');
                return parseFloat(numStr) || 0;
            }
            return parseFloat(value) || 0;
        }
        
        formatNumber(num) {
            // Format with decimals and add suffix/prefix
            let formatted = num.toFixed(this.decimals);
            
            // Add thousand separators for large numbers
            if (this.targetValue >= 1000) {
                formatted = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
            
            return this.prefix + formatted + this.suffix;
        }
        
        animate() {
            if (this.animated) return;
            this.animated = true;
            
            const startTime = Date.now();
            const startValue = this.startValue;
            const endValue = this.targetValue;
            const range = endValue - startValue;
            
            // Add animating class for pulse effect
            this.element.classList.add('animating');
            
            const updateCounter = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / this.duration, 1);
                
                // Easing function (ease-out)
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const currentValue = startValue + (range * easeOut);
                
                this.element.textContent = this.formatNumber(currentValue);
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    // Animation complete
                    this.element.textContent = this.formatNumber(endValue);
                    this.element.classList.remove('animating');
                    this.element.classList.add('counted');
                }
            };
            
            // Start animation after delay
            setTimeout(() => {
                requestAnimationFrame(updateCounter);
            }, this.delay);
        }
    }
    
    // Initialize animated counters
    function initAnimatedCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        const statContainers = document.querySelectorAll('.stat-item, .stat-card, .social-stat');
        
        if (statNumbers.length === 0) return;
        
        // Create Intersection Observer for scroll-triggered animations
        const observerOptions = {
            threshold: 0.3, // Trigger when 30% visible
            rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is fully visible
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const container = entry.target;
                    
                    // Add visible class for fade-in animation
                    if (container.classList.contains('stat-item') || 
                        container.classList.contains('stat-card') || 
                        container.classList.contains('social-stat')) {
                        container.classList.add('visible');
                    }
                    
                    // Find and animate stat numbers within this container
                    const statNumber = container.querySelector('.stat-number');
                    if (statNumber && !statNumber.dataset.animated) {
                        statNumber.dataset.animated = 'true';
                        
                        // Check for data-target attribute first (for dynamically loaded content)
                        let targetValue = statNumber.getAttribute('data-target');
                        if (!targetValue) {
                            targetValue = statNumber.textContent.trim();
                        }
                        
                        const delay = Array.from(statContainers).indexOf(container) * 100;
                        
                        // Detect suffix/prefix
                        let suffix = '';
                        let prefix = '';
                        let decimals = 0;
                        
                        const originalText = statNumber.textContent.trim();
                        if (originalText.includes('g')) {
                            suffix = 'g';
                            decimals = 0;
                        } else if (originalText.includes('cal')) {
                            suffix = ' cal';
                            decimals = 0;
                        } else if (originalText.includes('glasses')) {
                            suffix = '';
                            decimals = 0;
                        } else if (originalText.includes('Rs.')) {
                            prefix = 'Rs.';
                            decimals = 0;
                        }
                        
                        const counter = new AnimatedCounter(statNumber, targetValue, {
                            duration: 2000,
                            delay: delay,
                            decimals: decimals,
                            suffix: suffix,
                            prefix: prefix
                        });
                        
                        counter.animate();
                    }
                    
                    // Unobserve after animation starts
                    observer.unobserve(container);
                }
            });
        }, observerOptions);
        
        // Observe all stat containers
        statContainers.forEach(container => {
            observer.observe(container);
        });
        
        // Also observe individual stat numbers that might not be in containers
        statNumbers.forEach(statNumber => {
            if (!statNumber.closest('.stat-item, .stat-card, .social-stat')) {
                observer.observe(statNumber);
            }
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAnimatedCounters);
    } else {
        // DOM already loaded
        initAnimatedCounters();
    }
    
    // Re-initialize after dynamic content loads (for dashboard, community pages)
    if (typeof window !== 'undefined') {
        window.initAnimatedCounters = initAnimatedCounters;
        
        // Also listen for custom event to re-initialize
        document.addEventListener('statsLoaded', () => {
            setTimeout(initAnimatedCounters, 200);
        });
    }
    
    // Helper function to manually trigger animation for specific element
    window.animateCounter = function(elementId, targetValue, options = {}) {
        const element = document.getElementById(elementId);
        if (element) {
            const counter = new AnimatedCounter(element, targetValue, options);
            counter.animate();
        }
    };
})();
