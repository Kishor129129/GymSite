// Loading Spinner System
(function() {
    'use strict';

    const SPINNER_CONTAINER_ID = 'loading-spinner-container';
    let spinnerContainer = null;

    // Create spinner container
    function createSpinnerContainer() {
        if (spinnerContainer) return spinnerContainer;

        spinnerContainer = document.createElement('div');
        spinnerContainer.id = SPINNER_CONTAINER_ID;
        spinnerContainer.className = 'loading-spinner-container';
        spinnerContainer.setAttribute('aria-live', 'polite');
        spinnerContainer.setAttribute('aria-label', 'Loading');
        
        spinnerContainer.innerHTML = `
            <div class="loading-spinner-overlay">
                <div class="loading-spinner-wrapper">
                    <div class="loading-spinner">
                        <div class="spinner-ring"></div>
                        <div class="spinner-ring"></div>
                        <div class="spinner-ring"></div>
                        <div class="spinner-ring"></div>
                    </div>
                    <div class="loading-spinner-text">Loading...</div>
                </div>
            </div>
        `;

        document.body.appendChild(spinnerContainer);
        return spinnerContainer;
    }

    // Show loading spinner
    function showSpinner(message = 'Loading...', options = {}) {
        const container = createSpinnerContainer();
        const overlay = container.querySelector('.loading-spinner-overlay');
        const textElement = container.querySelector('.loading-spinner-text');
        
        // Set custom message
        if (textElement) {
            textElement.textContent = message;
        }

        // Apply options
        if (options.size) {
            container.classList.add(`spinner-${options.size}`);
        }
        
        if (options.type) {
            container.classList.add(`spinner-${options.type}`);
        }

        // Show spinner
        container.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Return hide function
        return function hide() {
            hideSpinner();
        };
    }

    // Hide loading spinner
    function hideSpinner() {
        if (!spinnerContainer) return;

        spinnerContainer.classList.remove('active');
        document.body.style.overflow = '';

        // Remove size and type classes
        spinnerContainer.className = 'loading-spinner-container';
        spinnerContainer.classList.add('loading-spinner-container');
    }

    // Show button spinner (inline spinner for buttons)
    function showButtonSpinner(button, text = null) {
        if (!button) return null;

        const originalText = button.innerHTML;
        const originalDisabled = button.disabled;
        
        button.disabled = true;
        button.dataset.originalText = originalText;
        button.dataset.originalDisabled = originalDisabled;
        
        const spinnerHTML = `
            <span class="button-spinner">
                <span class="button-spinner-ring"></span>
            </span>
            ${text !== null ? `<span class="button-spinner-text">${text}</span>` : ''}
        `;
        
        button.innerHTML = spinnerHTML;
        button.classList.add('loading');

        // Return hide function
        return function hide() {
            hideButtonSpinner(button);
        };
    }

    // Hide button spinner
    function hideButtonSpinner(button) {
        if (!button) return;

        const originalText = button.dataset.originalText || button.textContent;
        const originalDisabled = button.dataset.originalDisabled === 'true';

        button.innerHTML = originalText;
        button.disabled = originalDisabled;
        button.classList.remove('loading');
        
        delete button.dataset.originalText;
        delete button.dataset.originalDisabled;
    }

    // Show inline spinner (for specific elements)
    function showInlineSpinner(element, message = 'Loading...') {
        if (!element) return null;

        const spinnerHTML = `
            <div class="inline-spinner">
                <div class="inline-spinner-ring"></div>
                <span class="inline-spinner-text">${message}</span>
            </div>
        `;

        element.innerHTML = spinnerHTML;
        element.classList.add('has-spinner');

        // Return hide function
        return function hide() {
            hideInlineSpinner(element);
        };
    }

    // Hide inline spinner
    function hideInlineSpinner(element) {
        if (!element) return;
        element.classList.remove('has-spinner');
    }

    // Wrap async function with spinner
    async function withSpinner(asyncFunction, message = 'Loading...', options = {}) {
        const hide = showSpinner(message, options);
        
        try {
            const result = await asyncFunction();
            return result;
        } finally {
            hide();
        }
    }

    // Wrap button click with spinner
    function wrapButtonClick(button, asyncFunction, loadingText = null) {
        if (!button) return;

        button.addEventListener('click', async function(e) {
            e.preventDefault();
            
            const hide = showButtonSpinner(button, loadingText);
            
            try {
                await asyncFunction();
            } catch (error) {
                console.error('Error in wrapped function:', error);
                if (window.showToast) {
                    window.showToast.error('Error', error.message || 'An error occurred');
                }
            } finally {
                hide();
            }
        });
    }

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', function() {
        // Auto-wrap form submissions
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            if (form.dataset.spinner === 'true' || form.classList.contains('auto-spinner')) {
                form.addEventListener('submit', function(e) {
                    const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
                    if (submitButton) {
                        showButtonSpinner(submitButton, 'Processing...');
                    } else {
                        showSpinner('Processing...');
                    }
                });
            }
        });
    });

    // Expose API
    window.loadingSpinner = {
        show: showSpinner,
        hide: hideSpinner,
        showButton: showButtonSpinner,
        hideButton: hideButtonSpinner,
        showInline: showInlineSpinner,
        hideInline: hideInlineSpinner,
        withSpinner: withSpinner,
        wrapButton: wrapButtonClick
    };
})();

