// === CORE ORCHESTRATOR - NEVER MODIFY ===
class GraphzLiveCore {
    constructor() {
        this.features = {};
        this.modules = new Map();
        this.eventBus = new EventBus();
    }

    async initialize() {
        try {
            console.log('🚀 Initializing GraphzLive Core...');
            
            // Load feature registry
            await this.loadFeatureRegistry();
            
            // Initialize Firebase
            await this.initializeFirebase();
            
            // Load and initialize enabled features
            await this.loadEnabledFeatures();
            
            // Render app shell
            await this.renderAppShell();
            
            console.log('✅ GraphzLive Core initialized successfully!');
            
        } catch (error) {
            console.error('❌ Core initialization failed:', error);
        }
    }

    async loadFeatureRegistry() {
        const response = await fetch('features.json');
        this.features = await response.json();
        console.log('📋 Feature registry loaded:', Object.keys(this.features));
    }

    async initializeFirebase() {
        const firebaseConfig = await fetch('config/firebase.json').then(r => r.json());
        firebase.initializeApp(firebaseConfig);
        console.log('🔥 Firebase initialized');
    }

    async loadEnabledFeatures() {
        const enabledFeatures = Object.entries(this.features)
            .filter(([name, config]) => config.enabled)
            .map(([name]) => name);

        console.log('🔧 Loading enabled features:', enabledFeatures);

        for (const featureName of enabledFeatures) {
            await this.loadFeatureModule(featureName);
        }
    }

    async loadFeatureModule(featureName) {
        const featureConfig = this.features[featureName];
        
        try {
            // Load CSS
            if (featureConfig.css) {
                await this.injectCSS(featureConfig.css);
            }

            // Load JS module
            if (featureConfig.module) {
                const module = await import(featureConfig.module);
                this.modules.set(featureName, module);
                
                // Initialize module if it has init function
                if (typeof module.init === 'function') {
                    await module.init(this.eventBus);
                    console.log(`✅ ${featureName} module initialized`);
                }
            }
            
        } catch (error) {
            console.error(`❌ Failed to load ${featureName}:`, error);
        }
    }

    async injectCSS(cssPath) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = cssPath;
            link.onload = resolve;
            link.onerror = reject;
            document.getElementById('feature-styles').appendChild(link);
        });
    }

    async renderAppShell() {
        const appShellHTML = await fetch('components/app-shell.html').then(r => r.text());
        document.getElementById('app').innerHTML = appShellHTML;
        console.log('🎨 App shell rendered');
    }
}

// Initialize core when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new GraphzLiveCore();
    window.app.initialize();
});
