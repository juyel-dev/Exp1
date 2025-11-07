// Graphs Module - Handles graph management
export class GraphsModule {
    static async init(eventBus) {
        this.eventBus = eventBus;
        this.graphs = [];
        
        console.log('📊 Graphs Module initialized');
        
        // Listen for navigation events
        eventBus.on('navigate', (page) => {
            if (page === 'home') this.loadGraphs();
            if (page === 'graphs') this.showGraphsPage();
        });
        
        return this;
    }

    static async loadGraphs(filters = {}) {
        try {
            let query = firebase.firestore().collection('graphs');
            
            // Apply filters
            if (filters.subject && filters.subject !== 'all') {
                query = query.where('subject', '==', filters.subject);
            }
            
            if (filters.sortBy) {
                query = query.orderBy(filters.sortBy, filters.sortOrder || 'desc');
            }
            
            const snapshot = await query.get();
            this.graphs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            this.eventBus.emit('graphs:loaded', this.graphs);
            
        } catch (error) {
            console.error('❌ Failed to load graphs:', error);
            this.eventBus.emit('graphs:error', error.message);
        }
    }

    static async createGraph(graphData) {
        try {
            const docRef = await firebase.firestore().collection('graphs').add({
                ...graphData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                views: 0,
                authorId: firebase.auth().currentUser?.uid
            });
            
            this.eventBus.emit('graph:created', { id: docRef.id, ...graphData });
            return { success: true, id: docRef.id };
            
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async showGraphsPage() {
        const UIModule = await import('../ui/ui.js');
        await UIModule.UIModule.mount('#main-content', 'graphs-page');
        await this.loadGraphs();
    }

    static async searchGraphs(query) {
        // Implement search logic
        this.eventBus.emit('graphs:search', query);
    }
}

// Module exports
export async function init(eventBus) {
    return await GraphsModule.init(eventBus);
}

export const loadGraphs = GraphsModule.loadGraphs.bind(GraphsModule);
export const createGraph = GraphsModule.createGraph.bind(GraphsModule);
export const searchGraphs = GraphsModule.searchGraphs.bind(GraphsModule);
