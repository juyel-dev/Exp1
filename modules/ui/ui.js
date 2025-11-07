export class UIModule {
    static async init(eventBus) {
        console.log('🎨 UI Module initializing...');
        this.eventBus = eventBus;
        
        // Basic page rendering
        eventBus.on('navigate', (page) => this.renderPage(page));
        
        console.log('✅ UI Module ready');
        return this;
    }

    static async renderPage(page) {
        const main = document.getElementById('main-content');
        
        switch(page) {
            case 'home':
                main.innerHTML = await this.renderHomePage();
                break;
            case 'graphs':
                main.innerHTML = await this.renderGraphsPage();
                break;
            default:
                main.innerHTML = await this.renderHomePage();
        }
    }

    static async renderHomePage() {
        return `
            <section class="hero">
                <div class="container">
                    <h1 class="text-4xl font-bold mb-4">Welcome to GraphzLive</h1>
                    <p class="text-xl mb-6">The world's best educational graph platform</p>
                    <button class="btn btn-secondary" onclick="app.eventBus.emit('navigate', 'graphs')">
                        <i class="fas fa-rocket"></i> Explore Graphs
                    </button>
                </div>
            </section>
        `;
    }

    static async renderGraphsPage() {
        return `
            <section class="container p-6">
                <h1 class="text-3xl font-bold mb-6">Graphs Gallery</h1>
                <div class="graph-grid">
                    ${this.renderGraphCards()}
                </div>
            </section>
        `;
    }

    static renderGraphCards() {
        const sampleGraphs = [
            { name: "Wave Physics", subject: "Physics", views: 1247 },
            { name: "Chemical Bonds", subject: "Chemistry", views: 856 },
            { name: "DNA Structure", subject: "Biology", views: 1542 }
        ];

        return sampleGraphs.map(graph => `
            <div class="graph-card">
                <div class="graph-image">
                    <i class="fas fa-chart-line fa-3x"></i>
                </div>
                <div class="graph-content">
                    <h3 class="font-semibold mb-2">${graph.name}</h3>
                    <p class="text-sm text-gray mb-4">${graph.subject} visualization</p>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray">${graph.views} views</span>
                        <button class="btn btn-sm">View</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

export async function init(eventBus) {
    return await UIModule.init(eventBus);
}
