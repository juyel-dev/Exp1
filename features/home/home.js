export default class HomeFeature {
    constructor(app) {
        this.app = app;
        this.name = 'home';
    }

    async init() {
        console.log('🚀 Home feature initializing...');
        
        await this.loadHTML();
        this.loadCSS();
        this.setupEventListeners();
        
        console.log('✅ Home feature ready!');
    }

    async loadHTML() {
        const html = `
            <main class="home-page" id="home-page">
                <section class="hero-section">
                    <div class="hero-container">
                        <div class="hero-content">
                            <h1 class="hero-title">
                                Visual Learning Made 
                                <span class="gradient-text">Interactive</span>
                            </h1>
                            <p class="hero-description">
                                Explore hundreds of educational graphs across science and mathematics. 
                                Perfect for students, teachers, and curious minds.
                            </p>
                            <div class="hero-buttons">
                                <button class="btn btn-primary explore-btn">
                                    <i class="fas fa-rocket"></i>
                                    Explore Graphs
                                </button>
                                <button class="btn btn-secondary subjects-btn">
                                    <i class="fas fa-graduation-cap"></i>
                                    Browse Subjects
                                </button>
                            </div>
                        </div>
                        <div class="hero-visual">
                            <div class="visual-placeholder">
                                <i class="fas fa-chart-bar"></i>
                                <p>Interactive Graph Visualizations</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="features-section">
                    <div class="container">
                        <h2 class="section-title">Why Choose Graphz?</h2>
                        <div class="features-grid">
                            <div class="feature-card">
                                <div class="feature-icon">
                                    <i class="fas fa-search"></i>
                                </div>
                                <h3>Smart Search</h3>
                                <p>Find exactly what you need with our intelligent search and filtering system</p>
                            </div>
                            <div class="feature-card">
                                <div class="feature-icon">
                                    <i class="fas fa-mobile-alt"></i>
                                </div>
                                <h3>Mobile Friendly</h3>
                                <p>Access graphs anywhere, anytime with our responsive design</p>
                            </div>
                            <div class="feature-card">
                                <div class="feature-icon">
                                    <i class="fas fa-download"></i>
                                </div>
                                <h3>Easy Download</h3>
                                <p>Download high-quality graph images for your projects and presentations</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="stats-section">
                    <div class="container">
                        <div class="stats-grid">
                            <div class="stat-item">
                                <div class="stat-number">500+</div>
                                <div class="stat-label">Educational Graphs</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number">4</div>
                                <div class="stat-label">Main Subjects</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number">10K+</div>
                                <div class="stat-label">Monthly Views</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number">100%</div>
                                <div class="stat-label">Free Access</div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        `;
        
        const app = document.getElementById('app');
        const header = document.querySelector('.graphz-header');
        if (header) {
            header.insertAdjacentHTML('afterend', html);
        } else {
            app.innerHTML += html;
        }
    }

    loadCSS() {
        const style = document.createElement('style');
        style.textContent = `
            .home-page {
                min-height: 100vh;
            }
            
            .hero-section {
                background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
                color: white;
                padding: 4rem 0;
            }
            
            .hero-container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 1rem;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 3rem;
                align-items: center;
            }
            
            .hero-title {
                font-size: 3.5rem;
                font-weight: 700;
                line-height: 1.1;
                margin-bottom: 1.5rem;
            }
            
            .gradient-text {
                background: linear-gradient(45deg, #f59e0b, #ef4444);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            
            .hero-description {
                font-size: 1.25rem;
                opacity: 0.9;
                margin-bottom: 2rem;
                line-height: 1.6;
            }
            
            .hero-buttons {
                display: flex;
                gap: 1rem;
                flex-wrap: wrap;
            }
            
            .btn-primary {
                background: #f59e0b;
                color: white;
                border: none;
            }
            
            .btn-primary:hover {
                background: #e49c0b;
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3);
            }
            
            .btn-secondary {
                background: rgba(255, 255, 255, 0.2);
                backdrop-filter: blur(10px);
                color: white;
                border: 2px solid rgba(255, 255, 255, 0.3);
            }
            
            .btn-secondary:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: translateY(-2px);
            }
            
            .hero-visual {
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .visual-placeholder {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border-radius: 1rem;
                padding: 3rem;
                text-align: center;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .visual-placeholder i {
                font-size: 4rem;
                margin-bottom: 1rem;
                opacity: 0.8;
            }
            
            .features-section {
                padding: 5rem 0;
                background: #f8fafc;
            }
            
            .container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 1rem;
            }
            
            .section-title {
                text-align: center;
                font-size: 2.5rem;
                margin-bottom: 3rem;
                color: #1e293b;
            }
            
            .features-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 2rem;
            }
            
            .feature-card {
                background: white;
                padding: 2rem;
                border-radius: 1rem;
                text-align: center;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                transition: transform 0.3s, box-shadow 0.3s;
            }
            
            .feature-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            }
            
            .feature-icon {
                width: 80px;
                height: 80px;
                background: #eef2ff;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 1.5rem;
                color: #4f46e5;
                font-size: 2rem;
            }
            
            .feature-card h3 {
                font-size: 1.5rem;
                margin-bottom: 1rem;
                color: #1e293b;
            }
            
            .feature-card p {
                color: #64748b;
                line-height: 1.6;
            }
            
            .stats-section {
                padding: 4rem 0;
                background: white;
            }
            
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 2rem;
                text-align: center;
            }
            
            .stat-item {
                padding: 2rem;
            }
            
            .stat-number {
                font-size: 3rem;
                font-weight: 700;
                color: #4f46e5;
                margin-bottom: 0.5rem;
            }
            
            .stat-label {
                font-size: 1.1rem;
                color: #64748b;
                font-weight: 500;
            }
            
            @media (max-width: 768px) {
                .hero-container {
                    grid-template-columns: 1fr;
                    text-align: center;
                }
                
                .hero-title {
                    font-size: 2.5rem;
                }
                
                .hero-buttons {
                    justify-content: center;
                }
                
                .features-grid {
                    grid-template-columns: 1fr;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.explore-btn') || e.target.closest('.explore-btn')) {
                this.handleExploreClick();
            }
            
            if (e.target.matches('.subjects-btn') || e.target.closest('.subjects-btn')) {
                this.handleSubjectsClick();
            }
        });
    }

    handleExploreClick() {
        this.app.emit('routeChange', { route: 'graphs', data: null });
        
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector('[data-route="graphs"]').classList.add('active');
    }

    handleSubjectsClick() {
        this.app.emit('routeChange', { route: 'subjects', data: null });
        
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector('[data-route="subjects"]').classList.add('active');
    }

    onEvent(event, data) {
        if (event === 'routeChange' && data.route === 'home') {
            this.show();
        }
    }

    show() {
        const homePage = document.getElementById('home-page');
        if (homePage) {
            homePage.style.display = 'block';
        }
    }
}
