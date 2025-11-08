export default class HomeFeature {
    constructor(app) {
        this.app = app;
        this.name = 'home';
    }

    async init() {
        const html = await this.loadHTML();
        document.getElementById('app').innerHTML += html;
        this.loadCSS();
        console.log('✅ Home loaded');
    }

    async loadHTML() {
        return `
            <main style="padding: 2rem; text-align: center;">
                <h1 style="font-size: 3rem; margin-bottom: 1rem;">Welcome to Graphz</h1>
                <p style="font-size: 1.2rem; color: #666; margin-bottom: 2rem;">
                    Discover amazing educational graphs and visualizations
                </p>
                <button style="padding: 1rem 2rem; background: #4f46e5; color: white; border: none; border-radius: 0.5rem; font-size: 1.1rem;">
                    Explore Graphs
                </button>
                
                <div style="margin-top: 3rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                    <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <h3>📈 Physics</h3>
                        <p>Wave patterns, motion graphs, and more</p>
                    </div>
                    <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <h3>🧪 Chemistry</h3>
                        <p>Reaction rates, periodic trends</p>
                    </div>
                    <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <h3>🧬 Biology</h3>
                        <p>Population growth, DNA structures</p>
                    </div>
                </div>
            </main>
        `;
    }

    loadCSS() {
        const style = document.createElement('style');
        style.textContent = `
            main { min-height: 80vh; padding-top: 2rem; }
            button { cursor: pointer; transition: transform 0.2s; }
            button:hover { transform: translateY(-2px); }
        `;
        document.head.appendChild(style);
    }
}
