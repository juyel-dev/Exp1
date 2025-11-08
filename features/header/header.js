// Header Feature - Auto-registering
export default class HeaderFeature {
    constructor(app) {
        this.app = app;
        this.name = 'header';
        this.user = null;
    }

    async init() {
        console.log('✅ Header feature initializing...');
        
        // Load HTML template
        await this.loadTemplate();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Register with router
        this.registerRoutes();
        
        console.log('✅ Header feature ready!');
    }

    async loadTemplate() {
        try {
            const response = await fetch('./features/header/header.html');
            const html = await response.text();
            
            // Inject at the top of app
            const app = document.getElementById('app');
            app.insertAdjacentHTML('afterbegin', html);
            
            // Load CSS
            this.loadCSS();
        } catch (error) {
            console.error('❌ Header template loading failed:', error);
        }
    }

    loadCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = './features/header/header.css';
        document.head.appendChild(link);
    }

    setupEventListeners() {
        // Delegate navigation clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('.nav-link')) {
                e.preventDefault();
                const route = e.target.dataset.route;
                this.app.getModule('router').navigate(route);
            }
            
            if (e.target.matches('.login-btn')) {
                this.app.notifyFeatures('showAuthModal');
            }
            
            if (e.target.matches('.logout-btn')) {
                this.app.getModule('firebase').auth.signOut();
            }
        });
    }

    registerRoutes() {
        const router = this.app.getModule('router');
        if (router) {
            // Header doesn't handle routes directly, but updates navigation
        }
    }

    onEvent(event, data) {
        switch (event) {
            case 'authStateChanged':
                this.handleAuthChange(data);
                break;
            case 'routeChange':
                this.updateActiveNav(data.route);
                break;
        }
    }

    handleAuthChange(user) {
        this.user = user;
        const authButtons = document.querySelector('.auth-buttons');
        const userMenu = document.querySelector('.user-menu');
        const navAuth = document.querySelector('.nav-auth');
        const navAdmin = document.querySelector('.nav-admin');
        const userAvatar = document.querySelector('.user-avatar');

        if (user) {
            // User is logged in
            authButtons.style.display = 'none';
            userMenu.style.display = 'flex';
            navAuth.style.display = 'list-item';
            
            // Update avatar
            if (userAvatar) {
                userAvatar.textContent = user.displayName ? 
                    user.displayName.charAt(0).toUpperCase() : 
                    user.email.charAt(0).toUpperCase();
            }
            
            // Show admin nav if user is admin
            // This would check user role from Firestore
            if (user.email === 'admin@graphz.com') {
                navAdmin.style.display = 'list-item';
            }
        } else {
            // User is logged out
            authButtons.style.display = 'flex';
            userMenu.style.display = 'none';
            navAuth.style.display = 'none';
            navAdmin.style.display = 'none';
        }
    }

    updateActiveNav(route) {
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.route === route);
        });
    }
}
