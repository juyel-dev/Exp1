// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyA84Ty4SNDuLMKzeHX1pJMUgjoFZ89nbRE",
    authDomain: "graphzlive.firebaseapp.com",
    projectId: "graphzlive",
    storageBucket: "graphzlive.firebasestorage.app",
    messagingSenderId: "521947472086",
    appId: "1:521947472086:web:b7795552c40bb58b0b2977"
};

// Global State
let Features = {};
let currentUser = null;
let graphs = [];
let components = {};

// Initialize App
async function initApp() {
    try {
        // Load feature flags
        const response = await fetch('features.json');
        Features = await response.json();
        
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        
        // Load components
        await loadComponents();
        
        // Initialize features based on flags
        initFeatures();
        
        // Set up auth state listener
        initAuth();
        
    } catch (error) {
        console.error('App initialization failed:', error);
    }
}

// Load HTML Components
async function loadComponents() {
    const componentFiles = [
        'graph-card',
        'auth-modal',
        'comment-box',
        'profile-page',
        'admin-panel'
    ];
    
    for (const file of componentFiles) {
        try {
            const response = await fetch(`components/${file}.html`);
            components[file] = await response.text();
        } catch (error) {
            console.warn(`Component ${file} not found`);
        }
    }
}

// Initialize Features Based on Flags
function initFeatures() {
    renderAppShell();
    
    // Auth Features
    if (Features.signup || Features.googleLogin) {
        initAuthSystem();
    }
    
    if (Features.emailVerification) {
        initEmailVerification();
    }
    
    if (Features.passwordReset) {
        initPasswordReset();
    }
    
    // User Features
    if (Features.userProfile) {
        initUserProfile();
    }
    
    if (Features.favorites) {
        initFavorites();
    }
    
    if (Features.comments) {
        initComments();
    }
    
    if (Features.rating) {
        initRating();
    }
    
    if (Features.tags) {
        initTags();
    }
    
    if (Features.sortOptions) {
        initSortOptions();
    }
    
    // Admin Features
    if (Features.adminModeration) {
        initAdminModeration();
    }
    
    if (Features.bulkUpload) {
        initBulkUpload();
    }
    
    // Performance Features
    if (Features.lazyLoading) {
        initLazyLoading();
    }
    
    if (Features.offlineSupport) {
        initOfflineSupport();
    }
    
    if (Features.pushNotifications) {
        initPushNotifications();
    }
    
    if (Features.seoMetaTags) {
        initSEOMetaTags();
    }
    
    // Monetization
    if (Features.adsense) {
        initAdSense();
    }
}

