// Auth Feature - Self-contained authentication system
export default class AuthFeature {
    constructor(app) {
        this.app = app;
        this.name = 'auth';
        this.modal = null;
    }

    async init() {
        console.log('✅ Auth feature initializing...');
        
        // Load template
        await this.loadTemplate();
        
        // Setup event listeners
        this.setupEventListeners();
        
        console.log('✅ Auth feature ready!');
    }

    async loadTemplate() {
        try {
            const response = await fetch('./features/auth/auth.html');
            const html = await response.text();
            
            // Inject at the end of body
            document.body.insertAdjacentHTML('beforeend', html);
            this.modal = document.getElementById('auth-modal');
            
            // Load CSS
            this.loadCSS();
        } catch (error) {
            console.error('❌ Auth template loading failed:', error);
        }
    }

    loadCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = './features/auth/auth.css';
        document.head.appendChild(link);
    }

    setupEventListeners() {
        // Modal controls
        document.addEventListener('click', (e) => {
            if (e.target.matches('.modal-close') || e.target === this.modal) {
                this.hideModal();
            }
            
            if (e.target.matches('.auth-tab')) {
                this.switchTab(e.target.dataset.tab);
            }
            
            if (e.target.matches('.forgot-password')) {
                e.preventDefault();
                this.showForgotPassword();
            }
        });

        // Form submissions
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('signup-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignup();
        });
    }

    onEvent(event, data) {
        if (event === 'showAuthModal') {
            this.showModal();
        }
    }

    showModal() {
        if (this.modal) {
            this.modal.style.display = 'flex';
            this.switchTab('login');
        }
    }

    hideModal() {
        if (this.modal) {
            this.modal.style.display = 'none';
            // Reset forms
            document.getElementById('login-form').reset();
            document.getElementById('signup-form').reset();
        }
    }

    switchTab(tab) {
        // Update tabs
        document.querySelectorAll('.auth-tab').forEach(t => {
            t.classList.toggle('active', t.dataset.tab === tab);
        });
        
        // Show correct form
        document.getElementById('login-form').style.display = 
            tab === 'login' ? 'block' : 'none';
        document.getElementById('signup-form').style.display = 
            tab === 'signup' ? 'block' : 'none';
    }

    async handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        try {
            const firebase = this.app.getModule('firebase');
            await firebase.auth.signInWithEmailAndPassword(email, password);
            this.hideModal();
        } catch (error) {
            alert('Login failed: ' + error.message);
        }
    }

    async handleSignup() {
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        
        try {
            const firebase = this.app.getModule('firebase');
            const userCredential = await firebase.auth.createUserWithEmailAndPassword(email, password);
            
            // Update profile
            await userCredential.user.updateProfile({
                displayName: name
            });
            
            // Save to Firestore
            await firebase.db.collection('users').doc(userCredential.user.uid).set({
                displayName: name,
                email: email,
                createdAt: new Date()
            });
            
            this.hideModal();
            alert('Account created successfully!');
        } catch (error) {
            alert('Signup failed: ' + error.message);
        }
    }

    showForgotPassword() {
        const email = prompt('Enter your email address:');
        if (email) {
            const firebase = this.app.getModule('firebase');
            firebase.auth.sendPasswordResetEmail(email)
                .then(() => {
                    alert('Password reset email sent!');
                })
                .catch(error => {
                    alert('Error: ' + error.message);
                });
        }
    }
    }
