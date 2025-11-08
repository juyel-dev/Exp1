export default class HeaderFeature {
    constructor(app) {
        this.app = app;
        this.name = 'header';
        this.user = null;
    }

    async init() {
        console.log('🚀 Header feature initializing...');
        
        await this.loadHTML();
        this.loadCSS();
        this.setupEventListeners();
        
        console.log('✅ Header feature ready!');
    }

    async loadHTML() {
        const html = `
            <header class="graphz-header">
                <div class="header-container">
                    <div class="logo">
                        <div class="logo-icon">
                            <i class="fas fa-chart-network"></i>
                        </div>
                        <span>Graphz</span>
                    </div>
                    
                    <nav class="main-nav">
                        <ul>
                            <li><a href="#home" class="nav-link active" data-route="home">Home</a></li>
                            <li><a href="#graphs" class="nav-link" data-route="graphs">Graphs</a></li>
                            <li><a href="#subjects" class="nav-link" data-route="subjects">Subjects</a></li>
                            <li class="nav-profile" style="display: none;">
                                <a href="#profile" class="nav-link" data-route="profile">Profile</a>
                            </li>
                            <li class="nav-admin" style="display: none;">
                                <a href="#admin" class="nav-link" data-route="admin">Admin</a>
                            </li>
                        </ul>
                    </nav>
                    
                    <div class="header-actions">
                        <button class="btn btn-outline search-trigger-btn" id="header-search-trigger">
                            <i class="fas fa-search"></i>
                            Search
                        </button>
                        <div class="auth-buttons">
                            <button class="btn btn-outline login-btn">
                                <i class="fas fa-sign-in-alt"></i> Login
                            </button>
                        </div>
                        <div class="user-menu" style="display: none;">
                            <div class="user-avatar">
                                <i class="fas fa-user"></i>
                            </div>
                            <button class="btn btn-outline logout-btn">
                                <i class="fas fa-sign-out-alt"></i> Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        `;
        
        document.getElementById('app').insertAdjacentHTML('afterbegin', html);
    }

    loadCSS() {
        const style = document.createElement('style');
        style.textContent = `
            .graphz-header {
                background: white;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                position: sticky;
                top: 0;
                z-index: 1000;
                border-bottom: 1px solid #e2e8f0;
            }
            
            .header-container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 1rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 70px;
            }
            
            .logo {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                font-weight: 700;
                font-size: 1.5rem;
                color: #4f46e5;
                text-decoration: none;
            }
            
            .logo-icon {
                width: 40px;
                height: 40px;
                background: #4f46e5;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
            }
            
            .main-nav ul {
                display: flex;
                list-style: none;
                gap: 2rem;
                margin: 0;
                padding: 0;
            }
            
            .nav-link {
                text-decoration: none;
                color: #374151;
                font-weight: 500;
                padding: 0.5rem 1rem;
                border-radius: 0.5rem;
                transition: all 0.3s;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .nav-link:hover {
                color: #4f46e5;
                background: #f8fafc;
            }
            
            .nav-link.active {
                color: #4f46e5;
                background: #eef2ff;
            }
            
            .header-actions {
                display: flex;
                gap: 1rem;
                align-items: center;
            }
            
            .btn {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem 1rem;
                border: none;
                border-radius: 0.5rem;
                font-weight: 600;
                cursor: pointer;
                text-decoration: none;
                transition: all 0.3s;
                font-size: 0.9rem;
            }
            
            .btn-outline {
                background: transparent;
                border: 2px solid #4f46e5;
                color: #4f46e5;
            }
            
            .btn-outline:hover {
                background: #4f46e5;
                color: white;
                transform: translateY(-1px);
            }
            
            .search-trigger-btn {
                background: #f8fafc;
                border-color: #d1d5db;
                color: #374151;
            }
            
            .search-trigger-btn:hover {
                background: #4f46e5;
                border-color: #4f46e5;
                color: white;
            }
            
            .user-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: #4f46e5;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
            }
            
            @media (max-width: 768px) {
                .header-container {
                    flex-direction: column;
                    height: auto;
                    padding: 1rem;
                    gap: 1rem;
                }
                
                .main-nav ul {
                    gap: 1rem;
                }
                
                .header-actions {
                    flex-wrap: wrap;
                    justify-content: center;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        // Navigation clicks
        document.addEventListener('click', (e) => {
            const navLink = e.target.closest('.nav-link');
            if (navLink) {
                e.preventDefault();
                const route = navLink.dataset.route;
                this.handleNavigation(route, navLink);
            }
            
            if (e.target.matches('.login-btn') || e.target.closest('.login-btn')) {
                this.handleLoginClick();
            }
            
            if (e.target.matches('.logout-btn') || e.target.closest('.logout-btn')) {
                this.handleLogoutClick();
            }
            
            // Search trigger button handler
            if (e.target.matches('#header-search-trigger') || e.target.closest('#header-search-trigger')) {
                this.app.emit('showSearchModal', {});
            }
        });
    }

    handleNavigation(route, clickedElement) {
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        clickedElement.classList.add('active');
        
        // Notify other features about route change
        this.app.emit('routeChange', { route, data: null });
        
        // Special handling for home route
        if (route === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        console.log(`📍 Navigation: ${route}`);
    }

    handleLoginClick() {
        this.app.emit('showAuthModal', {});
    }

    handleLogoutClick() {
        if (confirm('Are you sure you want to logout?')) {
            this.app.emit('userLogout', {});
        }
    }

    onEvent(event, data) {
        switch (event) {
            case 'userLoggedIn':
                this.handleUserLoggedIn(data);
                break;
            case 'userLoggedOut':
                this.handleUserLoggedOut();
                break;
            case 'adminAccessGranted':
                this.handleAdminAccess();
                break;
            case 'routeChange':
                // Update active nav based on route change from other features
                this.updateActiveNav(data.route);
                break;
        }
    }

    updateActiveNav(route) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.route === route) {
                link.classList.add('active');
            }
        });
    }

    handleUserLoggedIn(user) {
        this.user = user;
        
        // Update UI
        document.querySelector('.auth-buttons').style.display = 'none';
        document.querySelector('.user-menu').style.display = 'flex';
        document.querySelector('.nav-profile').style.display = 'list-item';
        
        // Update avatar
        const avatar = document.querySelector('.user-avatar');
        if (user.displayName) {
            avatar.textContent = user.displayName.charAt(0).toUpperCase();
        } else if (user.email) {
            avatar.textContent = user.email.charAt(0).toUpperCase();
        }
    }

    handleUserLoggedOut() {
        this.user = null;
        
        // Update UI
        document.querySelector('.auth-buttons').style.display = 'flex';
        document.querySelector('.user-menu').style.display = 'none';
        document.querySelector('.nav-profile').style.display = 'none';
        document.querySelector('.nav-admin').style.display = 'none';
    }

    handleAdminAccess() {
        document.querySelector('.nav-admin').style.display = 'list-item';
    }
}
