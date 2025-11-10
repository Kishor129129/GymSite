// Dark Mode / Theme Switcher System
// Provides comprehensive dark mode functionality with system preference detection

(function() {
    'use strict';

    // Theme configuration
    const THEME_STORAGE_KEY = 'gymsite-theme';
    const THEME_LIGHT = 'light';
    const THEME_DARK = 'dark';
    const THEME_AUTO = 'auto';

    // Initialize theme system
    function initTheme() {
        // Get saved theme preference or default to auto
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || THEME_AUTO;
        
        // Apply theme
        applyTheme(savedTheme);
        
        // Create theme switcher button
        createThemeSwitcher();
        
        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', () => {
                const currentTheme = localStorage.getItem(THEME_STORAGE_KEY) || THEME_AUTO;
                if (currentTheme === THEME_AUTO) {
                    applyTheme(THEME_AUTO);
                }
            });
        }
    }

    // Apply theme to document
    function applyTheme(theme) {
        const root = document.documentElement;
        let effectiveTheme = theme;

        // Determine effective theme
        if (theme === THEME_AUTO) {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                effectiveTheme = THEME_DARK;
            } else {
                effectiveTheme = THEME_LIGHT;
            }
        }

        // Apply theme class
        root.classList.remove(THEME_LIGHT, THEME_DARK);
        root.classList.add(effectiveTheme);
        root.setAttribute('data-theme', effectiveTheme);
        root.setAttribute('data-theme-preference', theme);

        // Update theme switcher button if it exists
        updateThemeSwitcherButton(theme);
    }

    // Create theme switcher button
    function createThemeSwitcher() {
        // Check if button already exists
        if (document.getElementById('theme-switcher')) {
            return;
        }

        const nav = document.querySelector('nav');
        if (!nav) return;

        // Create theme switcher container
        const themeSwitcher = document.createElement('div');
        themeSwitcher.id = 'theme-switcher';
        themeSwitcher.className = 'theme-switcher';
        themeSwitcher.setAttribute('aria-label', 'Toggle theme');
        themeSwitcher.setAttribute('title', 'Toggle dark/light mode');

        // Create button
        const button = document.createElement('button');
        button.className = 'theme-toggle-btn';
        button.innerHTML = '<i class="fas fa-moon"></i>';
        button.setAttribute('aria-label', 'Switch theme');

        // Get current theme preference
        const currentTheme = localStorage.getItem(THEME_STORAGE_KEY) || THEME_AUTO;
        updateThemeSwitcherButton(currentTheme);

        // Add click handler
        button.addEventListener('click', toggleTheme);

        themeSwitcher.appendChild(button);

        // Insert into navigation (before close button or at end of links)
        const links = nav.querySelector('.links');
        if (links) {
            // Create a list item for the theme switcher
            const li = document.createElement('li');
            li.className = 'theme-switcher-item';
            li.appendChild(themeSwitcher);
            
            // Insert before the close button or at the end
            const closeBtn = links.querySelector('.close');
            if (closeBtn && closeBtn.parentElement) {
                links.insertBefore(li, closeBtn.parentElement);
            } else {
                links.appendChild(li);
            }
        } else {
            // Fallback: append to nav
            nav.appendChild(themeSwitcher);
        }
    }

    // Update theme switcher button appearance
    function updateThemeSwitcherButton(themePreference) {
        const button = document.querySelector('.theme-toggle-btn');
        if (!button) return;

        const icon = button.querySelector('i');
        if (!icon) return;

        // Update icon and tooltip based on current preference
        switch(themePreference) {
            case THEME_DARK:
                icon.className = 'fas fa-sun';
                button.setAttribute('title', 'Switch to light mode');
                break;
            case THEME_LIGHT:
                icon.className = 'fas fa-moon';
                button.setAttribute('title', 'Switch to dark mode');
                break;
            case THEME_AUTO:
            default:
                // Show icon based on current effective theme
                const effectiveTheme = document.documentElement.getAttribute('data-theme');
                if (effectiveTheme === THEME_DARK) {
                    icon.className = 'fas fa-adjust';
                } else {
                    icon.className = 'fas fa-adjust';
                }
                button.setAttribute('title', 'Theme: Auto (follows system)');
                break;
        }
    }

    // Toggle theme
    function toggleTheme() {
        const currentTheme = localStorage.getItem(THEME_STORAGE_KEY) || THEME_AUTO;
        let newTheme;

        // Cycle through themes: auto -> light -> dark -> auto
        switch(currentTheme) {
            case THEME_AUTO:
                newTheme = THEME_LIGHT;
                break;
            case THEME_LIGHT:
                newTheme = THEME_DARK;
                break;
            case THEME_DARK:
                newTheme = THEME_AUTO;
                break;
            default:
                newTheme = THEME_AUTO;
        }

        // Save preference
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);

        // Apply theme
        applyTheme(newTheme);

        // Show feedback
        const themeNames = {
            [THEME_AUTO]: 'Auto (System)',
            [THEME_LIGHT]: 'Light',
            [THEME_DARK]: 'Dark'
        };

        if (typeof showToast !== 'undefined') {
            showToast.info('Theme Changed', `Switched to ${themeNames[newTheme]} theme`);
        }
    }

    // Get current theme
    function getCurrentTheme() {
        return localStorage.getItem(THEME_STORAGE_KEY) || THEME_AUTO;
    }

    // Get effective theme (light or dark)
    function getEffectiveTheme() {
        return document.documentElement.getAttribute('data-theme') || THEME_LIGHT;
    }

    // Expose API
    window.themeManager = {
        toggle: toggleTheme,
        setTheme: function(theme) {
            if ([THEME_LIGHT, THEME_DARK, THEME_AUTO].includes(theme)) {
                localStorage.setItem(THEME_STORAGE_KEY, theme);
                applyTheme(theme);
            }
        },
        getTheme: getCurrentTheme,
        getEffectiveTheme: getEffectiveTheme
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }
})();

