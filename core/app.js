// Graphz Core - Zero-Touch Module System
class GraphzApp {
    constructor() {
        this.modules = new Map();
        this.features = new Map();
        this.currentRoute = '/';
        this.user = null;
        
        this.init();
    }

    async init() {
        console.log('🚀 Graphz Core Initializing...');
        
        // Initialize core modules
        await this.loadCoreModules();
        
        // Auto-discover and load features
        await this.discoverFeatures();
        
        // Initialize router
        await this.initRouter();
        
        // Check auth state
        await this.initAuth();
        
        console.log('✅ Graphz Core Ready!');
    }

    async loadCoreModules() {
        try {
            // Dynamic imports for core modules
            const modules = {
                firebase: await import('./firebase.js'),
                router: await import('./router.js')
            };
            
            for (const [name, module] of Object.entries(modules)) {
                this.modules.set(name, module.default);
                console.log(`✅ Core module loaded: ${name}`);
            }
        } catch (error) {
            console.error('❌ Core module loading failed:', error);
        }
    }

    async discoverFeatures() {
        try {
            // Feature manifest - in production, this would be auto-generated
            const featureManifest = [
                { name: 'header', path: './features/header/header.js' },
                { name: 'auth', path: './features/auth/auth.js' },
                { name: 'search', path: './features/search/search.js' },
                { name: 'graph-grid', path: './features/graph-grid/graph-grid.js' }
            ];

            for (const feature of featureManifest) {
                try {
                    const module = await import(feature.path);
                    this.registerFeature(feature.name, module.default);
                } catch (error) {
                    console.warn(`⚠️ Feature ${feature.name} not found:`, error);
                }
            }
        } catch (error) {
            console.error('❌ Feature discovery failed:', error);
        }
    }

    registerFeature(name, featureClass) {
        if (this.features.has(name)) {
            console.warn(`Feature ${name} already registered`);
            return;
        }

        const featureInstance = new featureClass(this);
        this.features.set(name, featureInstance);
        
        console.log(`✅ Feature registered: ${name}`);
        
        // Auto-initialize feature
        if (featureInstance.init) {
            featureInstance.init();
        }
    }

    getFeature(name) {
        return this.features.get(name);
    }

    getModule(name) {
        return this.modules.get(name);
    }

    async initRouter() {
        const router = this.getModule('router');
        if (router) {
            await router.init(this);
        }
    }

    async initAuth() {
        const firebase = this.getModule('firebase');
        if (firebase) {
            firebase.auth.onAuthStateChanged((user) => {
                this.user = user;
                this.notifyFeatures('authStateChanged', user);
            });
        }
    }

    // Event system for feature communication
    notifyFeatures(event, data) {
        this.features.forEach(feature => {
            if (feature.onEvent) {
                feature.onEvent(event, data);
            }
        });
    }

    // Utility methods for features
    showLoading() {
        document.getElementById('app').innerHTML = `
            <div class="loading">
                <div class="loader"></div>
                <p>Loading...</p>
            </div>
        `;
    }

    showError(message) {
        document.getElementById('app').innerHTML = `
            <div class="error">
                <h3>Error</h3>
                <p>${message}</p>
                <button onclick="location.reload()">Reload</button>
            </div>
        `;
    }
}

// Global app instance
window.Graphz = new GraphzApp();
