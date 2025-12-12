/**
 * Enhanced Navigation System
 * Features:
 * - Sticky navigation on scroll
 * - Active section highlighting based on scroll position
 * - Smooth scroll behavior
 * - Scroll progress indicator
 * - Enhanced mobile menu with animations
 * - Logo click scroll to top
 */

(function() {
    'use strict';

    // Navigation state
    const navState = {
        isSticky: false,
        currentSection: null,
        scrollProgress: 0,
        isMobileMenuOpen: false
    };

    // DOM Elements
    let navElement = null;
    let headerElement = null;
    let navLinks = null;
    let logoElement = null;
    let openMenuBtn = null;
    let closeMenuBtn = null;
    let mainMenu = null;
    let scrollProgressBar = null;

    // Initialize navigation system
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupNavigation);
        } else {
            setupNavigation();
        }
    }

    function setupNavigation() {
        // Get navigation elements
        navElement = document.querySelector('nav');
        headerElement = document.querySelector('header');
        navLinks = document.querySelectorAll('.links a');
        logoElement = document.querySelector('.logo');
        openMenuBtn = document.querySelector('.open');
        closeMenuBtn = document.querySelector('.close');
        mainMenu = document.querySelector('.links');

        if (!navElement || !headerElement) {
            console.warn('Navigation elements not found');
            return;
        }

        // Create scroll progress bar
        createScrollProgressBar();

        // Setup event listeners
        setupEventListeners();

        // Initialize active section detection
        initActiveSectionDetection();

        // Setup mobile menu
        setupMobileMenu();

        // Setup logo click handler
        setupLogoClick();

        // Initial check
        checkScrollPosition();
    }

    function createScrollProgressBar() {
        // Create scroll progress bar element
        scrollProgressBar = document.createElement('div');
        scrollProgressBar.className = 'scroll-progress-bar';
        scrollProgressBar.innerHTML = '<div class="scroll-progress-fill"></div>';
        document.body.appendChild(scrollProgressBar);

        // Add CSS if not already added
        if (!document.getElementById('enhanced-nav-styles')) {
            const style = document.createElement('style');
            style.id = 'enhanced-nav-styles';
            style.textContent = `
                .scroll-progress-bar {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 3px;
                    background: rgba(255, 255, 255, 0.1);
                    z-index: 10000;
                    pointer-events: none;
                    transition: opacity 0.3s ease;
                }

                .scroll-progress-fill {
                    height: 100%;
                    width: 0%;
                    background: linear-gradient(90deg, yellowgreen, #8bb83a);
                    transition: width 0.1s ease;
                    box-shadow: 0 0 10px rgba(154, 205, 50, 0.5);
                }

                nav.sticky {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    background: rgba(0, 0, 0, 0.95);
                    backdrop-filter: blur(10px);
                    z-index: 9999;
                    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
                    animation: slideDown 0.3s ease;
                    padding: 1% 6%;
                }

                @keyframes slideDown {
                    from {
                        transform: translateY(-100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                nav.sticky .logo {
                    font-size: 2.5rem;
                    transition: font-size 0.3s ease;
                }

                nav.sticky ~ header {
                    padding-top: 80px;
                }

                nav .links li a {
                    position: relative;
                    transition: all 0.3s ease;
                }

                nav .links li a::after {
                    content: '';
                    position: absolute;
                    bottom: -5px;
                    left: 0;
                    width: 0;
                    height: 2px;
                    background: yellowgreen;
                    transition: width 0.3s ease;
                }

                nav .links li a:hover::after,
                nav .links li a.active::after {
                    width: 100%;
                }

                nav .links li a.active {
                    color: yellowgreen;
                    font-weight: 600;
                }

                /* Enhanced mobile menu animations */
                nav .links.menu-open {
                    right: 0 !important;
                    animation: slideInRight 0.3s ease;
                }

                @keyframes slideInRight {
                    from {
                        right: -60%;
                        opacity: 0;
                    }
                    to {
                        right: 0;
                        opacity: 1;
                    }
                }

                nav .links.menu-closing {
                    animation: slideOutRight 0.3s ease;
                }

                @keyframes slideOutRight {
                    from {
                        right: 0;
                        opacity: 1;
                    }
                    to {
                        right: -60%;
                        opacity: 0;
                    }
                }

                /* Mobile menu backdrop */
                .menu-backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 9998;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.3s ease;
                }

                .menu-backdrop.active {
                    opacity: 1;
                    pointer-events: all;
                }

                /* Smooth scroll behavior */
                html {
                    scroll-behavior: smooth;
                }

                /* Navigation link hover effects */
                nav .links li a {
                    padding: 0.5rem 1rem;
                    border-radius: 5px;
                    transition: all 0.3s ease;
                }

                nav .links li a:hover {
                    background: rgba(154, 205, 50, 0.1);
                    transform: translateY(-2px);
                }

                /* Logo hover effect */
                nav .logo {
                    transition: transform 0.3s ease;
                    cursor: pointer;
                }

                nav .logo:hover {
                    transform: scale(1.05);
                }

                /* Mobile menu item animations */
                @media (max-width: 850px) {
                    nav .links li {
                        opacity: 0;
                        transform: translateX(-20px);
                        animation: fadeInSlide 0.3s ease forwards;
                    }

                    nav .links.menu-open li:nth-child(1) { animation-delay: 0.1s; }
                    nav .links.menu-open li:nth-child(2) { animation-delay: 0.15s; }
                    nav .links.menu-open li:nth-child(3) { animation-delay: 0.2s; }
                    nav .links.menu-open li:nth-child(4) { animation-delay: 0.25s; }
                    nav .links.menu-open li:nth-child(5) { animation-delay: 0.3s; }
                    nav .links.menu-open li:nth-child(6) { animation-delay: 0.35s; }
                    nav .links.menu-open li:nth-child(7) { animation-delay: 0.4s; }
                    nav .links.menu-open li:nth-child(8) { animation-delay: 0.45s; }
                    nav .links.menu-open li:nth-child(9) { animation-delay: 0.5s; }
                    nav .links.menu-open li:nth-child(10) { animation-delay: 0.55s; }

                    @keyframes fadeInSlide {
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    function setupEventListeners() {
        // Scroll event listener with throttling
        let scrollTimeout = null;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                cancelAnimationFrame(scrollTimeout);
            }
            scrollTimeout = requestAnimationFrame(() => {
                checkScrollPosition();
                updateScrollProgress();
                updateActiveSection();
            });
        }, { passive: true });

        // Resize event listener
        let resizeTimeout = null;
        window.addEventListener('resize', () => {
            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }
            resizeTimeout = setTimeout(() => {
                checkScrollPosition();
                if (window.innerWidth > 850 && navState.isMobileMenuOpen) {
                    closeMobileMenu();
                }
            }, 250);
        });
    }

    function checkScrollPosition() {
        if (!navElement || !headerElement) return;

        const headerHeight = headerElement.offsetHeight;
        const scrollY = window.scrollY || window.pageYOffset;

        // Make nav sticky when scrolled past header
        if (scrollY > headerHeight * 0.7 && !navState.isSticky) {
            navElement.classList.add('sticky');
            navState.isSticky = true;
        } else if (scrollY <= headerHeight * 0.7 && navState.isSticky) {
            navElement.classList.remove('sticky');
            navState.isSticky = false;
        }
    }

    function updateScrollProgress() {
        if (!scrollProgressBar) return;

        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY || window.pageYOffset;
        const scrollableHeight = documentHeight - windowHeight;
        
        if (scrollableHeight > 0) {
            navState.scrollProgress = (scrollTop / scrollableHeight) * 100;
            const progressFill = scrollProgressBar.querySelector('.scroll-progress-fill');
            if (progressFill) {
                progressFill.style.width = navState.scrollProgress + '%';
            }
        }
    }

    function initActiveSectionDetection() {
        // Get all sections with IDs
        const sections = document.querySelectorAll('section[id]');
        
        if (sections.length === 0) return;

        // Create Intersection Observer for active section detection
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    setActiveSection(sectionId);
                }
            });
        }, observerOptions);

        // Observe all sections
        sections.forEach(section => {
            observer.observe(section);
        });
    }

    function setActiveSection(sectionId) {
        if (!navLinks || navState.currentSection === sectionId) return;

        navState.currentSection = sectionId;

        // Remove active class from all links
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to matching link
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${sectionId}` || href.endsWith(`#${sectionId}`)) {
                link.classList.add('active');
            }
        });
    }

    function updateActiveSection() {
        // Fallback method using scroll position
        if (!navLinks) return;

        const scrollY = window.scrollY || window.pageYOffset;
        const sections = document.querySelectorAll('section[id]');
        
        let currentSection = null;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        if (currentSection && currentSection !== navState.currentSection) {
            setActiveSection(currentSection);
        }
    }

    function setupMobileMenu() {
        if (!openMenuBtn || !closeMenuBtn || !mainMenu) return;

        // Create backdrop element
        const backdrop = document.createElement('div');
        backdrop.className = 'menu-backdrop';
        document.body.appendChild(backdrop);

        // Open menu handler
        openMenuBtn.addEventListener('click', () => {
            openMobileMenu();
        });

        // Close menu handlers
        closeMenuBtn.addEventListener('click', () => {
            closeMobileMenu();
        });

        backdrop.addEventListener('click', () => {
            closeMobileMenu();
        });

        // Close menu on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navState.isMobileMenuOpen) {
                closeMobileMenu();
            }
        });

        // Close menu when clicking nav links (mobile)
        if (navLinks) {
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth <= 850 && navState.isMobileMenuOpen) {
                        setTimeout(() => {
                            closeMobileMenu();
                        }, 150);
                    }
                });
            });
        }
    }

    function openMobileMenu() {
        if (!mainMenu) return;

        navState.isMobileMenuOpen = true;
        mainMenu.style.display = 'flex';
        mainMenu.classList.remove('menu-closing');
        mainMenu.classList.add('menu-open');
        
        const backdrop = document.querySelector('.menu-backdrop');
        if (backdrop) {
            backdrop.classList.add('active');
        }

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        if (!mainMenu) return;

        navState.isMobileMenuOpen = false;
        mainMenu.classList.remove('menu-open');
        mainMenu.classList.add('menu-closing');
        
        const backdrop = document.querySelector('.menu-backdrop');
        if (backdrop) {
            backdrop.classList.remove('active');
        }

        // Restore body scroll
        document.body.style.overflow = '';

        setTimeout(() => {
            if (!navState.isMobileMenuOpen) {
                mainMenu.style.right = '-60%';
                mainMenu.classList.remove('menu-closing');
            }
        }, 300);
    }

    function setupLogoClick() {
        if (!logoElement) return;

        logoElement.addEventListener('click', () => {
            // Smooth scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            if (navState.isMobileMenuOpen) {
                closeMobileMenu();
            }
        });
    }

    // Enhanced smooth scroll for anchor links
    function enhanceAnchorLinks() {
        if (!navLinks) return;

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Check if it's an anchor link
                if (href && href.startsWith('#')) {
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        e.preventDefault();
                        
                        const navHeight = navState.isSticky ? navElement.offsetHeight : 0;
                        const targetPosition = targetElement.offsetTop - navHeight - 20;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    // Initialize when DOM is ready
    init();

    // Enhance anchor links after a short delay to ensure DOM is fully loaded
    setTimeout(() => {
        enhanceAnchorLinks();
    }, 100);

    // Expose API for external use
    window.enhancedNavigation = {
        openMobileMenu: openMobileMenu,
        closeMobileMenu: closeMobileMenu,
        setActiveSection: setActiveSection,
        scrollToSection: (sectionId) => {
            const element = document.getElementById(sectionId);
            if (element) {
                const navHeight = navState.isSticky ? navElement.offsetHeight : 0;
                const targetPosition = element.offsetTop - navHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    };
})();

