export default class AuthFeature {
    constructor(app) {
        this.app = app;
        this.name = 'auth';
    }

    async init() {
        console.log('✅ Auth system ready');
        // Auth will be loaded but only show when needed
    }

    showLogin() {
        const modal = document.createElement('div');
        modal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
                <div style="background: white; padding: 2rem; border-radius: 1rem; width: 400px;">
                    <h2>Login to Graphz</h2>
                    <input type="email" placeholder="Email" style="width: 100%; padding: 0.5rem; margin: 0.5rem 0; border: 1px solid #ddd; border-radius: 0.5rem;">
                    <input type="password" placeholder="Password" style="width: 100%; padding: 0.5rem; margin: 0.5rem 0; border: 1px solid #ddd; border-radius: 0.5rem;">
                    <button style="width: 100%; padding: 0.75rem; background: #4f46e5; color: white; border: none; border-radius: 0.5rem; margin-top: 1rem;">Login</button>
                    <button onclick="this.parentElement.parentElement.remove()" style="width: 100%; padding: 0.75rem; background: #666; color: white; border: none; border-radius: 0.5rem; margin-top: 0.5rem;">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
}
