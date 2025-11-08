export default class AuthFeature {
    constructor(app) {
        this.app = app;
        this.name = 'auth';
        this.modal = null;
        this.currentUser = null;
    }

    async init() {
        console.log('🚀 Auth feature initializing...');
        
        await this.loadHTML();
        this.loadCSS();
        this.setupEventListeners();
        this.initFirebaseAuth();
        
        console.log('✅ Auth feature ready!');
    }

    async loadHTML() {
        const html = `
            <div id="auth-modal" class="auth-modal">
                <div class="modal-overlay" id="auth-modal-overlay"></div>
                <div class="modal-content">
                    <button class="modal-close" id="auth-modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                    
                    <div class="modal-header">
                        <h2>Welcome to Graphz</h2>
                        <p>Join our community of learners</p>
                    </div>

                    <div class="auth-tabs">
                        <button class="auth-tab active" data-tab="login">
                            <i class="fas fa-sign-in-alt"></i>
                            Login
                        </button>
                        <button class="auth-tab" data-tab="signup">
                            <i class="fas fa-user-plus"></i>
                            Sign Up
                        </button>
                    </div>

                    <!-- Login Form -->
                    <form class="auth-form active" id="login-form" data-type="login">
                        <div class="form-group">
                            <label for="login-email">Email Address</label>
                            <input type="email" id="login-email" required placeholder="Enter your email">
                            <div class="input-icon">
                                <i class="fas fa-envelope"></i>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="login-password">Password</label>
                            <input type="password" id="login-password" required placeholder="Enter your password">
                            <div class="input-icon">
                                <i class="fas fa-lock"></i>
                            </div>
                            <button type="button" class="toggle-password" data-target="login-password">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>

                        <div class="form-options">
                            <label class="checkbox">
                                <input type="checkbox" id="remember-me">
                                <span class="checkmark"></span>
                                Remember me
                            </label>
                            <a href="#" class="forgot-password">Forgot Password?</a>
                        </div>

                        <button type="submit" class="btn btn-primary btn-full">
                            <i class="fas fa-sign-in-alt"></i>
                            Sign In
                        </button>

                        <div class="auth-divider">
                            <span>Or continue with</span>
                        </div>

                        <button type="button" class="btn btn-google btn-full" id="google-login">
                            <i class="fab fa-google"></i>
                            Google
                        </button>
                    </form>

                    <!-- Signup Form -->
                    <form class="auth-form" id="signup-form" data-type="signup">
                        <div class="form-group">
                            <label for="signup-name">Full Name</label>
                            <input type="text" id="signup-name" required placeholder="Enter your full name">
                            <div class="input-icon">
                                <i class="fas fa-user"></i>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="signup-email">Email Address</label>
                            <input type="email" id="signup-email" required placeholder="Enter your email">
                            <div class="input-icon">
                                <i class="fas fa-envelope"></i>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="signup-password">Password</label>
                            <input type="password" id="signup-password" required placeholder="Create a password">
                            <div class="input-icon">
                                <i class="fas fa-lock"></i>
                            </div>
                            <button type="button" class="toggle-password" data-target="signup-password">
                                <i class="fas fa-eye"></i>
                            </button>
                            <div class="password-strength">
                                <div class="strength-bar"></div>
                                <span class="strength-text">Weak</span>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="signup-confirm">Confirm Password</label>
                            <input type="password" id="signup-confirm" required placeholder="Confirm your password">
                            <div class="input-icon">
                                <i class="fas fa-lock"></i>
                            </div>
                        </div>

                        <div class="form-options">
                            <label class="checkbox">
                                <input type="checkbox" id="accept-terms" required>
                                <span class="checkmark"></span>
                                I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                            </label>
                        </div>

                        <button type="submit" class="btn btn-primary btn-full">
                            <i class="fas fa-user-plus"></i>
                            Create Account
                        </button>
                    </form>

                    <!-- Forgot Password Form -->
                    <form class="auth-form" id="forgot-form" data-type="forgot">
                        <div class="form-group">
                            <label for="forgot-email">Email Address</label>
                            <input type="email" id="forgot-email" required placeholder="Enter your email">
                            <div class="input-icon">
                                <i class="fas fa-envelope"></i>
                            </div>
                        </div>

                        <p class="forgot-instructions">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>

                        <button type="submit" class="btn btn-primary btn-full">
                            <i class="fas fa-paper-plane"></i>
                            Send Reset Link
                        </button>

                        <button type="button" class="btn btn-text btn-full" id="back-to-login">
                            <i class="fas fa-arrow-left"></i>
                            Back to Login
                        </button>
                    </form>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', html);
        this.modal = document.getElementById('auth-modal');
    }

    loadCSS() {
        const style = document.createElement('style');
        style.textContent = `
            .auth-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 2000;
                display: none;
            }
            
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(5px);
            }
            
            .modal-content {
                position: relative;
                background: white;
                margin: 2rem auto;
                max-width: 450px;
                border-radius: 1rem;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                overflow: hidden;
                animation: modalSlideIn 0.3s ease-out;
            }
            
            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(-50px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            .modal-close {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: rgba(0, 0, 0, 0.1);
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
                z-index: 10;
            }
            
            .modal-close:hover {
                background: rgba(0, 0, 0, 0.2);
                color: #374151;
            }
            
            .modal-header {
                padding: 2rem 2rem 1rem;
                text-align: center;
                background: linear-gradient(135deg, #4f46e5, #7c3aed);
                color: white;
            }
            
            .modal-header h2 {
                margin: 0 0 0.5rem;
                font-size: 1.75rem;
            }
            
            .modal-header p {
                margin: 0;
                opacity: 0.9;
            }
            
            .auth-tabs {
                display: flex;
                background: #f8fafc;
                border-bottom: 1px solid #e2e8f0;
            }
            
            .auth-tab {
                flex: 1;
                padding: 1rem 1.5rem;
                background: none;
                border: none;
                cursor: pointer;
                font-weight: 600;
                color: #64748b;
                transition: all 0.3s;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
            }
            
            .auth-tab.active {
                color: #4f46e5;
                background: white;
                border-bottom: 3px solid #4f46e5;
            }
            
            .auth-tab:hover:not(.active) {
                color: #374151;
                background: #f1f5f9;
            }
            
            .auth-form {
                padding: 2rem;
                display: none;
            }
            
            .auth-form.active {
                display: block;
            }
            
            .form-group {
                margin-bottom: 1.5rem;
                position: relative;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 0.5rem;
                font-weight: 600;
                color: #374151;
            }
            
            .form-group input {
                width: 100%;
                padding: 0.75rem 1rem 0.75rem 3rem;
                border: 2px solid #e2e8f0;
                border-radius: 0.5rem;
                font-size: 1rem;
                transition: all 0.3s;
                background: white;
            }
            
            .form-group input:focus {
                outline: none;
                border-color: #4f46e5;
                box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
            }
            
            .input-icon {
                position: absolute;
                left: 1rem;
                top: 2.6rem;
                color: #64748b;
            }
            
            .toggle-password {
                position: absolute;
                right: 1rem;
                top: 2.6rem;
                background: none;
                border: none;
                color: #64748b;
                cursor: pointer;
            }
            
            .password-strength {
                margin-top: 0.5rem;
                display: none;
            }
            
            .strength-bar {
                height: 4px;
                background: #e2e8f0;
                border-radius: 2px;
                overflow: hidden;
                margin-bottom: 0.25rem;
            }
            
            .strength-bar::before {
                content: '';
                display: block;
                height: 100%;
                width: 0%;
                background: #ef4444;
                transition: all 0.3s;
            }
            
            .strength-text {
                font-size: 0.875rem;
                color: #64748b;
            }
            
            .form-options {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
                flex-wrap: wrap;
                gap: 0.5rem;
            }
            
            .checkbox {
                display: flex;
                align-items: center;
                cursor: pointer;
                font-size: 0.875rem;
                color: #64748b;
            }
            
            .checkbox input {
                display: none;
            }
            
            .checkmark {
                width: 1.25rem;
                height: 1.25rem;
                border: 2px solid #d1d5db;
                border-radius: 0.375rem;
                margin-right: 0.5rem;
                position: relative;
                transition: all 0.3s;
            }
            
            .checkbox input:checked + .checkmark {
                background: #4f46e5;
                border-color: #4f46e5;
            }
            
            .checkbox input:checked + .checkmark::after {
                content: '✓';
                position: absolute;
                color: white;
                font-size: 0.75rem;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
            
            .forgot-password {
                font-size: 0.875rem;
                color: #4f46e5;
                text-decoration: none;
            }
            
            .forgot-password:hover {
                text-decoration: underline;
            }
            
            .btn-full {
                width: 100%;
                justify-content: center;
                margin-bottom: 1rem;
            }
            
            .btn-primary {
                background: #4f46e5;
                color: white;
                border: none;
                padding: 0.875rem 1.5rem;
                font-size: 1rem;
            }
            
            .btn-primary:hover {
                background: #4338ca;
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
            }
            
            .btn-google {
                background: white;
                color: #374151;
                border: 2px solid #e2e8f0;
            }
            
            .btn-google:hover {
                background: #f8fafc;
                border-color: #d1d5db;
            }
            
            .btn-text {
                background: none;
                color: #64748b;
                border: none;
            }
            
            .btn-text:hover {
                color: #374151;
                background: #f8fafc;
            }
            
            .auth-divider {
                text-align: center;
                margin: 1.5rem 0;
                position: relative;
            }
            
            .auth-divider::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 0;
                right: 0;
                height: 1px;
                background: #e2e8f0;
            }
            
            .auth-divider span {
                background: white;
                padding: 0 1rem;
                color: #64748b;
                font-size: 0.875rem;
            }
            
            .forgot-instructions {
                color: #64748b;
                font-size: 0.875rem;
                margin-bottom: 1.5rem;
                text-align: center;
            }
            
            /* Password strength indicators */
            .password-weak .strength-bar::before { width: 33%; background: #ef4444; }
            .password-medium .strength-bar::before { width: 66%; background: #f59e0b; }
            .password-strong .strength-bar::before { width: 100%; background: #10b981; }
            
            .password-weak .strength-text { color: #ef4444; }
            .password-medium .strength-text { color: #f59e0b; }
            .password-strong .strength-text { color: #10b981; }
            
            @media (max-width: 480px) {
                .modal-content {
                    margin: 1rem;
                    max-width: none;
                }
                
                .modal-header {
                    padding: 1.5rem 1rem 1rem;
                }
                
                .auth-form {
                    padding: 1.5rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        // Modal controls
        document.addEventListener('click', (e) => {
            if (e.target.matches('#auth-modal-close') || 
                e.target.matches('#auth-modal-overlay') ||
                e.target.closest('#auth-modal-close')) {
                this.hideModal();
            }
            
            // Tab switching
            if (e.target.matches('.auth-tab') || e.target.closest('.auth-tab')) {
                const tab = e.target.closest('.auth-tab');
                this.switchTab(tab.dataset.tab);
            }
            
            // Forgot password
            if (e.target.matches('.forgot-password') || e.target.closest('.forgot-password')) {
                e.preventDefault();
                this.showForgotPassword();
            }
            
            // Back to login
            if (e.target.matches('#back-to-login') || e.target.closest('#back-to-login')) {
                this.switchTab('login');
            }
            
            // Toggle password visibility
            if (e.target.matches('.toggle-password') || e.target.closest('.toggle-password')) {
                const button = e.target.closest('.toggle-password');
                this.togglePasswordVisibility(button.dataset.target);
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

        document.getElementById('forgot-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleForgotPassword();
        });

        // Real-time password strength
        document.getElementById('signup-password').addEventListener('input', (e) => {
            this.checkPasswordStrength(e.target.value);
        });

        // Google auth
        document.getElementById('google-login').addEventListener('click', () => {
            this.handleGoogleAuth();
        });
    }

    initFirebaseAuth() {
        // Initialize Firebase Auth (mock for now - will integrate real Firebase later)
        console.log('🔐 Firebase Auth initialized (mock)');
        
        // Check if user is already logged in (from localStorage)
        const savedUser = localStorage.getItem('graphz_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.app.emit('userLoggedIn', this.currentUser);
        }
    }

    showModal() {
        if (this.modal) {
            this.modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scroll
            this.switchTab('login');
        }
    }

    hideModal() {
        if (this.modal) {
            this.modal.style.display = 'none';
            document.body.style.overflow = ''; // Restore scroll
            this.resetForms();
        }
    }

    switchTab(tabName) {
        // Update active tab
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });
        
        // Show correct form
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.toggle('active', form.dataset.type === tabName);
        });
        
        // Reset forms when switching
        this.resetForms();
    }

    showForgotPassword() {
        this.switchTab('forgot');
    }

    togglePasswordVisibility(targetId) {
        const input = document.getElementById(targetId);
        const button = document.querySelector(`[data-target="${targetId}"]`);
        const icon = button.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }

    checkPasswordStrength(password) {
        const strengthBar = document.querySelector('.strength-bar');
        const strengthText = document.querySelector('.strength-text');
        const passwordGroup = document.getElementById('signup-password').closest('.form-group');
        
        if (password.length === 0) {
            passwordGroup.classList.remove('password-weak', 'password-medium', 'password-strong');
            return;
        }
        
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        
        passwordGroup.classList.remove('password-weak', 'password-medium', 'password-strong');
        
        if (strength <= 1) {
            passwordGroup.classList.add('password-weak');
            strengthText.textContent = 'Weak';
        } else if (strength <= 2) {
            passwordGroup.classList.add('password-medium');
            strengthText.textContent = 'Medium';
        } else {
            passwordGroup.classList.add('password-strong');
            strengthText.textContent = 'Strong';
        }
    }

    async handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const rememberMe = document.getElementById('remember-me').checked;
        
        // Show loading state
        const submitBtn = document.querySelector('#login-form .btn-primary');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
        submitBtn.disabled = true;
        
        try {
            // Mock authentication - replace with real Firebase
            await this.mockAuthenticate(email, password, 'login');
            
            // Success
            this.hideModal();
            this.showSuccess('Successfully logged in!');
            
        } catch (error) {
            this.showError(error.message);
        } finally {
            // Restore button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleSignup() {
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirm = document.getElementById('signup-confirm').value;
        const acceptTerms = document.getElementById('accept-terms').checked;
        
        // Validation
        if (password !== confirm) {
            this.showError('Passwords do not match');
            return;
        }
        
        if (!acceptTerms) {
            this.showError('Please accept the terms and conditions');
            return;
        }
        
        // Show loading state
        const submitBtn = document.querySelector('#signup-form .btn-primary');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
        submitBtn.disabled = true;
        
        try {
            // Mock authentication - replace with real Firebase
            await this.mockAuthenticate(email, password, 'signup', name);
            
            // Success
            this.hideModal();
            this.showSuccess('Account created successfully! Welcome to Graphz!');
            
        } catch (error) {
            this.showError(error.message);
        } finally {
            // Restore button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleForgotPassword() {
        const email = document.getElementById('forgot-email').value;
        
        // Show loading state
        const submitBtn = document.querySelector('#forgot-form .btn-primary');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            // Mock password reset - replace with real Firebase
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Success
            this.showSuccess(`Password reset link sent to ${email}`);
            this.switchTab('login');
            
        } catch (error) {
            this.showError('Failed to send reset link. Please try again.');
        } finally {
            // Restore button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleGoogleAuth() {
        try {
            // Mock Google auth - replace with real Firebase Google Auth
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const user = {
                id: 'google_' + Date.now(),
                email: 'user@gmail.com',
                displayName: 'Google User',
                photoURL: null,
                isGoogle: true
            };
            
            this.currentUser = user;
            localStorage.setItem('graphz_user', JSON.stringify(user));
            
            this.app.emit('userLoggedIn', user);
            this.hideModal();
            this.showSuccess('Successfully signed in with Google!');
            
        } catch (error) {
            this.showError('Google authentication failed');
        }
    }

    async mockAuthenticate(email, password, type, name = null) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock validation
        if (!email || !password) {
            throw new Error('Please fill in all fields');
        }
        
        if (type === 'signup' && password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }
        
        // Mock successful authentication
        const user = {
            id: type === 'signup' ? 'new_' + Date.now() : 'user_' + Date.now(),
            email: email,
            displayName: name || email.split('@')[0],
            photoURL: null,
            createdAt: new Date().toISOString()
        };
        
        this.currentUser = user;
        localStorage.setItem('graphz_user', JSON.stringify(user));
        
        // Notify other features
        this.app.emit('userLoggedIn', user);
        
        return user;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('graphz_user');
        this.app.emit('userLoggedOut');
        this.showSuccess('Successfully logged out');
    }

    resetForms() {
        // Reset all form fields
        document.querySelectorAll('.auth-form').forEach(form => {
            form.reset();
        });
        
        // Reset password strength
        const passwordGroup = document.getElementById('signup-password')?.closest('.form-group');
        if (passwordGroup) {
            passwordGroup.classList.remove('password-weak', 'password-medium', 'password-strong');
        }
        
        // Clear any error messages
        this.clearErrors();
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type) {
        // Remove existing notifications
        this.clearNotifications();
        
        const notification = document.createElement('div');
        notification.className = `auth-notification auth-notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add styles for notification
        if (!document.querySelector('.auth-notification-style')) {
            const style = document.createElement('style');
            style.className = 'auth-notification-style';
            style.textContent = `
                .auth-notification {
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
                    z-index: 3000;
                    animation: slideInRight 0.3s ease-out;
                    max-width: 400px;
                }
                
                .auth-notification-success {
                    border-left: 4px solid #10b981;
                }
                
                .auth-notification-error {
                    border-left: 4px solid #ef4444;
                }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    flex: 1;
                }
                
                .auth-notification-success i {
                    color: #10b981;
                }
                
                .auth-notification-error i {
                    color: #ef4444;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: #64748b;
                    cursor: pointer;
                    padding: 0.25rem;
                }
                
                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }

    clearNotifications() {
        document.querySelectorAll('.auth-notification').forEach(notification => {
            notification.remove();
        });
    }

    clearErrors() {
        // Clear any form errors
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('has-error');
        });
    }

    onEvent(event, data) {
        switch (event) {
            case 'showAuthModal':
                this.showModal();
                break;
                
            case 'userLogout':
                this.logout();
                break;
                
            case 'routeChange':
                // Close auth modal on route change
                if (this.modal && this.modal.style.display === 'block') {
                    this.hideModal();
                }
                break;
        }
    }

    // Public method to check auth status
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Public method to get current user
    getCurrentUser() {
        return this.currentUser;
    }
    }
