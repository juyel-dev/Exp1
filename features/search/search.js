export default class SearchFeature {
    constructor(app) {
        this.app = app;
        this.name = 'search';
        this.searchIndex = [];
        this.isSearchActive = false;
        this.currentQuery = '';
    }

    async init() {
        console.log('🚀 Search feature initializing...');
        
        await this.loadHTML();
        this.loadCSS();
        this.setupEventListeners();
        await this.buildSearchIndex();
        
        console.log('✅ Search feature ready!');
    }

    async loadHTML() {
        const html = `
            <div class="search-overlay" id="search-overlay" style="display: none;">
                <div class="search-backdrop" id="search-backdrop"></div>
                <div class="search-modal">
                    <div class="search-header">
                        <div class="search-input-container">
                            <i class="fas fa-search search-icon"></i>
                            <input type="text" 
                                   class="search-input" 
                                   id="global-search-input" 
                                   placeholder="Search graphs, subjects, tags... (Press / to focus)"
                                   autocomplete="off">
                            <div class="search-shortcut">/</div>
                            <button class="search-clear" id="search-clear-btn" style="display: none;">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <button class="search-close" id="search-close-btn">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <div class="search-content">
                        <div class="search-suggestions" id="search-suggestions">
                            <div class="suggestions-header">
                                <h3>Quick Suggestions</h3>
                            </div>
                            <div class="suggestions-grid">
                                <button class="suggestion-chip" data-query="physics waves">
                                    <i class="fas fa-atom"></i>
                                    Physics Waves
                                </button>
                                <button class="suggestion-chip" data-query="chemical reactions">
                                    <i class="fas fa-vial"></i>
                                    Chemical Reactions
                                </button>
                                <button class="suggestion-chip" data-query="biology growth">
                                    <i class="fas fa-dna"></i>
                                    Biology Growth
                                </button>
                                <button class="suggestion-chip" data-query="mathematics functions">
                                    <i class="fas fa-calculator"></i>
                                    Math Functions
                                </button>
                            </div>
                        </div>

                        <div class="search-results" id="search-results" style="display: none;">
                            <div class="results-header">
                                <h3>Search Results</h3>
                                <span class="results-count" id="results-count">0 results</span>
                            </div>
                            <div class="results-list" id="results-list">
                                <!-- Results will be populated here -->
                            </div>
                        </div>

                        <div class="search-empty" id="search-empty" style="display: none;">
                            <div class="empty-icon">
                                <i class="fas fa-search"></i>
                            </div>
                            <h3>No results found</h3>
                            <p>Try different keywords or check the spelling</p>
                            <div class="empty-suggestions">
                                <span>Try searching for:</span>
                                <button class="suggestion-link" data-query="waves">waves</button>
                                <button class="suggestion-link" data-query="chemistry">chemistry</button>
                                <button class="suggestion-link" data-query="graphs">graphs</button>
                            </div>
                        </div>

                        <div class="search-recent" id="search-recent">
                            <div class="recent-header">
                                <h3>Recent Searches</h3>
                                <button class="clear-recent" id="clear-recent">Clear All</button>
                            </div>
                            <div class="recent-list" id="recent-list">
                                <!-- Recent searches will be populated here -->
                            </div>
                        </div>

                        <div class="search-tips">
                            <div class="tips-header">
                                <i class="fas fa-lightbulb"></i>
                                <span>Search Tips</span>
                            </div>
                            <div class="tips-list">
                                <div class="tip-item">
                                    <span class="tip-keyword">physics waves</span>
                                    <span>Search for physics-related wave graphs</span>
                                </div>
                                <div class="tip-item">
                                    <span class="tip-keyword">tag:interference</span>
                                    <span>Search by specific tag</span>
                                </div>
                                <div class="tip-item">
                                    <span class="tip-keyword">subject:chemistry</span>
                                    <span>Filter by subject</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Search Trigger -->
            <div class="quick-search-trigger" id="quick-search-trigger">
                <div class="trigger-content">
                    <i class="fas fa-search"></i>
                    <span>Search Graphs...</span>
                    <div class="search-shortcut">/</div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', html);
    }

    loadCSS() {
        const style = document.createElement('style');
        style.textContent = `
            .search-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 3000;
                font-family: inherit;
            }
            
            .search-backdrop {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(5px);
            }
            
            .search-modal {
                position: absolute;
                top: 20%;
                left: 50%;
                transform: translateX(-50%);
                width: 90%;
                max-width: 700px;
                background: white;
                border-radius: 1rem;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                overflow: hidden;
                animation: searchSlideIn 0.3s ease-out;
            }
            
            @keyframes searchSlideIn {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
            
            .search-header {
                padding: 1.5rem;
                border-bottom: 1px solid #e2e8f0;
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            
            .search-input-container {
                position: relative;
                flex: 1;
            }
            
            .search-input {
                width: 100%;
                padding: 1rem 1rem 1rem 3rem;
                border: 2px solid #e2e8f0;
                border-radius: 0.75rem;
                font-size: 1.1rem;
                transition: all 0.3s;
                background: #f8fafc;
            }
            
            .search-input:focus {
                outline: none;
                border-color: #4f46e5;
                background: white;
                box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
            }
            
            .search-icon {
                position: absolute;
                left: 1rem;
                top: 50%;
                transform: translateY(-50%);
                color: #64748b;
            }
            
            .search-shortcut {
                position: absolute;
                right: 1rem;
                top: 50%;
                transform: translateY(-50%);
                background: #f1f5f9;
                border: 1px solid #e2e8f0;
                padding: 0.25rem 0.5rem;
                border-radius: 0.375rem;
                font-size: 0.75rem;
                font-weight: 600;
                color: #64748b;
            }
            
            .search-clear {
                position: absolute;
                right: 3rem;
                top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                color: #64748b;
                cursor: pointer;
                padding: 0.5rem;
            }
            
            .search-close {
                background: none;
                border: none;
                color: #64748b;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 0.5rem;
                transition: all 0.3s;
            }
            
            .search-close:hover {
                background: #f1f5f9;
                color: #374151;
            }
            
            .search-content {
                max-height: 60vh;
                overflow-y: auto;
                padding: 1.5rem;
            }
            
            .suggestions-header, .results-header, .recent-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
            }
            
            .suggestions-header h3, .results-header h3, .recent-header h3 {
                font-size: 1.1rem;
                color: #374151;
                margin: 0;
            }
            
            .results-count {
                font-size: 0.875rem;
                color: #64748b;
            }
            
            .clear-recent {
                background: none;
                border: none;
                color: #4f46e5;
                cursor: pointer;
                font-size: 0.875rem;
                padding: 0.25rem 0.5rem;
                border-radius: 0.375rem;
            }
            
            .clear-recent:hover {
                background: #f1f5f9;
            }
            
            .suggestions-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 0.75rem;
                margin-bottom: 2rem;
            }
            
            .suggestion-chip {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.75rem 1rem;
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 0.75rem;
                cursor: pointer;
                transition: all 0.3s;
                font-size: 0.875rem;
                color: #374151;
            }
            
            .suggestion-chip:hover {
                background: #eef2ff;
                border-color: #4f46e5;
                color: #4f46e5;
            }
            
            .suggestion-chip i {
                color: #64748b;
            }
            
            .results-list {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            
            .result-item {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                border: 1px solid #e2e8f0;
                border-radius: 0.75rem;
                cursor: pointer;
                transition: all 0.3s;
                text-decoration: none;
                color: inherit;
            }
            
            .result-item:hover {
                border-color: #4f46e5;
                background: #f8fafc;
            }
            
            .result-icon {
                width: 3rem;
                height: 3rem;
                border-radius: 0.75rem;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.25rem;
                flex-shrink: 0;
            }
            
            .result-icon.physics { background: #4f46e5; }
            .result-icon.chemistry { background: #10b981; }
            .result-icon.biology { background: #f59e0b; }
            .result-icon.mathematics { background: #ec4899; }
            
            .result-content {
                flex: 1;
            }
            
            .result-title {
                font-weight: 600;
                color: #1e293b;
                margin-bottom: 0.25rem;
            }
            
            .result-description {
                font-size: 0.875rem;
                color: #64748b;
                line-height: 1.4;
            }
            
            .result-meta {
                display: flex;
                gap: 1rem;
                margin-top: 0.5rem;
                font-size: 0.75rem;
                color: #94a3b8;
            }
            
            .result-meta span {
                display: flex;
                align-items: center;
                gap: 0.25rem;
            }
            
            .search-empty {
                text-align: center;
                padding: 3rem 2rem;
            }
            
            .empty-icon {
                font-size: 3rem;
                color: #e2e8f0;
                margin-bottom: 1rem;
            }
            
            .search-empty h3 {
                color: #374151;
                margin-bottom: 0.5rem;
            }
            
            .search-empty p {
                color: #64748b;
                margin-bottom: 1.5rem;
            }
            
            .empty-suggestions {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 1rem;
                flex-wrap: wrap;
            }
            
            .empty-suggestions span {
                color: #64748b;
                font-size: 0.875rem;
            }
            
            .suggestion-link {
                background: none;
                border: none;
                color: #4f46e5;
                cursor: pointer;
                font-size: 0.875rem;
                padding: 0.25rem 0.75rem;
                border-radius: 1rem;
                background: #eef2ff;
            }
            
            .suggestion-link:hover {
                background: #e0e7ff;
            }
            
            .recent-list {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .recent-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0.75rem 1rem;
                border-radius: 0.5rem;
                cursor: pointer;
                transition: all 0.3s;
            }
            
            .recent-item:hover {
                background: #f8fafc;
            }
            
            .recent-query {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            
            .recent-query i {
                color: #64748b;
                font-size: 0.875rem;
            }
            
            .recent-remove {
                background: none;
                border: none;
                color: #94a3b8;
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 0.25rem;
                opacity: 0;
                transition: all 0.3s;
            }
            
            .recent-item:hover .recent-remove {
                opacity: 1;
            }
            
            .recent-remove:hover {
                color: #ef4444;
                background: #fef2f2;
            }
            
            .search-tips {
                margin-top: 2rem;
                padding-top: 2rem;
                border-top: 1px solid #e2e8f0;
            }
            
            .tips-header {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 1rem;
                color: #374151;
                font-weight: 600;
            }
            
            .tips-header i {
                color: #f59e0b;
            }
            
            .tips-list {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
            }
            
            .tip-item {
                display: flex;
                align-items: center;
                gap: 1rem;
                font-size: 0.875rem;
            }
            
            .tip-keyword {
                background: #f1f5f9;
                padding: 0.25rem 0.5rem;
                border-radius: 0.375rem;
                font-family: monospace;
                color: #374151;
                min-width: 120px;
                text-align: center;
            }
            
            /* Quick Search Trigger */
            .quick-search-trigger {
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                background: white;
                border: 1px solid #e2e8f0;
                border-radius: 2rem;
                padding: 0.75rem 1.5rem;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                cursor: pointer;
                transition: all 0.3s;
                z-index: 1000;
            }
            
            .quick-search-trigger:hover {
                transform: translateY(-2px);
                box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
            }
            
            .trigger-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                color: #64748b;
                font-weight: 500;
            }
            
            .trigger-content .search-shortcut {
                position: static;
                transform: none;
                background: #4f46e5;
                color: white;
                border: none;
            }
            
            @media (max-width: 768px) {
                .search-modal {
                    top: 10%;
                    width: 95%;
                }
                
                .suggestions-grid {
                    grid-template-columns: 1fr 1fr;
                }
                
                .quick-search-trigger {
                    bottom: 1rem;
                    right: 1rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        // Global keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if ((e.key === '/' || e.key === 'k') && (e.ctrlKey || e.metaKey || !e.target.matches('input, textarea'))) {
                e.preventDefault();
                this.showSearch();
            }
            
            if (e.key === 'Escape' && this.isSearchActive) {
                this.hideSearch();
            }
        });

        // Search trigger
        document.getElementById('quick-search-trigger').addEventListener('click', () => {
            this.showSearch();
        });

        // Search modal controls
        document.getElementById('search-backdrop').addEventListener('click', () => {
            this.hideSearch();
        });

        document.getElementById('search-close-btn').addEventListener('click', () => {
            this.hideSearch();
        });

        // Search input
        const searchInput = document.getElementById('global-search-input');
        searchInput.addEventListener('input', (e) => {
            this.handleSearchInput(e.target.value);
        });

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.performSearch(searchInput.value);
            }
        });

        // Clear search
        document.getElementById('search-clear-btn').addEventListener('click', () => {
            this.clearSearch();
        });

        // Suggestion chips
        document.addEventListener('click', (e) => {
            if (e.target.matches('.suggestion-chip') || e.target.closest('.suggestion-chip')) {
                const chip = e.target.closest('.suggestion-chip');
                this.handleSuggestionClick(chip.dataset.query);
            }
            
            if (e.target.matches('.suggestion-link') || e.target.closest('.suggestion-link')) {
                const link = e.target.closest('.suggestion-link');
                this.handleSuggestionClick(link.dataset.query);
            }
            
            // Recent search items
            if (e.target.matches('.recent-item') || e.target.closest('.recent-item')) {
                const item = e.target.closest('.recent-item');
                if (!e.target.matches('.recent-remove')) {
                    this.handleRecentSearchClick(item.dataset.query);
                }
            }
            
            // Remove recent search
            if (e.target.matches('.recent-remove') || e.target.closest('.recent-remove')) {
                const btn = e.target.closest('.recent-remove');
                this.removeRecentSearch(btn.dataset.query);
            }
        });

        // Clear all recent searches
        document.getElementById('clear-recent').addEventListener('click', () => {
            this.clearRecentSearches();
        });

        // Result item clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('.result-item') || e.target.closest('.result-item')) {
                const item = e.target.closest('.result-item');
                this.handleResultClick(item.dataset.graphId);
            }
        });
    }

    async buildSearchIndex() {
        // This would typically come from your graph data
        // For now, we'll create a mock index
        this.searchIndex = [
            {
                id: '1',
                type: 'graph',
                title: 'Wave Interference Patterns',
                description: 'Visualization of constructive and destructive wave interference',
                subject: 'physics',
                tags: ['waves', 'interference', 'oscillations', 'physics'],
                views: 1247,
                rating: 4.2
            },
            {
                id: '2',
                type: 'graph',
                title: 'Chemical Reaction Rates',
                description: 'How temperature and concentration affect reaction rates',
                subject: 'chemistry',
                tags: ['reactions', 'kinetics', 'chemistry', 'rates'],
                views: 842,
                rating: 4.5
            },
            {
                id: '3',
                type: 'graph',
                title: 'Population Growth Models',
                description: 'Exponential vs logistic growth patterns in biology',
                subject: 'biology',
                tags: ['ecology', 'growth', 'biology', 'population'],
                views: 756,
                rating: 4.0
            },
            {
                id: '4',
                type: 'graph',
                title: 'Trigonometric Functions',
                description: 'Sine, cosine and tangent functions visualization',
                subject: 'mathematics',
                tags: ['trigonometry', 'functions', 'mathematics', 'waves'],
                views: 1102,
                rating: 4.7
            },
            {
                id: '5',
                type: 'subject',
                title: 'Physics',
                description: 'Study of matter, energy, and their interactions',
                subject: 'physics',
                tags: ['physics', 'mechanics', 'waves', 'energy'],
                graphCount: 156
            },
            {
                id: '6',
                type: 'subject',
                title: 'Chemistry',
                description: 'Study of substances and their transformations',
                subject: 'chemistry',
                tags: ['chemistry', 'reactions', 'elements', 'compounds'],
                graphCount: 98
            }
        ];
    }

    showSearch() {
        const overlay = document.getElementById('search-overlay');
        const input = document.getElementById('global-search-input');
        
        overlay.style.display = 'block';
        input.focus();
        this.isSearchActive = true;
        
        this.loadRecentSearches();
        this.showSuggestions();
    }

    hideSearch() {
        const overlay = document.getElementById('search-overlay');
        const input = document.getElementById('global-search-input');
        
        overlay.style.display = 'none';
        input.value = '';
        this.isSearchActive = false;
        this.currentQuery = '';
        
        this.showSuggestions();
    }

    handleSearchInput(query) {
        const clearBtn = document.getElementById('search-clear-btn');
        clearBtn.style.display = query ? 'block' : 'none';
        
        this.currentQuery = query;
        
        if (query.length === 0) {
            this.showSuggestions();
        } else if (query.length >= 2) {
            this.performSearch(query);
        }
    }

    clearSearch() {
        const input = document.getElementById('global-search-input');
        const clearBtn = document.getElementById('search-clear-btn');
        
        input.value = '';
        input.focus();
        clearBtn.style.display = 'none';
        this.currentQuery = '';
        
        this.showSuggestions();
    }

    performSearch(query) {
        if (query.length < 2) return;
        
        // Save to recent searches
        this.saveToRecentSearches(query);
        
        // Perform search
        const results = this.search(query);
        this.displayResults(results, query);
    }

    search(query) {
        const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
        
        return this.searchIndex.filter(item => {
            const searchableText = `
                ${item.title} ${item.description} ${item.subject} 
                ${item.tags.join(' ')} ${item.type}
            `.toLowerCase();
            
            // Check if all search terms are present
            return searchTerms.every(term => searchableText.includes(term));
        });
    }

    displayResults(results, query) {
        const suggestions = document.getElementById('search-suggestions');
        const resultsSection = document.getElementById('search-results');
        const emptyState = document.getElementById('search-empty');
        const recentSearches = document.getElementById('search-recent');
        const resultsList = document.getElementById('results-list');
        const resultsCount = document.getElementById('results-count');
        
        if (results.length === 0) {
            suggestions.style.display = 'none';
            resultsSection.style.display = 'none';
            emptyState.style.display = 'block';
            recentSearches.style.display = 'none';
            return;
        }
        
        suggestions.style.display = 'none';
        resultsSection.style.display = 'block';
        emptyState.style.display = 'none';
        recentSearches.style.display = 'none';
        
        resultsCount.textContent = `${results.length} result${results.length === 1 ? '' : 's'} for "${query}"`;
        
        resultsList.innerHTML = results.map(result => this.createResultItem(result)).join('');
    }

    createResultItem(result) {
        const subjectIcons = {
            physics: 'fa-atom',
            chemistry: 'fa-vial',
            biology: 'fa-dna',
            mathematics: 'fa-calculator'
        };
        
        const subjectColors = {
            physics: '#4f46e5',
            chemistry: '#10b981',
            biology: '#f59e0b', 
            mathematics: '#ec4899'
        };
        
        const isGraph = result.type === 'graph';
        
        return `
            <div class="result-item" data-graph-id="${result.id}">
                <div class="result-icon ${result.subject}" style="background: ${subjectColors[result.subject]}">
                    <i class="fas ${subjectIcons[result.subject]}"></i>
                </div>
                <div class="result-content">
                    <div class="result-title">${result.title}</div>
                    <div class="result-description">${result.description}</div>
                    <div class="result-meta">
                        <span>
                            <i class="fas fa-tag"></i>
                            ${result.subject.charAt(0).toUpperCase() + result.subject.slice(1)}
                        </span>
                        ${isGraph ? `
                            <span>
                                <i class="fas fa-eye"></i>
                                ${result.views.toLocaleString()} views
                            </span>
                            <span>
                                <i class="fas fa-star"></i>
                                ${result.rating}/5
                            </span>
                        ` : `
                            <span>
                                <i class="fas fa-chart-bar"></i>
                                ${result.graphCount} graphs
                            </span>
                        `}
                    </div>
                </div>
            </div>
        `;
    }

    showSuggestions() {
        const suggestions = document.getElementById('search-suggestions');
        const resultsSection = document.getElementById('search-results');
        const emptyState = document.getElementById('search-empty');
        const recentSearches = document.getElementById('search-recent');
        
        suggestions.style.display = 'block';
        resultsSection.style.display = 'none';
        emptyState.style.display = 'none';
        recentSearches.style.display = 'block';
    }

    handleSuggestionClick(query) {
        const input = document.getElementById('global-search-input');
        input.value = query;
        input.focus();
        this.performSearch(query);
    }

    handleRecentSearchClick(query) {
        const input = document.getElementById('global-search-input');
        input.value = query;
        input.focus();
        this.performSearch(query);
    }

    handleResultClick(graphId) {
        this.hideSearch();
        
        // Navigate to the graph or subject
        const result = this.searchIndex.find(item => item.id === graphId);
        if (result) {
            if (result.type === 'graph') {
                this.app.emit('showGraphDetail', { graphId });
                this.app.emit('routeChange', { route: 'graphs', data: null });
            } else {
                this.app.emit('routeChange', { route: 'subjects', data: { subject: result.subject } });
            }
        }
    }

    saveToRecentSearches(query) {
        let recent = JSON.parse(localStorage.getItem('graphz_recent_searches') || '[]');
        
        // Remove if already exists
        recent = recent.filter(item => item !== query);
        
        // Add to beginning
        recent.unshift(query);
        
        // Keep only last 10 searches
        recent = recent.slice(0, 10);
        
        localStorage.setItem('graphz_recent_searches', JSON.stringify(recent));
        this.loadRecentSearches();
    }

    loadRecentSearches() {
        const recentList = document.getElementById('recent-list');
        const recent = JSON.parse(localStorage.getItem('graphz_recent_searches') || '[]');
        
        if (recent.length === 0) {
            recentList.innerHTML = '<div class="recent-item" style="color: #64748b; justify-content: center;">No recent searches</div>';
            return;
        }
        
        recentList.innerHTML = recent.map(query => `
            <div class="recent-item" data-query="${query}">
                <div class="recent-query">
                    <i class="fas fa-clock"></i>
                    <span>${query}</span>
                </div>
                <button class="recent-remove" data-query="${query}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }

    removeRecentSearch(query) {
        let recent = JSON.parse(localStorage.getItem('graphz_recent_searches') || '[]');
        recent = recent.filter(item => item !== query);
        localStorage.setItem('graphz_recent_searches', JSON.stringify(recent));
        this.loadRecentSearches();
    }

    clearRecentSearches() {
        localStorage.removeItem('graphz_recent_searches');
        this.loadRecentSearches();
    }

    onEvent(event, data) {
        switch (event) {
            case 'graphDataUpdated':
                // Rebuild search index when graph data changes
                this.buildSearchIndex();
                break;
                
            case 'routeChange':
                // Hide search on route change
                if (this.isSearchActive) {
                    this.hideSearch();
                }
                break;
        }
    }

    // Public method to trigger search programmatically
    searchGraphs(query) {
        this.showSearch();
        const input = document.getElementById('global-search-input');
        input.value = query;
        this.performSearch(query);
    }

    // Public method to get search stats
    getSearchStats() {
        return {
            totalIndexed: this.searchIndex.length,
            recentSearches: JSON.parse(localStorage.getItem('graphz_recent_searches') || '[]').length
        };
    }
}
