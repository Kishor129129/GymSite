/**
 * Modern Toast Notification System
 * Replaces basic alert() and confirm() with elegant notifications
 */

class ToastNotification {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        // Create toast container if it doesn't exist
        if (!document.querySelector('.toast-container')) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        } else {
            this.container = document.querySelector('.toast-container');
        }
    }

    /**
     * Show a toast notification
     * @param {string} type - success, error, warning, info
     * @param {string} title - Toast title
     * @param {string} message - Toast message
     * @param {number} duration - Duration in milliseconds (default: 5000)
     */
    show(type, title, message, duration = 5000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const iconMap = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        toast.innerHTML = `
            <i class="toast-icon ${iconMap[type]}"></i>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
            <div class="toast-progress"></div>
        `;

        this.container.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 100);

        // Auto-remove after duration
        if (duration > 0) {
            const progressBar = toast.querySelector('.toast-progress');
            progressBar.style.width = '100%';
            progressBar.style.transitionDuration = `${duration}ms`;

            setTimeout(() => {
                toast.classList.add('hide');
                setTimeout(() => toast.remove(), 300);
            }, duration);
        }

        return toast;
    }

    /**
     * Show success toast
     */
    success(title, message, duration = 5000) {
        return this.show('success', title, message, duration);
    }

    /**
     * Show error toast
     */
    error(title, message, duration = 7000) {
        return this.show('error', title, message, duration);
    }

    /**
     * Show warning toast
     */
    warning(title, message, duration = 6000) {
        return this.show('warning', title, message, duration);
    }

    /**
     * Show info toast
     */
    info(title, message, duration = 5000) {
        return this.show('info', title, message, duration);
    }

    /**
     * Show confirmation dialog
     * @param {string} title - Dialog title
     * @param {string} message - Dialog message
     * @param {string} confirmText - Confirm button text
     * @param {string} cancelText - Cancel button text
     * @returns {Promise<boolean>} - Returns true if confirmed, false if cancelled
     */
    confirm(title, message, confirmText = 'Confirm', cancelText = 'Cancel') {
        return new Promise((resolve) => {
            // Create overlay
            const overlay = document.createElement('div');
            overlay.className = 'toast-confirm-overlay';
            
            overlay.innerHTML = `
                <div class="toast-confirm">
                    <div class="toast-confirm-header">
                        <i class="toast-confirm-icon fas fa-question-circle"></i>
                        <h3 class="toast-confirm-title">${title}</h3>
                    </div>
                    <div class="toast-confirm-message">${message}</div>
                    <div class="toast-confirm-actions">
                        <button class="toast-confirm-btn cancel">${cancelText}</button>
                        <button class="toast-confirm-btn confirm">${confirmText}</button>
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);

            // Show animation
            setTimeout(() => overlay.classList.add('show'), 100);

            // Event listeners
            const cancelBtn = overlay.querySelector('.cancel');
            const confirmBtn = overlay.querySelector('.confirm');

            const cleanup = () => {
                overlay.classList.remove('show');
                setTimeout(() => overlay.remove(), 300);
            };

            cancelBtn.addEventListener('click', () => {
                cleanup();
                resolve(false);
            });

            confirmBtn.addEventListener('click', () => {
                cleanup();
                resolve(true);
            });

            // Close on overlay click
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    cleanup();
                    resolve(false);
                }
            });

            // Close on Escape key
            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    cleanup();
                    resolve(false);
                    document.removeEventListener('keydown', handleEscape);
                }
            };
            document.addEventListener('keydown', handleEscape);
        });
    }

    /**
     * Show loading toast (persistent until manually closed)
     */
    loading(title, message) {
        return this.show('info', title, message, 0);
    }

    /**
     * Clear all toasts
     */
    clear() {
        const toasts = this.container.querySelectorAll('.toast');
        toasts.forEach(toast => {
            toast.classList.add('hide');
            setTimeout(() => toast.remove(), 300);
        });
    }
}

// Create global instance
window.toast = new ToastNotification();

// Utility functions for easy access
window.showToast = {
    success: (title, message, duration) => window.toast.success(title, message, duration),
    error: (title, message, duration) => window.toast.error(title, message, duration),
    warning: (title, message, duration) => window.toast.warning(title, message, duration),
    info: (title, message, duration) => window.toast.info(title, message, duration),
    confirm: (title, message, confirmText, cancelText) => window.toast.confirm(title, message, confirmText, cancelText),
    loading: (title, message) => window.toast.loading(title, message),
    clear: () => window.toast.clear()
};

// Replace native alert and confirm functions
window.originalAlert = window.alert;
window.originalConfirm = window.confirm;

window.alert = function(message) {
    window.toast.info('Notice', message);
};

window.confirm = function(message) {
    return window.toast.confirm('Confirmation', message);
};
