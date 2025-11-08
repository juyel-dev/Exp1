export default class HeaderFeature {
    constructor(app) {
        this.app = app;
        this.name = 'header';
    }

    async init() {
        // Load HTML
        const html = await this.loadHTML();
        document.getElementById('app').insertAdjacentHTML('afterbegin', html);
        
        // Load CSS
        this.loadCSS();
        
        // Setup events
        this.setupEvents();
        
        console.log('✅ Header loaded');
    }

    async loadHTML() {
        return `
            <header style="
                background: white; padding: 1rem; 
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                display: flex; justify-content: space-between;
                align-items: center;
            ">
                <div class="logo" style="font-size: 1.5rem; font-weight: bold; color: #4f46e5;">
                    📊 Graphz
                </div>
                <nav>
                    <a href="#home" style="margin: 0 1rem; text-decoration: none; color: #333;">Home</a>
                    <a href="#graphs" style="margin: 0 1rem; text-decoration: none; color: #333;">Graphs</a>
                    <button onclick="alert('Login clicked')" style="padding: 0.5rem 1rem; background: #4f46e5; color: white; border: none; border-radius: 0.5rem;">Login</button>
                </nav>
            </header>
        `;
    }

    loadCSS() {
        const style = document.createElement('style');
        style.textContent = `
            header { position: sticky; top: 0; z-index: 100; }
            .logo { display: flex; align-items: center; gap: 0.5rem; }
        `;
        document.head.appendChild(style);
    }

    setupEvents() {
        // Header specific events
    }

    onEvent(event, data) {
        console.log(`Header received: ${event}`, data);
    }
}
