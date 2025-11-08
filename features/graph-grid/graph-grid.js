export default class GraphGridFeature {
    constructor(app) {
        this.app = app;
        this.name = 'graph-grid';
        this.graphs = [];
        this.filteredGraphs = [];
        this.currentFilter = 'all';
        this.currentSort = 'popular';
    }

    async init() {
        console.log('🚀 Graph Grid feature initializing...');
        
        await this.loadHTML();
        this.loadCSS();
        this.setupEventListeners();
        await this.loadGraphs();
        
        console.log('✅ Graph Grid feature ready!');
    }

    async loadHTML() {
        const html = `
            <section class="graph-grid-page" id="graph-grid-page" style="display: none;">
                <div class="container">
                    <div class="page-header">
                        <h1>Explore Educational Graphs</h1>
                        <p>Discover interactive visualizations across multiple subjects</p>
                    </div>

                    <div class="grid-controls">
                        <div class="search-box">
                            <div class="search-input-wrapper">
                                <i class="fas fa-search"></i>
                                <input type="text" id="graph-search" placeholder="Search graphs by name, tags, or description...">
                                <button class="search-clear" id="search-clear" style="display: none;">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>

                        <div class="filter-section">
                            <div class="filter-group">
                                <label>Filter by Subject:</label>
                                <div class="filter-chips">
                                    <button class="filter-chip active" data-filter="all">All Subjects</button>
                                    <button class="filter-chip" data-filter="physics">
                                        <i class="fas fa-atom"></i> Physics
                                    </button>
                                    <button class="filter-chip" data-filter="chemistry">
                                        <i class="fas fa-vial"></i> Chemistry
                                    </button>
                                    <button class="filter-chip" data-filter="biology">
                                        <i class="fas fa-dna"></i> Biology
                                    </button>
                                    <button class="filter-chip" data-filter="mathematics">
                                        <i class="fas fa-calculator"></i> Mathematics
                                    </button>
                                </div>
                            </div>

                            <div class="sort-group">
                                <label>Sort by:</label>
                                <select id="graph-sort" class="sort-select">
                                    <option value="popular">Most Popular</option>
                                    <option value="newest">Newest First</option>
                                    <option value="rating">Highest Rated</option>
                                    <option value="az">A to Z</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="grid-stats">
                        <div class="stat-item">
                            <span class="stat-number" id="graph-count">0</span>
                            <span class="stat-label">Graphs Found</span>
                        </div>
                        <div class="view-toggle">
                            <button class="view-btn active" data-view="grid">
                                <i class="fas fa-th"></i>
                            </button>
                            <button class="view-btn" data-view="list">
                                <i class="fas fa-list"></i>
                            </button>
                        </div>
                    </div>

                    <div class="graphs-container">
                        <div class="graphs-grid" id="graphs-grid">
                            <!-- Graphs will be loaded here -->
                        </div>
                        
                        <div class="empty-state" id="empty-state" style="display: none;">
                            <div class="empty-icon">
                                <i class="fas fa-search"></i>
                            </div>
                            <h3>No graphs found</h3>
                            <p>Try adjusting your search or filter criteria</p>
                            <button class="btn btn-primary" id="reset-filters">
                                <i class="fas fa-refresh"></i>
                                Reset Filters
                            </button>
                        </div>

                        <div class="loading-state" id="loading-state">
                            <div class="loader"></div>
                            <p>Loading graphs...</p>
                        </div>
                    </div>

                    <div class="load-more-section">
                        <button class="btn btn-outline" id="load-more" style="display: none;">
                            <i class="fas fa-plus"></i>
                            Load More Graphs
                        </button>
                    </div>
                </div>
            </section>
        `;
        
        const app = document.getElementById('app');
        const homePage = document.querySelector('.home-page');
        if (homePage) {
            homePage.insertAdjacentHTML('afterend', html);
        } else {
            app.innerHTML += html;
        }
    }

    loadCSS() {
        const style = document.createElement('style');
        style.textContent = `
            .graph-grid-page {
                padding: 2rem 0;
                background: #f8fafc;
                min-height: 100vh;
            }
            
            .page-header {
                text-align: center;
                margin-bottom: 3rem;
            }
            
            .page-header h1 {
                font-size: 2.5rem;
                color: #1e293b;
                margin-bottom: 1rem;
            }
            
            .page-header p {
                font-size: 1.2rem;
                color: #64748b;
                max-width: 600px;
                margin: 0 auto;
            }
            
            .grid-controls {
                background: white;
                padding: 2rem;
                border-radius: 1rem;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                margin-bottom: 2rem;
            }
            
            .search-box {
                margin-bottom: 1.5rem;
            }
            
            .search-input-wrapper {
                position: relative;
                max-width: 500px;
            }
            
            .search-input-wrapper i.fa-search {
                position: absolute;
                left: 1rem;
                top: 50%;
                transform: translateY(-50%);
                color: #64748b;
            }
            
            #graph-search {
                width: 100%;
                padding: 1rem 1rem 1rem 3rem;
                border: 2px solid #e2e8f0;
                border-radius: 0.75rem;
                font-size: 1rem;
                transition: all 0.3s;
            }
            
            #graph-search:focus {
                outline: none;
                border-color: #4f46e5;
                box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
            }
            
            .search-clear {
                position: absolute;
                right: 1rem;
                top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                color: #64748b;
                cursor: pointer;
                padding: 0.25rem;
            }
            
            .filter-section {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                gap: 2rem;
                flex-wrap: wrap;
            }
            
            .filter-group, .sort-group {
                flex: 1;
                min-width: 300px;
            }
            
            .filter-group label, .sort-group label {
                display: block;
                margin-bottom: 0.75rem;
                font-weight: 600;
                color: #374151;
            }
            
            .filter-chips {
                display: flex;
                gap: 0.5rem;
                flex-wrap: wrap;
            }
            
            .filter-chip {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem 1rem;
                background: #f1f5f9;
                border: 2px solid transparent;
                border-radius: 2rem;
                cursor: pointer;
                transition: all 0.3s;
                font-weight: 500;
                color: #64748b;
            }
            
            .filter-chip:hover {
                background: #e2e8f0;
                color: #374151;
            }
            
            .filter-chip.active {
                background: #4f46e5;
                color: white;
                border-color: #4f46e5;
            }
            
            .sort-select {
                width: 100%;
                max-width: 200px;
                padding: 0.75rem 1rem;
                border: 2px solid #e2e8f0;
                border-radius: 0.5rem;
                font-size: 1rem;
                background: white;
                cursor: pointer;
            }
            
            .sort-select:focus {
                outline: none;
                border-color: #4f46e5;
            }
            
            .grid-stats {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 2rem;
            }
            
            .stat-item {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .stat-number {
                font-size: 1.5rem;
                font-weight: 700;
                color: #4f46e5;
            }
            
            .stat-label {
                color: #64748b;
                font-weight: 500;
            }
            
            .view-toggle {
                display: flex;
                background: #f1f5f9;
                border-radius: 0.5rem;
                padding: 0.25rem;
            }
            
            .view-btn {
                padding: 0.5rem 1rem;
                background: none;
                border: none;
                border-radius: 0.375rem;
                cursor: pointer;
                color: #64748b;
                transition: all 0.3s;
            }
            
            .view-btn.active {
                background: white;
                color: #4f46e5;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }
            
            .graphs-container {
                position: relative;
                min-height: 400px;
            }
            
            .graphs-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 1.5rem;
                margin-bottom: 2rem;
            }
            
            .graph-card {
                background: white;
                border-radius: 1rem;
                overflow: hidden;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                transition: all 0.3s;
                cursor: pointer;
                position: relative;
            }
            
            .graph-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            }
            
            .graph-image {
                height: 200px;
                position: relative;
                overflow: hidden;
            }
            
            .graph-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.3s;
            }
            
            .graph-card:hover .graph-image img {
                transform: scale(1.05);
            }
            
            .graph-badge {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: rgba(255, 255, 255, 0.9);
                backdrop-filter: blur(10px);
                padding: 0.5rem 1rem;
                border-radius: 2rem;
                font-size: 0.875rem;
                font-weight: 600;
                text-transform: capitalize;
            }
            
            .graph-badge.physics { color: #4f46e5; }
            .graph-badge.chemistry { color: #10b981; }
            .graph-badge.biology { color: #f59e0b; }
            .graph-badge.mathematics { color: #ec4899; }
            
            .favorite-btn {
                position: absolute;
                top: 1rem;
                left: 1rem;
                background: rgba(255, 255, 255, 0.9);
                backdrop-filter: blur(10px);
                border: none;
                width: 2.5rem;
                height: 2.5rem;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: #64748b;
                transition: all 0.3s;
            }
            
            .favorite-btn:hover {
                background: rgba(239, 68, 68, 0.1);
                color: #ef4444;
            }
            
            .favorite-btn.active {
                background: #ef4444;
                color: white;
            }
            
            .graph-content {
                padding: 1.5rem;
            }
            
            .graph-title {
                font-size: 1.25rem;
                font-weight: 600;
                color: #1e293b;
                margin-bottom: 0.5rem;
                line-height: 1.4;
            }
            
            .graph-description {
                color: #64748b;
                font-size: 0.875rem;
                line-height: 1.5;
                margin-bottom: 1rem;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
            
            .graph-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                margin-bottom: 1rem;
            }
            
            .graph-tag {
                background: #f1f5f9;
                color: #64748b;
                padding: 0.25rem 0.75rem;
                border-radius: 1rem;
                font-size: 0.75rem;
                font-weight: 500;
            }
            
            .graph-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: #64748b;
                font-size: 0.875rem;
            }
            
            .graph-views {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .graph-rating {
                display: flex;
                align-items: center;
                gap: 0.25rem;
            }
            
            .star {
                color: #e2e8f0;
            }
            
            .star.filled {
                color: #f59e0b;
            }
            
            .empty-state {
                text-align: center;
                padding: 4rem 2rem;
                display: none;
            }
            
            .empty-icon {
                font-size: 4rem;
                color: #e2e8f0;
                margin-bottom: 1.5rem;
            }
            
            .empty-state h3 {
                color: #374151;
                margin-bottom: 0.5rem;
            }
            
            .empty-state p {
                color: #64748b;
                margin-bottom: 2rem;
            }
            
            .loading-state {
                text-align: center;
                padding: 4rem 2rem;
                display: none;
            }
            
            .loading-state .loader {
                width: 3rem;
                height: 3rem;
                border: 3px solid #f3f3f3;
                border-top: 3px solid #4f46e5;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem;
            }
            
            .load-more-section {
                text-align: center;
                margin-top: 2rem;
            }
            
            /* List View */
            .graphs-grid.list-view {
                grid-template-columns: 1fr;
            }
            
            .graphs-grid.list-view .graph-card {
                display: flex;
                height: 150px;
            }
            
            .graphs-grid.list-view .graph-image {
                width: 200px;
                height: 100%;
                flex-shrink: 0;
            }
            
            .graphs-grid.list-view .graph-content {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
            
            .graphs-grid.list-view .graph-description {
                -webkit-line-clamp: 3;
            }
            
            @media (max-width: 768px) {
                .filter-section {
                    flex-direction: column;
                }
                
                .filter-group, .sort-group {
                    min-width: 100%;
                }
                
                .sort-select {
                    max-width: 100%;
                }
                
                .graphs-grid {
                    grid-template-columns: 1fr;
                }
                
                .graphs-grid.list-view .graph-card {
                    flex-direction: column;
                    height: auto;
                }
                
                .graphs-grid.list-view .graph-image {
                    width: 100%;
                    height: 200px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        // Search functionality
        document.getElementById('graph-search').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        document.getElementById('search-clear').addEventListener('click', () => {
            this.clearSearch();
        });

        // Filter chips
        document.addEventListener('click', (e) => {
            if (e.target.matches('.filter-chip') || e.target.closest('.filter-chip')) {
                const chip = e.target.closest('.filter-chip');
                this.handleFilterChange(chip.dataset.filter);
            }
            
            // View toggle
            if (e.target.matches('.view-btn') || e.target.closest('.view-btn')) {
                const btn = e.target.closest('.view-btn');
                this.handleViewChange(btn.dataset.view);
            }
            
            // Favorite button
            if (e.target.matches('.favorite-btn') || e.target.closest('.favorite-btn')) {
                const btn = e.target.closest('.favorite-btn');
                this.handleFavoriteClick(btn.dataset.graphId);
            }
            
            // Graph card click
            if (e.target.matches('.graph-card') || e.target.closest('.graph-card')) {
                const card = e.target.closest('.graph-card');
                if (!e.target.matches('.favorite-btn') && !e.target.closest('.favorite-btn')) {
                    this.handleGraphClick(card.dataset.graphId);
                }
            }
        });

        // Sort change
        document.getElementById('graph-sort').addEventListener('change', (e) => {
            this.handleSortChange(e.target.value);
        });

        // Reset filters
        document.getElementById('reset-filters').addEventListener('click', () => {
            this.resetFilters();
        });

        // Load more
        document.getElementById('load-more').addEventListener('click', () => {
            this.loadMoreGraphs();
        });
    }

    async loadGraphs() {
        // Show loading state
        this.showLoading();
        
        try {
            // Mock data - in real app, this would come from Firebase
            this.graphs = await this.mockLoadGraphs();
            this.filteredGraphs = [...this.graphs];
            
            this.renderGraphs();
            this.updateStats();
            this.hideLoading();
            
        } catch (error) {
            console.error('Error loading graphs:', error);
            this.showError('Failed to load graphs');
        }
    }

    async mockLoadGraphs() {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        return [
            {
                id: '1',
                name: 'Wave Interference Patterns',
                description: 'Visualization of constructive and destructive wave interference showing how waves combine in space.',
                subject: 'physics',
                tags: ['waves', 'interference', 'oscillations', 'physics'],
                imageUrl: '',
                views: 1247,
                rating: 4.2,
                ratingCount: 42,
                createdAt: new Date('2023-01-15')
            },
            {
                id: '2',
                name: 'Chemical Reaction Rates',
                description: 'How temperature, concentration and catalysts affect the rate of chemical reactions.',
                subject: 'chemistry',
                tags: ['reactions', 'kinetics', 'chemistry', 'rates'],
                imageUrl: '',
                views: 842,
                rating: 4.5,
                ratingCount: 28,
                createdAt: new Date('2023-02-20')
            },
            {
                id: '3',
                name: 'Population Growth Models',
                description: 'Exponential vs logistic growth patterns in biological populations with carrying capacity.',
                subject: 'biology',
                tags: ['ecology', 'growth', 'biology', 'population'],
                imageUrl: '',
                views: 756,
                rating: 4.0,
                ratingCount: 31,
                createdAt: new Date('2023-03-10')
            },
            {
                id: '4',
                name: 'Trigonometric Functions',
                description: 'Interactive visualization of sine, cosine and tangent functions with adjustable parameters.',
                subject: 'mathematics',
                tags: ['trigonometry', 'functions', 'mathematics', 'waves'],
                imageUrl: '',
                views: 1102,
                rating: 4.7,
                ratingCount: 56,
                createdAt: new Date('2023-01-25')
            },
            {
                id: '5',
                name: 'Electromagnetic Spectrum',
                description: 'Complete visualization of the electromagnetic spectrum from radio waves to gamma rays.',
                subject: 'physics',
                tags: ['electromagnetism', 'spectrum', 'physics', 'waves'],
                imageUrl: '',
                views: 934,
                rating: 4.3,
                ratingCount: 39,
                createdAt: new Date('2023-04-05')
            },
            {
                id: '6',
                name: 'Periodic Table Trends',
                description: 'Visual representation of periodic trends including atomic radius and electronegativity.',
                subject: 'chemistry',
                tags: ['periodic table', 'trends', 'chemistry', 'elements'],
                imageUrl: '',
                views: 1289,
                rating: 4.6,
                ratingCount: 47,
                createdAt: new Date('2023-02-28')
            }
        ];
    }

    renderGraphs() {
        const grid = document.getElementById('graphs-grid');
        const emptyState = document.getElementById('empty-state');
        const loadMoreBtn = document.getElementById('load-more');
        
        if (this.filteredGraphs.length === 0) {
            grid.style.display = 'none';
            emptyState.style.display = 'block';
            loadMoreBtn.style.display = 'none';
            return;
        }
        
        grid.style.display = 'grid';
        emptyState.style.display = 'none';
        
        // Show load more button if there are more graphs to load
        loadMoreBtn.style.display = this.graphs.length > this.filteredGraphs.length ? 'block' : 'none';
        
        grid.innerHTML = this.filteredGraphs.map(graph => this.createGraphCard(graph)).join('');
    }

    createGraphCard(graph) {
        const subjectColors = {
            physics: '#4f46e5',
            chemistry: '#10b981', 
            biology: '#f59e0b',
            mathematics: '#ec4899'
        };
        
        const subjectIcons = {
            physics: 'fa-atom',
            chemistry: 'fa-vial',
            biology: 'fa-dna',
            mathematics: 'fa-calculator'
        };
        
        const ratingStars = this.generateStarRating(graph.rating);
        const isFavorite = this.isGraphFavorite(graph.id);
        
        return `
            <div class="graph-card" data-graph-id="${graph.id}">
                <div class="graph-image" style="background: linear-gradient(45deg, ${subjectColors[graph.subject]}, ${this.lightenColor(subjectColors[graph.subject])})">
                    <i class="fas ${subjectIcons[graph.subject]}" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 3rem; color: white; opacity: 0.8;"></i>
                    <div class="graph-badge ${graph.subject}">
                        <i class="fas ${subjectIcons[graph.subject]}"></i>
                        ${graph.subject.charAt(0).toUpperCase() + graph.subject.slice(1)}
                    </div>
                    <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-graph-id="${graph.id}">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                
                <div class="graph-content">
                    <h3 class="graph-title">${graph.name}</h3>
                    <p class="graph-description">${graph.description}</p>
                    
                    <div class="graph-tags">
                        ${graph.tags.map(tag => `<span class="graph-tag">${tag}</span>`).join('')}
                    </div>
                    
                    <div class="graph-footer">
                        <div class="graph-views">
                            <i class="fas fa-eye"></i>
                            ${graph.views.toLocaleString()} views
                        </div>
                        <div class="graph-rating">
                            ${ratingStars}
                            <span>(${graph.ratingCount})</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '';
        
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars += '<i class="fas fa-star filled"></i>';
            } else if (i === fullStars && hasHalfStar) {
                stars += '<i class="fas fa-star-half-alt filled"></i>';
            } else {
                stars += '<i class="fas fa-star"></i>';
            }
        }
        
        return stars;
    }

    lightenColor(color) {
        // Simple color lightening for gradients
        const hex = color.replace('#', '');
        const num = parseInt(hex, 16);
        const amt = 40;
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return `#${(1 << 24 | (R < 255 ? R < 1 ? 0 : R : 255) << 16 | (G < 255 ? G < 1 ? 0 : G : 255) << 8 | (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)}`;
    }

    handleSearch(searchTerm) {
        const searchClear = document.getElementById('search-clear');
        searchClear.style.display = searchTerm ? 'block' : 'none';
        
        this.applyFilters();
    }

    clearSearch() {
        document.getElementById('graph-search').value = '';
        document.getElementById('search-clear').style.display = 'none';
        this.applyFilters();
    }

    handleFilterChange(filter) {
        // Update active filter chip
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        this.currentFilter = filter;
        this.applyFilters();
    }

    handleSortChange(sort) {
        this.currentSort = sort;
        this.applyFilters();
    }

    handleViewChange(view) {
        // Update active view button
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');
        
        // Update grid layout
        const grid = document.getElementById('graphs-grid');
        grid.className = view === 'list' ? 'graphs-grid list-view' : 'graphs-grid';
    }

    handleFavoriteClick(graphId) {
        // Toggle favorite status
        const favorites = JSON.parse(localStorage.getItem('graphz_favorites') || '[]');
        const index = favorites.indexOf(graphId);
        
        if (index > -1) {
            favorites.splice(index, 1);
        } else {
            favorites.push(graphId);
        }
        
        localStorage.setItem('graphz_favorites', JSON.stringify(favorites));
        
        // Update UI
        this.renderGraphs();
        
        // Show notification
        this.showNotification(
            index > -1 ? 'Removed from favorites' : 'Added to favorites',
            index > -1 ? 'info' : 'success'
        );
    }

    handleGraphClick(graphId) {
        // Show graph detail view
        this.app.emit('showGraphDetail', { graphId });
        
        // For now, just show an alert
        const graph = this.graphs.find(g => g.id === graphId);
        if (graph) {
            alert(`Opening: ${graph.name}\n\nThis would show a detailed view with full description, comments, and download options.`);
        }
    }

    applyFilters() {
        let filtered = [...this.graphs];
        const searchTerm = document.getElementById('graph-search').value.toLowerCase();
        
        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(graph => 
                graph.name.toLowerCase().includes(searchTerm) ||
                graph.description.toLowerCase().includes(searchTerm) ||
                graph.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
                graph.subject.toLowerCase().includes(searchTerm)
            );
        }
        
        // Apply subject filter
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(graph => graph.subject === this.currentFilter);
        }
        
        // Apply sorting
        filtered.sort((a, b) => {
            switch (this.currentSort) {
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'rating':
                    return b.rating - a.rating;
                case 'az':
                    return a.name.localeCompare(b.name);
                case 'popular':
                default:
                    return b.views - a.views;
            }
        });
        
        this.filteredGraphs = filtered;
        this.renderGraphs();
        this.updateStats();
    }

    resetFilters() {
        document.getElementById('graph-search').value = '';
        document.getElementById('search-clear').style.display = 'none';
        document.getElementById('graph-sort').value = 'popular';
        
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.classList.remove('active');
        });
        document.querySelector('[data-filter="all"]').classList.add('active');
        
        this.currentFilter = 'all';
        this.currentSort = 'popular';
        this.applyFilters();
    }

    loadMoreGraphs() {
        // In a real app, this would load more graphs from the server
        this.showNotification('Loading more graphs...', 'info');
        
        setTimeout(() => {
            this.showNotification('No more graphs to load', 'info');
            document.getElementById('load-more').style.display = 'none';
        }, 1500);
    }

    updateStats() {
        document.getElementById('graph-count').textContent = this.filteredGraphs.length;
    }

    showLoading() {
        document.getElementById('loading-state').style.display = 'block';
        document.getElementById('graphs-grid').style.display = 'none';
        document.getElementById('empty-state').style.display = 'none';
    }

    hideLoading() {
        document.getElementById('loading-state').style.display = 'none';
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `graph-notification graph-notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add styles if not already added
        if (!document.querySelector('.graph-notification-style')) {
            const style = document.createElement('style');
            style.className = 'graph-notification-style';
            style.textContent = `
                .graph-notification {
                    position: fixed;
                    top: 2rem;
                    right: 2rem;
                    background: white;
                    padding: 1rem 1.5rem;
                    border-radius: 0.5rem;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    z-index: 1000;
                    animation: slideInRight 0.3s ease-out;
                    max-width: 400px;
                }
                
                .graph-notification-success {
                    border-left: 4px solid #10b981;
                }
                
                .graph-notification-error {
                    border-left: 4px solid #ef4444;
                }
                
                .graph-notification-info {
                    border-left: 4px solid #4f46e5;
                }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    flex: 1;
                }
                
                .graph-notification-success i {
                    color: #10b981;
                }
                
                .graph-notification-error i {
                    color: #ef4444;
                }
                
                .graph-notification-info i {
                    color: #4f46e5;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: #64748b;
                    cursor: pointer;
                    padding: 0.25rem;
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }

    isGraphFavorite(graphId) {
        const favorites = JSON.parse(localStorage.getItem('graphz_favorites') || '[]');
        return favorites.includes(graphId);
    }

    onEvent(event, data) {
        switch (event) {
            case 'routeChange':
                if (data.route === 'graphs') {
                    this.show();
                } else {
                    this.hide();
                }
                break;
                
            case 'userLoggedIn':
            case 'userLoggedOut':
                // Re-render to update favorite buttons
                this.renderGraphs();
                break;
        }
    }

    show() {
        document.getElementById('graph-grid-page').style.display = 'block';
    }

    hide() {
        document.getElementById('graph-grid-page').style.display = 'none';
    }
}
