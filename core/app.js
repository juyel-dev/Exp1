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
        
        // Initialize features
        await this.initializeFeatures();
        
        // Initialize router
        await this.initRouter();
        
        // Check auth state
        await this.initAuth();
        
        console.log('✅ Graphz Core Ready!');
    }

    async loadCoreModules() {
        try {
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
            const featureManifest = [
                { name: 'header', path: './features/header/header.js' },
                { name: 'auth', path: './features/auth/auth.js' },
                { name: 'search', path: './features/search/search.js' },
                { name: 'graph-grid', path: './features/graph-grid/graph-grid.js' }
            ];

            for (const feature of featureManifest) {
                try {
                    const module = await import(feature.path);
                    this.features.set(feature.name, module.default);
                    console.log(`🧩 Feature discovered: ${feature.name}`);
                } catch (error) {
                    console.warn(`⚠️ Feature ${feature.name} not found:`, error);
                }
            }
        } catch (error) {
            console.error('❌ Feature discovery failed:', error);
        }
    }

    // ✅ Updated feature initialization
    async initializeFeatures() {
        for (const [name, FeatureClass] of this.features) {
            try {
                const featureInstance = new FeatureClass(this);
                this.features.set(name, featureInstance);
                
                if (featureInstance.init) {
                    await featureInstance.init();
                }
                console.log(`✅ Initialized: ${name}`);
            } catch (error) {
                console.error(`❌ Failed to initialize ${name}:`, error);
            }
        }
    }

    // ✅ Updated event emitter
    emit(event, data) {
        console.log(`📢 Emitting event: ${event}`, data);
        
        this.features.forEach((featureInstance, name) => {
            if (featureInstance.onEvent) {
                try {
                    featureInstance.onEvent(event, data);
                } catch (error) {
                    console.error(`Error in feature ${name} for event ${event}:`, error);
                }
            }
        });
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
                this.emit('authStateChanged', user);
            });
        }
    }

    // Utility methods
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
