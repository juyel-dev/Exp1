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
        'auth-modal'
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
    
    if (Features.userProfile) {
        initUserProfile();
    }
    
    if (Features.favorites) {
        initFavorites();
    }
    
    // Show home page by default
    showHome();
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
    console.log('🔐 Initializing Auth System...');
}

function initUserProfile() {
    console.log('👤 Initializing User Profile...');
}

function initFavorites() {
    console.log('❤️ Initializing Favorites...');
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
    main.innerHTML = `
        <div class="container p-6">
            <h1 class="text-2xl font-bold mb-6">User Profile</h1>
            <p>Profile feature is enabled but not fully implemented yet.</p>
        </div>
    `;
}

function showFavorites() {
    if (!Features.favorites) return;
    
    const main = document.getElementById('main-content');
    main.innerHTML = `
        <div class="container p-6">
            <h1 class="text-2xl font-bold mb-6">My Favorites</h1>
            <p>Favorites feature is enabled but not fully implemented yet.</p>
        </div>
    `;
}

function loadGraphs() {
    const grid = document.getElementById('graph-grid');
    grid.innerHTML = `
        <div class="graph-card">
            <div class="graph-image">
                <i class="fas fa-chart-line fa-3x"></i>
            </div>
            <div class="graph-content">
                <h3 class="font-semibold mb-2">Wave Interference Pattern</h3>
                <p class="text-sm text-gray mb-4">Visualization of wave interference in physics.</p>
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray">1,247 views</span>
                    <button class="btn btn-sm">View</button>
                </div>
            </div>
        </div>
        
        <div class="graph-card">
            <div class="graph-image">
                <i class="fas fa-atom fa-3x"></i>
            </div>
            <div class="graph-content">
                <h3 class="font-semibold mb-2">Chemical Bonding</h3>
                <p class="text-sm text-gray mb-4">Different types of chemical bonds visualization.</p>
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray">856 views</span>
                    <button class="btn btn-sm">View</button>
                </div>
            </div>
        </div>
        
        <div class="graph-card">
            <div class="graph-image">
                <i class="fas fa-dna fa-3x"></i>
            </div>
            <div class="graph-content">
                <h3 class="font-semibold mb-2">DNA Structure</h3>
                <p class="text-sm text-gray mb-4">Double helix structure of DNA molecule.</p>
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray">1,542 views</span>
                    <button class="btn btn-sm">View</button>
                </div>
            </div>
        </div>
    `;
}

function handleSearch() {
    alert('Search functionality will be implemented!');
}

function showSubjects() {
    alert('Subjects browsing will be implemented!');
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
