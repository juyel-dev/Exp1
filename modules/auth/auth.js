export class AuthModule {
    static async init(eventBus) {
        console.log('🔐 Auth Module initializing...');
        this.eventBus = eventBus;
        
        // Set up auth state listener
        firebase.auth().onAuthStateChanged((user) => {
            this.currentUser = user;
            this.updateAuthUI();
            eventBus.emit('auth:state-changed', user);
        });

        // Listen for auth events
        eventBus.on('auth:show-modal', () => this.showAuthModal());
        eventBus.on('auth:login', (data) => this.handleLogin(data));
        eventBus.on('auth:signup', (data) => this.handleSignup(data));
        eventBus.on('auth:logout', () => this.handleLogout());
        
        console.log('✅ Auth Module ready');
        return this;
    }

    static updateAuthUI() {
        const authButtons = document.getElementById('auth-buttons');
        
        if (this.currentUser) {
            authButtons.innerHTML = `
                <div class="flex items-center gap-4">
                    <span>Hello, ${this.currentUser.displayName || this.currentUser.email}</span>
                    <button class="btn btn-danger" onclick="app.eventBus.emit('auth:logout')">
                        <i class="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            `;
        } else {
            authButtons.innerHTML = `
                <button class="btn btn-outline" onclick="app.eventBus.emit('auth:show-modal')">
                    <i class="fas fa-sign-in-alt"></i> Login
                </button>
            `;
        }
    }

    static showAuthModal() {
        const modalHTML = `
            <div class="modal" style="display: flex;">
                <div class="modal-content p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl font-bold">Login to GraphzLive</h2>
                        <button onclick="this.closest('.modal').style.display='none'" class="btn btn-outline">✕</button>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-input" id="auth-email" placeholder="your@email.com">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Password</label>
                        <input type="password" class="form-input" id="auth-password" placeholder="••••••••">
                    </div>
                    
                    <button class="btn w-full mb-4" onclick="app.eventBus.emit('auth:login', {
                        email: document.getElementById('auth-email').value,
                        password: document.getElementById('auth-password').value
                    })">Sign In</button>
                    
                    <button class="btn btn-outline w-full" onclick="app.eventBus.emit('auth:signup', {
                        email: document.getElementById('auth-email').value,
                        password: document.getElementById('auth-password').value,
                        displayName: 'New User'
                    })">Create Account</button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    static async handleLogin({ email, password }) {
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
            document.querySelector('.modal')?.remove();
        } catch (error) {
            alert('Login failed: ' + error.message);
        }
    }

    static async handleSignup({ email, password, displayName }) {
        try {
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            await userCredential.user.updateProfile({ displayName });
            document.querySelector('.modal')?.remove();
        } catch (error) {
            alert('Signup failed: ' + error.message);
        }
    }

    static async handleLogout() {
        await firebase.auth().signOut();
    }
}

export async function init(eventBus) {
    return await AuthModule.init(eventBus);
}