// Render App Shell
function renderAppShell() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <header class="header">
            <div class="container">
                <div class="header-content">
                    <a href="#" class="logo" onclick="showHome()">
                        <div class="logo-icon">
                            <i class="fas fa-chart-network"></i>
                        </div>
                        <span>GraphzLive</span>
                    </a>
                    
                    <ul class="nav">
                        <li><a href="#" class="active" onclick="showHome()"><i class="fas fa-home"></i> Home</a></li>
                        ${Features.userProfile ? '<li><a href="#" onclick="showProfile()"><i class="fas fa-user"></i> Profile</a></li>' : ''}
                        ${Features.favorites ? '<li><a href="#" onclick="showFavorites()"><i class="fas fa-star"></i> Favorites</a></li>' : ''}
                        <li><a href="#" onclick="showAdmin()"><i class="fas fa-user-shield"></i> Admin</a></li>
                    </ul>
                    
                    <div id="auth-buttons">
                        <button class="btn btn-outline" onclick="showAuthModal()">
                            <i class="fas fa-sign-in-alt"></i> Login
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <main id="main-content">
            <!-- Dynamic content will be loaded here -->
        </main>

        <footer class="p-6" style="background: var(--dark); color: white;">
            <div class="container text-center">
                <p>&copy; 2023 GraphzLive. All rights reserved.</p>
                ${Features.adsense ? '<div id="ad-container"></div>' : ''}
            </div>
        </footer>

        <!-- Auth Modal -->
        <div id="auth-modal" class="modal">
            <div class="modal-content p-6">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold">Login to GraphzLive</h2>
                    <button onclick="hideAuthModal()" class="btn btn-outline">✕</button>
                </div>
                <div id="auth-modal-content">
                    <!-- Auth content loaded from component -->
                </div>
            </div>
        </div>
    `;
}

// Feature Initialization Functions
function initAuthSystem() {
    console.log('Initializing Auth System...');
    // Auth logic will be implemented here
}

function initEmailVerification() {
    console.log('Initializing Email Verification...');
}

function initPasswordReset() {
    console.log('Initializing Password Reset...');
}

function initUserProfile() {
    console.log('Initializing User Profile...');
}

function initFavorites() {
    console.log('Initializing Favorites...');
}

function initComments() {
    console.log('Initializing Comments...');
}

function initRating() {
    console.log('Initializing Rating System...');
}

function initTags() {
    console.log('Initializing Tags...');
}

function initSortOptions() {
    console.log('Initializing Sort Options...');
}

function initAdminModeration() {
    console.log('Initializing Admin Moderation...');
}

function initBulkUpload() {
    console.log('Initializing Bulk Upload...');
}

function initLazyLoading() {
    console.log('Initializing Lazy Loading...');
}

function initOfflineSupport() {
    console.log('Initializing Offline Support...');
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    }
}

function initPushNotifications() {
    console.log('Initializing Push Notifications...');
}

function initSEOMetaTags() {
    console.log('Initializing SEO Meta Tags...');
}

function initAdSense() {
    console.log('Initializing AdSense...');
}

// UI Functions
function showHome() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
        <section class="hero">
            <div class="container">
                <h1 class="text-4xl font-bold mb-4">Visual Knowledge Platform</h1>
                <p class="text-xl mb-6">Explore hundreds of educational graphs across science and mathematics.</p>
                <div class="hero-buttons">
                    <button class="btn btn-secondary" onclick="loadGraphs()">
                        <i class="fas fa-rocket"></i> Explore Graphs
                    </button>
                    <button class="btn btn-accent" onclick="showSubjects()">
                        <i class="fas fa-graduation-cap"></i> Browse Subjects
                    </button>
                </div>
            </div>
        </section>

        <section class="container">
            <div class="search-section">
                <div class="search-container">
                    <input type="text" class="search-box" placeholder="Search graphs..." id="search-input">
                    <button class="btn" onclick="handleSearch()"><i class="fas fa-search"></i> Search</button>
                </div>
                <div class="filter-chips" id="filter-chips">
                    <div class="filter-chip active">All</div>
                    <div class="filter-chip">Physics</div>
                    <div class="filter-chip">Chemistry</div>
                    <div class="filter-chip">Biology</div>
                </div>
            </div>
        </section>

        <section class="container">
            <h2 class="text-2xl font-bold mb-4">Popular Graphs</h2>
            <div class="graph-grid" id="graph-grid">
                <!-- Graphs will be loaded here -->
            </div>
        </section>
    `;
}

function showAuthModal() {
    const modal = document.getElementById('auth-modal');
    const content = document.getElementById('auth-modal-content');
    
    if (components['auth-modal']) {
        content.innerHTML = components['auth-modal'];
    } else {
        content.innerHTML = `
            <div class="form-group">
                <label class="form-label">Email</label>
                <input type="email" class="form-input" placeholder="Enter your email">
            </div>
            <div class="form-group">
                <label class="form-label">Password</label>
                <input type="password" class="form-input" placeholder="Enter your password">
            </div>
            <button class="btn w-full mb-4">Login</button>
            ${Features.googleLogin ? '<button class="btn btn-outline w-full"><i class="fab fa-google"></i> Sign in with Google</button>' : ''}
            ${Features.signup ? '<p class="text-center mt-4">Don\'t have an account? <a href="#" class="text-primary">Sign up</a></p>' : ''}
            ${Features.passwordReset ? '<p class="text-center mt-2"><a href="#" class="text-sm">Forgot password?</a></p>' : ''}
        `;
    }
    
    modal.style.display = 'flex';
}

