// UI Module - Provides component rendering system
export class UIModule {
    static async init(eventBus) {
        this.eventBus = eventBus;
        this.components = new Map();
        
        console.log('🎨 UI Module initialized');
        
        // Register core UI events
        eventBus.on('navigate', (page) => this.renderPage(page));
        eventBus.on('user-changed', (user) => this.updateUI(user));
        
        return this;
    }

    static async renderComponent(componentName, data = {}) {
        try {
            const html = await fetch(`components/${componentName}.html`).then(r => r.text());
            let processedHTML = html;
            
            // Data binding: {{variable}}
            processedHTML = processedHTML.replace(/\{\{(\w+)\}\}/g, (match, key) => {
                return data[key] || '';
            });
            
            // Feature conditionals: {{#if feature}}content{{/if}}
            processedHTML = processedHTML.replace(/\{\{#if (\w+)\}\}(.*?)\{\{\/if\}\}/gs, 
                (match, feature, content) => {
                    return window.app.features[feature]?.enabled ? content : '';
                });
            
            return processedHTML;
            
        } catch (error) {
            console.error(`❌ Failed to render ${componentName}:`, error);
            return `<div class="error">Failed to load ${componentName}</div>`;
        }
    }

    static async mount(selector, componentName, data = {}) {
        const element = document.querySelector(selector);
        if (element) {
            element.innerHTML = await this.renderComponent(componentName, data);
            this.initializeEventListeners(element);
        }
    }

    static initializeEventListeners(container) {
        // Auto-initialize components with data attributes
        container.querySelectorAll('[data-component]').forEach(element => {
            const componentName = element.getAttribute('data-component');
            this.initializeComponent(componentName, element);
        });
    }

    static async initializeComponent(name, element) {
        // Component-specific initialization logic
        switch (name) {
            case 'navigation':
                await this.initializeNavigation(element);
                break;
            case 'search':
                await this.initializeSearch(element);
                break;
            // Add more components as needed
        }
    }

    static async initializeNavigation(element) {
        // Navigation initialization logic
        element.addEventListener('click', (e) => {
            if (e.target.matches('[data-page]')) {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                this.eventBus.emit('navigate', page);
            }
        });
    }
}

// Module exports
export async function init(eventBus) {
    return await UIModule.init(eventBus);
}
