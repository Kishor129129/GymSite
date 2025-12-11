/**
 * Global Search Feature
 * Provides site-wide search functionality with keyboard shortcuts
 * Press Ctrl+K (or Cmd+K on Mac) to open search
 */

(function() {
    'use strict';

    // Search data structure
    const searchData = {
        classes: [
            { name: 'Morning Yoga', trainer: 'Sarah Johnson', time: '7:00 AM - 8:00 AM', days: 'Mon, Wed, Fri', link: 'classes.html', type: 'class' },
            { name: 'Boxing Training', trainer: 'Mike Chen', time: '6:00 PM - 7:00 PM', days: 'Tue, Thu, Sat', link: 'classes.html', type: 'class' },
            { name: 'HIIT Cardio', trainer: 'Lisa Rodriguez', time: '8:00 AM - 9:00 AM', days: 'Mon, Wed, Fri', link: 'classes.html', type: 'class' },
            { name: 'Strength Training', trainer: 'David Wilson', time: '7:00 PM - 8:00 PM', days: 'Tue, Thu, Sat', link: 'classes.html', type: 'class' },
            { name: 'Pilates', trainer: 'Emma Thompson', time: '10:00 AM - 11:00 AM', days: 'Mon, Wed, Fri', link: 'classes.html', type: 'class' },
            { name: 'Zumba Dance', trainer: 'Maria Garcia', time: '6:30 PM - 7:30 PM', days: 'Mon, Wed, Fri', link: 'classes.html', type: 'class' }
        ],
        trainers: [
            { name: 'Trainer 1', role: 'Online Coach', link: 'index.html#trainers1', type: 'trainer' },
            { name: 'Trainer 2', role: 'Offline Coach', link: 'index.html#trainers1', type: 'trainer' },
            { name: 'Trainer 3', role: 'Offline Coach', link: 'index.html#trainers1', type: 'trainer' },
            { name: 'Trainer 4', role: 'Offline Coach', link: 'index.html#trainers1', type: 'trainer' },
            { name: 'Sarah Johnson', role: 'Yoga Instructor', link: 'classes.html', type: 'trainer' },
            { name: 'Mike Chen', role: 'Boxing Trainer', link: 'classes.html', type: 'trainer' },
            { name: 'Lisa Rodriguez', role: 'Cardio Instructor', link: 'classes.html', type: 'trainer' },
            { name: 'David Wilson', role: 'Strength Trainer', link: 'classes.html', type: 'trainer' },
            { name: 'Emma Thompson', role: 'Pilates Instructor', link: 'classes.html', type: 'trainer' },
            { name: 'Maria Garcia', role: 'Zumba Instructor', link: 'classes.html', type: 'trainer' }
        ],
        services: [
            { name: 'Treadmill', description: 'High-quality cardio equipment', link: 'index.html#services1', type: 'service' },
            { name: 'Yoga', description: 'Mind and body wellness', link: 'index.html#services1', type: 'service' },
            { name: 'Equipment', description: 'State-of-the-art gym equipment', link: 'index.html#services1', type: 'service' },
            { name: 'Personal Trainer', description: 'Dedicated trainers', link: 'index.html#services1', type: 'service' },
            { name: 'Boxing', description: 'Professional boxing training', link: 'index.html#services1', type: 'service' },
            { name: 'Weight Lifting', description: 'Premium weightlifting area', link: 'index.html#services1', type: 'service' }
        ],
        pages: [
            { name: 'Dashboard', description: 'Track your fitness journey', link: 'dashboard.html', type: 'page' },
            { name: 'Classes', description: 'Book classes and view schedule', link: 'classes.html', type: 'page' },
            { name: 'Nutrition', description: 'Meal planning and tracking', link: 'nutrition.html', type: 'page' },
            { name: 'Community', description: 'Connect with fitness enthusiasts', link: 'community.html', type: 'page' },
            { name: 'Payment', description: 'Membership plans and pricing', link: 'payment.html', type: 'page' }
        ],
        plans: [
            { name: 'Basic Plan', price: 'Rs. 199', duration: '1 month', link: 'index.html#pricing_table1', type: 'plan' },
            { name: 'Standard Plan', price: 'Rs. 499', duration: '3 months', link: 'index.html#pricing_table1', type: 'plan' },
            { name: 'Premium Plan', price: 'Rs. 899', duration: '6 months', link: 'index.html#pricing_table1', type: 'plan' }
        ]
    };

    // Create search modal HTML
    function createSearchModal() {
        const modal = document.createElement('div');
        modal.id = 'globalSearchModal';
        modal.className = 'global-search-modal';
        modal.innerHTML = `
            <div class="search-overlay"></div>
            <div class="search-container">
                <div class="search-header">
                    <div class="search-input-wrapper">
                        <i class="fas fa-search search-icon"></i>
                        <input 
                            type="text" 
                            id="globalSearchInput" 
                            class="search-input" 
                            placeholder="Search classes, trainers, services..."
                            autocomplete="off"
                        />
                        <button class="search-close" id="searchCloseBtn" aria-label="Close search">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="search-shortcut-hint">
                        <kbd>Esc</kbd> to close
                    </div>
                </div>
                <div class="search-results" id="searchResults">
                    <div class="search-empty">
                        <i class="fas fa-search"></i>
                        <p>Start typing to search...</p>
                        <div class="search-suggestions">
                            <span class="suggestion-tag">Try: "yoga"</span>
                            <span class="suggestion-tag">"boxing"</span>
                            <span class="suggestion-tag">"trainer"</span>
                            <span class="suggestion-tag">"nutrition"</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        return modal;
    }

    // Initialize search modal
    let searchModal = null;
    let searchInput = null;
    let searchResults = null;
    let selectedIndex = -1;
    let currentResults = [];

    function initSearch() {
        if (document.getElementById('globalSearchModal')) {
            searchModal = document.getElementById('globalSearchModal');
        } else {
            searchModal = createSearchModal();
        }
        
        searchInput = document.getElementById('globalSearchInput');
        searchResults = document.getElementById('searchResults');
        const overlay = searchModal.querySelector('.search-overlay');
        const closeBtn = document.getElementById('searchCloseBtn');

        // Open search modal
        function openSearch() {
            searchModal.classList.add('active');
            searchInput.focus();
            document.body.style.overflow = 'hidden';
        }

        // Close search modal
        function closeSearch() {
            searchModal.classList.remove('active');
            searchInput.value = '';
            searchResults.innerHTML = `
                <div class="search-empty">
                    <i class="fas fa-search"></i>
                    <p>Start typing to search...</p>
                    <div class="search-suggestions">
                        <span class="suggestion-tag">Try: "yoga"</span>
                        <span class="suggestion-tag">"boxing"</span>
                        <span class="suggestion-tag">"trainer"</span>
                        <span class="suggestion-tag">"nutrition"</span>
                    </div>
                </div>
            `;
            selectedIndex = -1;
            currentResults = [];
            document.body.style.overflow = '';
        }

        // Search function
        function performSearch(query) {
            if (!query || query.trim().length < 1) {
                searchResults.innerHTML = `
                    <div class="search-empty">
                        <i class="fas fa-search"></i>
                        <p>Start typing to search...</p>
                        <div class="search-suggestions">
                            <span class="suggestion-tag">Try: "yoga"</span>
                            <span class="suggestion-tag">"boxing"</span>
                            <span class="suggestion-tag">"trainer"</span>
                            <span class="suggestion-tag">"nutrition"</span>
                        </div>
                    </div>
                `;
                currentResults = [];
                return;
            }

            const lowerQuery = query.toLowerCase();
            const results = [];

            // Search classes
            searchData.classes.forEach(item => {
                const score = calculateScore(item.name, item.trainer, item.time, lowerQuery);
                if (score > 0) {
                    results.push({ ...item, score, category: 'Classes' });
                }
            });

            // Search trainers
            searchData.trainers.forEach(item => {
                const score = calculateScore(item.name, item.role, lowerQuery);
                if (score > 0) {
                    results.push({ ...item, score, category: 'Trainers' });
                }
            });

            // Search services
            searchData.services.forEach(item => {
                const score = calculateScore(item.name, item.description, lowerQuery);
                if (score > 0) {
                    results.push({ ...item, score, category: 'Services' });
                }
            });

            // Search pages
            searchData.pages.forEach(item => {
                const score = calculateScore(item.name, item.description, lowerQuery);
                if (score > 0) {
                    results.push({ ...item, score, category: 'Pages' });
                }
            });

            // Search plans
            searchData.plans.forEach(item => {
                const score = calculateScore(item.name, item.price, item.duration, lowerQuery);
                if (score > 0) {
                    results.push({ ...item, score, category: 'Plans' });
                }
            });

            // Sort by score
            results.sort((a, b) => b.score - a.score);
            currentResults = results.slice(0, 10); // Limit to 10 results

            displayResults(currentResults, query);
        }

        // Calculate search score
        function calculateScore(...fields) {
            const query = fields.pop().toLowerCase();
            let score = 0;
            
            fields.forEach(field => {
                if (!field) return;
                const fieldLower = String(field).toLowerCase();
                
                // Exact match gets highest score
                if (fieldLower === query) {
                    score += 100;
                }
                // Starts with query
                else if (fieldLower.startsWith(query)) {
                    score += 50;
                }
                // Contains query
                else if (fieldLower.includes(query)) {
                    score += 25;
                }
                // Word match
                else {
                    const words = fieldLower.split(/\s+/);
                    words.forEach(word => {
                        if (word.startsWith(query)) score += 10;
                        else if (word.includes(query)) score += 5;
                    });
                }
            });
            
            return score;
        }

        // Highlight search term in text
        function highlightText(text, query) {
            if (!query) return text;
            const regex = new RegExp(`(${query})`, 'gi');
            return text.replace(regex, '<mark>$1</mark>');
        }

        // Display search results
        function displayResults(results, query) {
            if (results.length === 0) {
                searchResults.innerHTML = `
                    <div class="search-empty">
                        <i class="fas fa-search"></i>
                        <p>No results found for "${query}"</p>
                        <div class="search-suggestions">
                            <span class="suggestion-tag">Try different keywords</span>
                            <span class="suggestion-tag">Check spelling</span>
                        </div>
                    </div>
                `;
                selectedIndex = -1;
                return;
            }

            // Group results by category
            const grouped = {};
            results.forEach(result => {
                if (!grouped[result.category]) {
                    grouped[result.category] = [];
                }
                grouped[result.category].push(result);
            });

            let html = '';
            Object.keys(grouped).forEach(category => {
                html += `<div class="search-category">
                    <h4 class="category-title">${category}</h4>
                    <div class="category-results">`;
                
                grouped[category].forEach((result, index) => {
                    const globalIndex = results.indexOf(result);
                    html += `
                        <div class="search-result-item" data-index="${globalIndex}" data-link="${result.link}">
                            <div class="result-icon">
                                ${getIconForType(result.type)}
                            </div>
                            <div class="result-content">
                                <h5 class="result-title">${highlightText(result.name, query)}</h5>
                                ${result.trainer ? `<p class="result-meta">${highlightText(result.trainer, query)}</p>` : ''}
                                ${result.role ? `<p class="result-meta">${highlightText(result.role, query)}</p>` : ''}
                                ${result.description ? `<p class="result-description">${highlightText(result.description, query)}</p>` : ''}
                                ${result.time ? `<p class="result-meta"><i class="fas fa-clock"></i> ${result.time}</p>` : ''}
                                ${result.days ? `<p class="result-meta"><i class="fas fa-calendar"></i> ${result.days}</p>` : ''}
                            </div>
                            <div class="result-arrow">
                                <i class="fas fa-chevron-right"></i>
                            </div>
                        </div>
                    `;
                });
                
                html += `</div></div>`;
            });

            searchResults.innerHTML = html;

            // Add click handlers
            document.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', function() {
                    const link = this.getAttribute('data-link');
                    if (link) {
                        window.location.href = link;
                        closeSearch();
                    }
                });
            });
        }

        // Get icon for result type
        function getIconForType(type) {
            const icons = {
                'class': '<i class="fas fa-dumbbell"></i>',
                'trainer': '<i class="fas fa-user-tie"></i>',
                'service': '<i class="fas fa-cog"></i>',
                'page': '<i class="fas fa-file-alt"></i>',
                'plan': '<i class="fas fa-tag"></i>'
            };
            return icons[type] || '<i class="fas fa-circle"></i>';
        }

        // Keyboard navigation
        function handleKeyboard(e) {
            if (!searchModal.classList.contains('active')) return;

            const items = document.querySelectorAll('.search-result-item');
            
            switch(e.key) {
                case 'Escape':
                    e.preventDefault();
                    closeSearch();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
                    updateSelection(items);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    selectedIndex = Math.max(selectedIndex - 1, -1);
                    updateSelection(items);
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (selectedIndex >= 0 && items[selectedIndex]) {
                        const link = items[selectedIndex].getAttribute('data-link');
                        if (link) {
                            window.location.href = link;
                            closeSearch();
                        }
                    } else if (currentResults.length > 0) {
                        const link = currentResults[0].link;
                        if (link) {
                            window.location.href = link;
                            closeSearch();
                        }
                    }
                    break;
            }
        }

        function updateSelection(items) {
            items.forEach((item, index) => {
                item.classList.toggle('selected', index === selectedIndex);
            });
            if (selectedIndex >= 0 && items[selectedIndex]) {
                items[selectedIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        }

        // Event listeners
        searchInput.addEventListener('input', function() {
            performSearch(this.value);
            selectedIndex = -1;
        });

        searchInput.addEventListener('keydown', handleKeyboard);
        
        overlay.addEventListener('click', closeSearch);
        closeBtn.addEventListener('click', closeSearch);

        // Keyboard shortcut: Ctrl+K or Cmd+K
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                openSearch();
            }
        });

        // Prevent default search behavior in browser
        document.addEventListener('keydown', function(e) {
            if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                e.preventDefault();
                openSearch();
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSearch);
    } else {
        initSearch();
    }

    // Expose API
    window.globalSearch = {
        open: function() {
            const modal = document.getElementById('globalSearchModal');
            if (modal) {
                modal.classList.add('active');
                const input = document.getElementById('globalSearchInput');
                if (input) {
                    input.focus();
                    document.body.style.overflow = 'hidden';
                }
            }
        },
        close: function() {
            const modal = document.getElementById('globalSearchModal');
            if (modal) {
                modal.classList.remove('active');
                const input = document.getElementById('globalSearchInput');
                if (input) input.value = '';
                document.body.style.overflow = '';
            }
        }
    };
})();