function hideAuthModal() {
    document.getElementById('auth-modal').style.display = 'none';
}

function showProfile() {
    if (!Features.userProfile) return;
    
    const main = document.getElementById('main-content');
    if (components['profile-page']) {
        main.innerHTML = components['profile-page'];
    } else {
        main.innerHTML = `
            <div class="container p-6">
                <div class="profile-header">
                    <div class="logo-icon" style="margin: 0 auto 1rem;">
                        <i class="fas fa-user"></i>
                    </div>
                    <h1 class="text-2xl font-bold">User Profile</h1>
                    <p class="text-gray">user@example.com</p>
                </div>
                
                <div class="profile-stats">
                    <div class="stat-card card">
                        <h3 class="text-lg font-semibold">Graphs Uploaded</h3>
                        <p class="text-2xl font-bold">12</p>
                    </div>
                    <div class="stat-card card">
                        <h3 class="text-lg font-semibold">Favorites</h3>
                        <p class="text-2xl font-bold">8</p>
                    </div>
                    <div class="stat-card card">
                        <h3 class="text-lg font-semibold">Comments</h3>
                        <p class="text-2xl font-bold">23</p>
                    </div>
                </div>
            </div>
        `;
    }
}

function showAdmin() {
    const main = document.getElementById('main-content');
    if (components['admin-panel']) {
        main.innerHTML = components['admin-panel'];
    } else {
        main.innerHTML = `
            <div class="container p-6">
                <h1 class="text-2xl font-bold mb-6">Admin Dashboard</h1>
                <div class="grid gap-6">
                    ${Features.bulkUpload ? `
                    <div class="card">
                        <h2 class="text-xl font-semibold mb-4">Bulk Upload</h2>
                        <input type="file" accept=".csv" class="form-input mb-4">
                        <button class="btn">Upload CSV</button>
                    </div>
                    ` : ''}
                    
                    ${Features.adminModeration ? `
                    <div class="card">
                        <h2 class="text-xl font-semibold mb-4">Moderation Queue</h2>
                        <p>No pending reports</p>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
}

function loadGraphs() {
    const grid = document.getElementById('graph-grid');
    if (components['graph-card']) {
        // Load multiple graph cards from template
        grid.innerHTML = components['graph-card'].repeat(6);
    } else {
        grid.innerHTML = `
            <div class="graph-card">
                <div class="graph-image">
                    <i class="fas fa-chart-line fa-3x"></i>
                </div>
                <div class="graph-content">
                    <h3 class="font-semibold mb-2">Sample Graph</h3>
                    <p class="text-sm text-gray mb-4">This is a sample graph description.</p>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray">125 views</span>
                        ${Features.favorites ? '<button class="favorite-btn">♥</button>' : ''}
                    </div>
                </div>
            </div>
        `.repeat(6);
    }
}

function handleSearch() {
    console.log('Search functionality');
}

// Auth Functions
function initAuth() {
    firebase.auth().onAuthStateChanged((user) => {
        currentUser = user;
        updateAuthUI();
    });
}

function updateAuthUI() {
    const authButtons = document.getElementById('auth-buttons');
    
    if (currentUser) {
        authButtons.innerHTML = `
            <div class="flex items-center gap-4">
                <span>Hello, ${currentUser.displayName || currentUser.email}</span>
                ${Features.userProfile ? '<button class="btn btn-outline" onclick="showProfile()"><i class="fas fa-user"></i></button>' : ''}
                <button class="btn btn-danger" onclick="logout()"><i class="fas fa-sign-out-alt"></i></button>
            </div>
        `;
    } else {
        authButtons.innerHTML = `
            <button class="btn btn-outline" onclick="showAuthModal()">
                <i class="fas fa-sign-in-alt"></i> Login
            </button>
        `;
    }
}

function logout() {
    firebase.auth().signOut();
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
