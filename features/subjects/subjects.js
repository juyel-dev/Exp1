export default class SubjectsFeature {
    constructor(app) {
        this.app = app;
        this.name = 'subjects';
        this.subjects = [];
        this.currentSubject = null;
    }

    async init() {
        console.log('🚀 Subjects feature initializing...');
        
        await this.loadHTML();
        this.loadCSS();
        this.setupEventListeners();
        await this.loadSubjects();
        
        console.log('✅ Subjects feature ready!');
    }

    async loadHTML() {
        const html = `
            <section class="subjects-page" id="subjects-page" style="display: none;">
                <div class="container">
                    <!-- Hero Section -->
                    <div class="subjects-hero">
                        <div class="hero-content">
                            <h1 class="hero-title">Explore by Subject</h1>
                            <p class="hero-description">
                                Dive deep into specific academic disciplines with curated graph collections
                            </p>
                            <div class="hero-stats">
                                <div class="stat">
                                    <div class="stat-number">4</div>
                                    <div class="stat-label">Main Subjects</div>
                                </div>
                                <div class="stat">
                                    <div class="stat-number">500+</div>
                                    <div class="stat-label">Educational Graphs</div>
                                </div>
                                <div class="stat">
                                    <div class="stat-number">100%</div>
                                    <div class="stat-label">Free Access</div>
                                </div>
                            </div>
                        </div>
                        <div class="hero-visual">
                            <div class="visual-grid">
                                <div class="visual-item physics">
                                    <i class="fas fa-atom"></i>
                                </div>
                                <div class="visual-item chemistry">
                                    <i class="fas fa-vial"></i>
                                </div>
                                <div class="visual-item biology">
                                    <i class="fas fa-dna"></i>
                                </div>
                                <div class="visual-item mathematics">
                                    <i class="fas fa-calculator"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Subjects Grid -->
                    <div class="subjects-grid" id="subjects-grid">
                        <!-- Subjects will be loaded here -->
                    </div>

                    <!-- Subject Detail View -->
                    <div class="subject-detail" id="subject-detail" style="display: none;">
                        <div class="detail-header">
                            <button class="back-button" id="subject-back-btn">
                                <i class="fas fa-arrow-left"></i>
                                Back to Subjects
                            </button>
                            <div class="subject-header-content">
                                <div class="subject-icon-large" id="subject-detail-icon">
                                    <i class="fas fa-atom"></i>
                                </div>
                                <div class="subject-info">
                                    <h1 id="subject-detail-title">Physics</h1>
                                    <p id="subject-detail-description">
                                        The study of matter, energy, and the fundamental forces of nature.
                                    </p>
                                    <div class="subject-stats">
                                        <div class="subject-stat">
                                            <div class="stat-value" id="subject-graph-count">156</div>
                                            <div class="stat-label">Graphs</div>
                                        </div>
                                        <div class="subject-stat">
                                            <div class="stat-value" id="subject-topic-count">24</div>
                                            <div class="stat-label">Topics</div>
                                        </div>
                                        <div class="subject-stat">
                                            <div class="stat-value" id="subject-popularity">98%</div>
                                            <div class="stat-label">Popular</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="subject-content">
                            <!-- Topics Section -->
                            <div class="topics-section">
                                <h2>Popular Topics</h2>
                                <div class="topics-grid" id="topics-grid">
                                    <!-- Topics will be loaded here -->
                                </div>
                            </div>

                            <!-- Featured Graphs -->
                            <div class="featured-graphs-section">
                                <div class="section-header">
                                    <h2>Featured Graphs</h2>
                                    <a href="#graphs" class="view-all-link" data-subject-filter>
                                        View All
                                        <i class="fas fa-arrow-right"></i>
                                    </a>
                                </div>
                                <div class="featured-graphs-grid" id="featured-graphs-grid">
                                    <!-- Featured graphs will be loaded here -->
                                </div>
                            </div>

                            <!-- Learning Resources -->
                            <div class="resources-section">
                                <h2>Learning Resources</h2>
                                <div class="resources-grid" id="resources-grid">
                                    <!-- Resources will be loaded here -->
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Loading State -->
                    <div class="loading-state" id="subjects-loading">
                        <div class="loader"></div>
                        <p>Loading subjects...</p>
                    </div>
                </div>
            </section>
        `;
        
        const app = document.getElementById('app');
        const graphGrid = document.querySelector('.graph-grid-page');
        if (graphGrid) {
            graphGrid.insertAdjacentHTML('afterend', html);
        } else {
            app.innerHTML += html;
        }
    }

    loadCSS() {
        const style = document.createElement('style');
        style.textContent = `
            .subjects-page {
                padding: 2rem 0;
                background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                min-height: 100vh;
            }
            
            .subjects-hero {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 4rem;
                align-items: center;
                margin-bottom: 4rem;
                padding: 2rem 0;
            }
            
            .hero-title {
                font-size: 3.5rem;
                font-weight: 700;
                color: #1e293b;
                margin-bottom: 1.5rem;
                line-height: 1.1;
            }
            
            .hero-description {
                font-size: 1.25rem;
                color: #64748b;
                margin-bottom: 2rem;
                line-height: 1.6;
            }
            
            .hero-stats {
                display: flex;
                gap: 2rem;
            }
            
            .stat {
                text-align: center;
            }
            
            .stat-number {
                font-size: 2rem;
                font-weight: 700;
                color: #4f46e5;
                margin-bottom: 0.5rem;
            }
            
            .stat-label {
                color: #64748b;
                font-size: 0.875rem;
                font-weight: 500;
            }
            
            .visual-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
                max-width: 300px;
                margin: 0 auto;
            }
            
            .visual-item {
                width: 120px;
                height: 120px;
                border-radius: 1rem;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2.5rem;
                color: white;
                transition: all 0.3s;
                animation: float 3s ease-in-out infinite;
            }
            
            .visual-item.physics {
                background: linear-gradient(135deg, #4f46e5, #7c3aed);
                animation-delay: 0s;
            }
            
            .visual-item.chemistry {
                background: linear-gradient(135deg, #10b981, #06b6d4);
                animation-delay: 0.5s;
            }
            
            .visual-item.biology {
                background: linear-gradient(135deg, #f59e0b, #f97316);
                animation-delay: 1s;
            }
            
            .visual-item.mathematics {
                background: linear-gradient(135deg, #ec4899, #8b5cf6);
                animation-delay: 1.5s;
            }
            
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }
            
            .subjects-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 2rem;
                margin-bottom: 4rem;
            }
            
            .subject-card {
                background: white;
                border-radius: 1.5rem;
                padding: 2rem;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                transition: all 0.3s;
                cursor: pointer;
                position: relative;
                overflow: hidden;
            }
            
            .subject-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, var(--subject-color), transparent);
            }
            
            .subject-card:hover {
                transform: translateY(-8px);
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            }
            
            .subject-card.physics { --subject-color: #4f46e5; }
            .subject-card.chemistry { --subject-color: #10b981; }
            .subject-card.biology { --subject-color: #f59e0b; }
            .subject-card.mathematics { --subject-color: #ec4899; }
            
            .subject-header {
                display: flex;
                align-items: center;
                gap: 1rem;
                margin-bottom: 1rem;
            }
            
            .subject-icon {
                width: 60px;
                height: 60px;
                border-radius: 1rem;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                color: white;
                background: var(--subject-color);
            }
            
            .subject-title {
                font-size: 1.5rem;
                font-weight: 700;
                color: #1e293b;
                margin: 0;
            }
            
            .subject-description {
                color: #64748b;
                line-height: 1.6;
                margin-bottom: 1.5rem;
            }
            
            .subject-stats {
                display: flex;
                gap: 1.5rem;
                margin-bottom: 1.5rem;
            }
            
            .subject-stat {
                text-align: center;
            }
            
            .stat-value {
                font-size: 1.25rem;
                font-weight: 700;
                color: #1e293b;
                margin-bottom: 0.25rem;
            }
            
            .stat-label {
                font-size: 0.875rem;
                color: #64748b;
            }
            
            .subject-topics {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                margin-bottom: 1.5rem;
            }
            
            .topic-tag {
                background: #f1f5f9;
                color: #64748b;
                padding: 0.375rem 0.75rem;
                border-radius: 1rem;
                font-size: 0.875rem;
                font-weight: 500;
            }
            
            .subject-actions {
                display: flex;
                gap: 0.75rem;
            }
            
            .btn-subject {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                padding: 0.75rem 1rem;
                border: none;
                border-radius: 0.75rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
            }
            
            .btn-explore {
                background: var(--subject-color);
                color: white;
            }
            
            .btn-explore:hover {
                background: color-mix(in srgb, var(--subject-color) 80%, black);
                transform: translateY(-1px);
            }
            
            .btn-save {
                background: #f8fafc;
                color: #64748b;
                border: 1px solid #e2e8f0;
            }
            
            .btn-save:hover {
                background: #f1f5f9;
                color: #374151;
            }
            
            /* Subject Detail Styles */
            .subject-detail {
                background: white;
                border-radius: 1.5rem;
                overflow: hidden;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            }
            
            .detail-header {
                background: linear-gradient(135deg, var(--subject-color), color-mix(in srgb, var(--subject-color) 70%, white));
                color: white;
                padding: 2rem;
                position: relative;
            }
            
            .back-button {
                background: rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: white;
                padding: 0.75rem 1.5rem;
                border-radius: 2rem;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 2rem;
                transition: all 0.3s;
                backdrop-filter: blur(10px);
            }
            
            .back-button:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: translateX(-4px);
            }
            
            .subject-header-content {
                display: flex;
                align-items: center;
                gap: 2rem;
            }
            
            .subject-icon-large {
                width: 100px;
                height: 100px;
                border-radius: 1.5rem;
                background: rgba(255, 255, 255, 0.2);
                backdrop-filter: blur(10px);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2.5rem;
                flex-shrink: 0;
            }
            
            .subject-info {
                flex: 1;
            }
            
            .subject-info h1 {
                font-size: 2.5rem;
                margin: 0 0 1rem;
                font-weight: 700;
            }
            
            .subject-info p {
                font-size: 1.2rem;
                opacity: 0.9;
                margin: 0 0 2rem;
                line-height: 1.6;
            }
            
            .subject-content {
                padding: 3rem;
            }
            
            .topics-section, .featured-graphs-section, .resources-section {
                margin-bottom: 4rem;
            }
            
            .topics-section h2, .featured-graphs-section h2, .resources-section h2 {
                font-size: 1.75rem;
                color: #1e293b;
                margin-bottom: 1.5rem;
            }
            
            .topics-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
            }
            
            .topic-card {
                background: #f8fafc;
                padding: 1.5rem;
                border-radius: 1rem;
                border-left: 4px solid var(--subject-color);
                transition: all 0.3s;
                cursor: pointer;
            }
            
            .topic-card:hover {
                background: #eef2ff;
                transform: translateX(4px);
            }
            
            .topic-card h3 {
                font-size: 1.1rem;
                color: #1e293b;
                margin: 0 0 0.5rem;
            }
            
            .topic-card p {
                color: #64748b;
                font-size: 0.875rem;
                margin: 0;
                line-height: 1.5;
            }
            
            .section-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
            }
            
            .view-all-link {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                color: var(--subject-color);
                text-decoration: none;
                font-weight: 600;
                transition: all 0.3s;
            }
            
            .view-all-link:hover {
                gap: 0.75rem;
            }
            
            .featured-graphs-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 1.5rem;
            }
            
            .featured-graph-card {
                background: #f8fafc;
                border-radius: 1rem;
                overflow: hidden;
                transition: all 0.3s;
                cursor: pointer;
            }
            
            .featured-graph-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            }
            
            .graph-preview {
                height: 120px;
                background: linear-gradient(135deg, var(--subject-color), color-mix(in srgb, var(--subject-color) 70%, white));
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 2rem;
            }
            
            .graph-info {
                padding: 1rem;
            }
            
            .graph-info h4 {
                margin: 0 0 0.5rem;
                color: #1e293b;
                font-size: 1rem;
            }
            
            .graph-info p {
                margin: 0;
                color: #64748b;
                font-size: 0.875rem;
                line-height: 1.4;
            }
            
            .resources-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 1.5rem;
            }
            
            .resource-card {
                background: #f8fafc;
                padding: 1.5rem;
                border-radius: 1rem;
                border: 1px solid #e2e8f0;
                transition: all 0.3s;
                cursor: pointer;
            }
            
            .resource-card:hover {
                background: white;
                border-color: var(--subject-color);
                transform: translateY(-2px);
            }
            
            .resource-icon {
                width: 3rem;
                height: 3rem;
                background: var(--subject-color);
                border-radius: 0.75rem;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.25rem;
                margin-bottom: 1rem;
            }
            
            .resource-card h3 {
                font-size: 1.1rem;
                color: #1e293b;
                margin: 0 0 0.5rem;
            }
            
            .resource-card p {
                color: #64748b;
                font-size: 0.875rem;
                margin: 0;
                line-height: 1.5;
            }
            
            .loading-state {
                text-align: center;
                padding: 4rem 2rem;
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
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            @media (max-width: 768px) {
                .subjects-hero {
                    grid-template-columns: 1fr;
                    gap: 2rem;
                    text-align: center;
                }
                
                .hero-title {
                    font-size: 2.5rem;
                }
                
                .hero-stats {
                    justify-content: center;
                }
                
                .subject-header-content {
                    flex-direction: column;
                    text-align: center;
                    gap: 1rem;
                }
                
                .subject-content {
                    padding: 2rem 1rem;
                }
                
                .topics-grid,
                .featured-graphs-grid,
                .resources-grid {
                    grid-template-columns: 1fr;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        // Subject card clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('.subject-card') || e.target.closest('.subject-card')) {
                const card = e.target.closest('.subject-card');
                if (!e.target.matches('.btn-save') && !e.target.closest('.btn-save')) {
                    this.showSubjectDetail(card.dataset.subject);
                }
            }
            
            // Explore button
            if (e.target.matches('.btn-explore') || e.target.closest('.btn-explore')) {
                const btn = e.target.closest('.btn-explore');
                this.exploreSubject(btn.dataset.subject);
            }
            
            // Save subject button
            if (e.target.matches('.btn-save') || e.target.closest('.btn-save')) {
                const btn = e.target.closest('.btn-save');
                this.toggleSavedSubject(btn.dataset.subject);
            }
            
            // Back button
            if (e.target.matches('#subject-back-btn') || e.target.closest('#subject-back-btn')) {
                this.hideSubjectDetail();
            }
            
            // Topic cards
            if (e.target.matches('.topic-card') || e.target.closest('.topic-card')) {
                const card = e.target.closest('.topic-card');
                this.searchTopic(card.dataset.topic);
            }
            
            // Featured graph cards
            if (e.target.matches('.featured-graph-card') || e.target.closest('.featured-graph-card')) {
                const card = e.target.closest('.featured-graph-card');
                this.viewGraph(card.dataset.graphId);
            }
            
            // Resource cards
            if (e.target.matches('.resource-card') || e.target.closest('.resource-card')) {
                const card = e.target.closest('.resource-card');
                this.openResource(card.dataset.resourceType);
            }
            
            // View all link
            if (e.target.matches('[data-subject-filter]') || e.target.closest('[data-subject-filter]')) {
                e.preventDefault();
                this.filterGraphsBySubject();
            }
        });
    }

    async loadSubjects() {
        this.showLoading();
        
        try {
            this.subjects = await this.mockLoadSubjects();
            this.renderSubjects();
            this.hideLoading();
        } catch (error) {
            console.error('Error loading subjects:', error);
            this.showError('Failed to load subjects');
        }
    }

    async mockLoadSubjects() {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return [
            {
                id: 'physics',
                name: 'Physics',
                description: 'The study of matter, energy, and the fundamental forces of nature. Explore motion, waves, electricity, and quantum phenomena.',
                color: '#4f46e5',
                icon: 'fa-atom',
                stats: {
                    graphs: 156,
                    topics: 24,
                    popularity: 98
                },
                topics: ['Mechanics', 'Waves & Optics', 'Thermodynamics', 'Electromagnetism', 'Quantum Physics'],
                featuredGraphs: [
                    { id: '1', name: 'Wave Interference', description: 'Constructive and destructive wave patterns' },
                    { id: '5', name: 'Electromagnetic Spectrum', description: 'Full spectrum visualization' }
                ]
            },
            {
                id: 'chemistry',
                name: 'Chemistry',
                description: 'Study of substances, their properties, and transformations. Understand reactions, bonds, and molecular structures.',
                color: '#10b981',
                icon: 'fa-vial',
                stats: {
                    graphs: 98,
                    topics: 18,
                    popularity: 92
                },
                topics: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Analytical Chemistry', 'Biochemistry'],
                featuredGraphs: [
                    { id: '2', name: 'Reaction Rates', description: 'Temperature and concentration effects' },
                    { id: '6', name: 'Periodic Trends', description: 'Element properties visualization' }
                ]
            },
            {
                id: 'biology',
                name: 'Biology',
                description: 'The science of life and living organisms. Explore cells, genetics, evolution, and ecosystems.',
                color: '#f59e0b',
                icon: 'fa-dna',
                stats: {
                    graphs: 87,
                    topics: 22,
                    popularity: 85
                },
                topics: ['Cell Biology', 'Genetics', 'Evolution', 'Ecology', 'Human Anatomy'],
                featuredGraphs: [
                    { id: '3', name: 'Population Growth', description: 'Exponential vs logistic models' },
                    { id: '7', name: 'DNA Structure', description: 'Molecular biology visualization' }
                ]
            },
            {
                id: 'mathematics',
                name: 'Mathematics',
                description: 'The language of patterns and relationships. Discover functions, calculus, statistics, and geometry.',
                color: '#ec4899',
                icon: 'fa-calculator',
                stats: {
                    graphs: 143,
                    topics: 16,
                    popularity: 95
                },
                topics: ['Algebra', 'Calculus', 'Geometry', 'Statistics', 'Trigonometry'],
                featuredGraphs: [
                    { id: '4', name: 'Trig Functions', description: 'Sine, cosine, tangent visualization' },
                    { id: '8', name: 'Probability Distributions', description: 'Statistical distributions' }
                ]
            }
        ];
    }

    renderSubjects() {
        const grid = document.getElementById('subjects-grid');
        
        grid.innerHTML = this.subjects.map(subject => this.createSubjectCard(subject)).join('');
    }

    createSubjectCard(subject) {
        const isSaved = this.isSubjectSaved(subject.id);
        
        return `
            <div class="subject-card ${subject.id}" data-subject="${subject.id}" style="--subject-color: ${subject.color}">
                <div class="subject-header">
                    <div class="subject-icon" style="background: ${subject.color}">
                        <i class="fas ${subject.icon}"></i>
                    </div>
                    <h3 class="subject-title">${subject.name}</h3>
                </div>
                
                <p class="subject-description">${subject.description}</p>
                
                <div class="subject-stats">
                    <div class="subject-stat">
                        <div class="stat-value">${subject.stats.graphs}</div>
                        <div class="stat-label">Graphs</div>
                    </div>
                    <div class="subject-stat">
                        <div class="stat-value">${subject.stats.topics}</div>
                        <div class="stat-label">Topics</div>
                    </div>
                    <div class="subject-stat">
                        <div class="stat-value">${subject.stats.popularity}%</div>
                        <div class="stat-label">Popular</div>
                    </div>
                </div>
                
                <div class="subject-topics">
                    ${subject.topics.slice(0, 3).map(topic => 
                        `<span class="topic-tag">${topic}</span>`
                    ).join('')}
                    ${subject.topics.length > 3 ? 
                        `<span class="topic-tag">+${subject.topics.length - 3} more</span>` : ''
                    }
                </div>
                
                <div class="subject-actions">
                    <button class="btn-subject btn-explore" data-subject="${subject.id}">
                        <i class="fas fa-rocket"></i>
                        Explore
                    </button>
                    <button class="btn-subject btn-save ${isSaved ? 'saved' : ''}" data-subject="${subject.id}">
                        <i class="fas ${isSaved ? 'fa-bookmark' : 'fa-bookmark'}"></i>
                        ${isSaved ? 'Saved' : 'Save'}
                    </button>
                </div>
            </div>
        `;
    }

    showSubjectDetail(subjectId) {
        const subject = this.subjects.find(s => s.id === subjectId);
        if (!subject) return;
        
        this.currentSubject = subject;
        
        // Update detail view
        document.getElementById('subject-detail-icon').innerHTML = `<i class="fas ${subject.icon}"></i>`;
        document.getElementById('subject-detail-title').textContent = subject.name;
        document.getElementById('subject-detail-description').textContent = subject.description;
        document.getElementById('subject-graph-count').textContent = subject.stats.graphs;
        document.getElementById('subject-topic-count').textContent = subject.stats.topics;
        document.getElementById('subject-popularity').textContent = subject.stats.popularity + '%';
        
        // Set subject color
        document.documentElement.style.setProperty('--subject-color', subject.color);
        
        // Render topics
        this.renderTopics(subject.topics);
        
        // Render featured graphs
        this.renderFeaturedGraphs(subject.featuredGraphs);
        
        // Render resources
        this.renderResources(subject);
        
        // Show detail view
        document.getElementById('subjects-grid').style.display = 'none';
        document.getElementById('subject-detail').style.display = 'block';
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    hideSubjectDetail() {
        document.getElementById('subjects-grid').style.display = 'grid';
        document.getElementById('subject-detail').style.display = 'none';
        this.currentSubject = null;
    }

    renderTopics(topics) {
        const topicsGrid = document.getElementById('topics-grid');
        
        const topicData = {
            'Mechanics': 'Study of motion and forces',
            'Waves & Optics': 'Wave behavior and light properties',
            'Thermodynamics': 'Heat, energy, and entropy',
            'Electromagnetism': 'Electricity and magnetism',
            'Quantum Physics': 'Atomic and subatomic phenomena',
            'Organic Chemistry': 'Carbon-based compounds',
            'Inorganic Chemistry': 'Non-carbon compounds',
            'Physical Chemistry': 'Physical properties of molecules',
            'Analytical Chemistry': 'Chemical analysis methods',
            'Biochemistry': 'Chemistry of living organisms',
            'Cell Biology': 'Structure and function of cells',
            'Genetics': 'Heredity and variation',
            'Evolution': 'Biological change over time',
            'Ecology': 'Organisms and their environment',
            'Human Anatomy': 'Structure of the human body',
            'Algebra': 'Mathematical symbols and rules',
            'Calculus': 'Rates of change and accumulation',
            'Geometry': 'Shapes, sizes, and properties',
            'Statistics': 'Data collection and analysis',
            'Trigonometry': 'Triangles and periodic functions'
        };
        
        topicsGrid.innerHTML = topics.map(topic => `
            <div class="topic-card" data-topic="${topic}">
                <h3>${topic}</h3>
                <p>${topicData[topic] || 'Explore related graphs and concepts'}</p>
            </div>
        `).join('');
    }

    renderFeaturedGraphs(graphs) {
        const grid = document.getElementById('featured-graphs-grid');
        
        grid.innerHTML = graphs.map(graph => `
            <div class="featured-graph-card" data-graph-id="${graph.id}">
                <div class="graph-preview">
                    <i class="fas fa-chart-bar"></i>
                </div>
                <div class="graph-info">
                    <h4>${graph.name}</h4>
                    <p>${graph.description}</p>
                </div>
            </div>
        `).join('');
    }

    renderResources(subject) {
        const grid = document.getElementById('resources-grid');
        
        const resources = [
            {
                type: 'textbook',
                icon: 'fa-book',
                title: 'Recommended Textbook',
                description: 'Comprehensive guide covering all major topics'
            },
            {
                type: 'video',
                icon: 'fa-play-circle',
                title: 'Video Lectures',
                description: 'Expert explanations and demonstrations'
            },
            {
                type: 'quiz',
                icon: 'fa-question-circle',
                title: 'Practice Quizzes',
                description: 'Test your knowledge with interactive quizzes'
            }
        ];
        
        grid.innerHTML = resources.map(resource => `
            <div class="resource-card" data-resource-type="${resource.type}">
                <div class="resource-icon">
                    <i class="fas ${resource.icon}"></i>
                </div>
                <h3>${resource.title}</h3>
                <p>${resource.description}</p>
            </div>
        `).join('');
    }

    exploreSubject(subjectId) {
        // Navigate to graphs page with subject filter
        this.app.emit('routeChange', { route: 'graphs', data: { subject: subjectId } });
        
        // Also set filter in graph grid
        this.app.emit('setSubjectFilter', { subject: subjectId });
    }

    toggleSavedSubject(subjectId) {
        let saved = JSON.parse(localStorage.getItem('graphz_saved_subjects') || '[]');
        
        if (saved.includes(subjectId)) {
            saved = saved.filter(id => id !== subjectId);
        } else {
            saved.push(subjectId);
        }
        
        localStorage.setItem('graphz_saved_subjects', JSON.stringify(saved));
        
        // Update UI
        this.renderSubjects();
        
        // Show notification
        this.showNotification(
            saved.includes(subjectId) ? 'Subject saved to favorites' : 'Subject removed from favorites',
            saved.includes(subjectId) ? 'success' : 'info'
        );
    }

    isSubjectSaved(subjectId) {
        const saved = JSON.parse(localStorage.getItem('graphz_saved_subjects') || '[]');
        return saved.includes(subjectId);
    }

    searchTopic(topic) {
        // Use search feature to find graphs for this topic
        this.app.emit('triggerSearch', { query: topic });
        this.hideSubjectDetail();
    }

    viewGraph(graphId) {
        this.app.emit('showGraphDetail', { graphId });
    }

    openResource(resourceType) {
        // Handle different resource types
        const messages = {
            textbook: 'Opening recommended textbook resources...',
            video: 'Loading video lecture collection...',
            quiz: 'Starting interactive practice quiz...'
        };
        
        this.showNotification(messages[resourceType] || 'Opening resource...', 'info');
    }

    filterGraphsBySubject() {
        if (this.currentSubject) {
            this.exploreSubject(this.currentSubject.id);
        }
    }

    showLoading() {
        document.getElementById('subjects-loading').style.display = 'block';
        document.getElementById('subjects-grid').style.display = 'none';
    }

    hideLoading() {
        document.getElementById('subjects-loading').style.display = 'none';
        document.getElementById('subjects-grid').style.display = 'grid';
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        // Create notification
        const notification = document.createElement('div');
        notification.className = `subjects-notification subjects-notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles if not already added
        if (!document.querySelector('.subjects-notification-style')) {
            const style = document.createElement('style');
            style.className = 'subjects-notification-style';
            style.textContent = `
                .subjects-notification {
                    position: fixed;
                    top: 2rem;
                    right: 2rem;
                    background: white;
                    padding: 1rem 1.5rem;
                    border-radius: 0.5rem;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    z-index: 1000;
                    animation: slideInRight 0.3s ease-out;
                    border-left: 4px solid;
                }
                
                .subjects-notification-success {
                    border-left-color: #10b981;
                }
                
                .subjects-notification-error {
                    border-left-color: #ef4444;
                }
                
                .subjects-notification-info {
                    border-left-color: #4f46e5;
                }
                
                .notification-content i {
                    color: inherit;
                }
                
                .subjects-notification-success i {
                    color: #10b981;
                }
                
                .subjects-notification-error i {
                    color: #ef4444;
                }
                
                .subjects-notification-info i {
                    color: #4f46e5;
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
    }

    onEvent(event, data) {
        switch (event) {
            case 'routeChange':
                if (data.route === 'subjects') {
                    this.show();
                } else {
                    this.hide();
                }
                break;
                
            case 'triggerSearch':
                if (data.query) {
                    this.searchTopic(data.query);
                }
                break;
        }
    }

    show() {
        document.getElementById('subjects-page').style.display = 'block';
        this.hideSubjectDetail(); // Ensure we're showing the grid view
    }

    hide() {
        document.getElementById('subjects-page').style.display = 'none';
    }
  }
