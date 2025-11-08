// Router Core Module
export default class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
    }

    init(app) {
        this.app = app;
        
        // Listen for URL changes
        window.addEventListener('popstate', () => this.handleRouteChange());
        
        // Initial route
        this.handleRouteChange();
        
        console.log('✅ Router initialized');
    }

    registerRoute(path, handler) {
        this.routes.set(path, handler);
        console.log(`✅ Route registered: ${path}`);
    }

    handleRouteChange() {
        const path = window.location.pathname + window.location.search;
        this.navigate(path, false);
    }

    async navigate(path, pushState = true) {
        if (pushState) {
            window.history.pushState(null, '', path);
        }

        this.currentRoute = path;
        
        // Find matching route
        for (const [route, handler] of this.routes) {
            if (this.matchRoute(route, path)) {
                await handler(path);
                return;
            }
        }

        // Default route
        await this.showHome();
    }

    matchRoute(route, path) {
        if (route === '*') return true;
        if (route === path) return true;
        
        // Simple pattern matching (extend as needed)
        const routeParts = route.split('/');
        const pathParts = path.split('/');
        
        if (routeParts.length !== pathParts.length) return false;
        
        for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith(':')) continue;
            if (routeParts[i] !== pathParts[i]) return false;
        }
        
        return true;
    }

    async showHome() {
        this.app.showLoading();
        
        // Features will auto-inject their content
        this.app.notifyFeatures('routeChange', { route: '/', params: {} });
    }

    async showGraph(graphId) {
        this.app.notifyFeatures('routeChange', { 
            route: '/graph', 
            params: { graphId } 
        });
    }

    async showAdmin() {
        this.app.notifyFeatures('routeChange', { 
            route: '/admin', 
            params: {} 
        });
    }
}
