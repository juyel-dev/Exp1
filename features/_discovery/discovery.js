// Advanced: Real filesystem scanning (for production)
export class FeatureDiscovery {
    static async discover() {
        if (typeof window !== 'undefined') {
            return this.browserDiscovery();
        }
        return this.serverDiscovery();
    }

    static async browserDiscovery() {
        // For static hosting, we maintain a manifest
        try {
            const response = await fetch('/features/manifest.json');
            const manifest = await response.json();
            return manifest.features;
        } catch {
            // Fallback: Try to discover dynamically
            return this.dynamicDiscovery();
        }
    }

    static async dynamicDiscovery() {
        const features = [];
        const testFeatures = ['header', 'home', 'auth', 'search', 'graph-grid', 'profile', 'admin'];
        
        for (const feature of testFeatures) {
            try {
                await import(`../${feature}/${feature}.js`);
                features.push(feature);
            } catch (error) {
                // Feature doesn't exist
            }
        }
        
        return features;
    }
}
