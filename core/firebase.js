// Firebase Core Module
export default class FirebaseCore {
    constructor() {
        this.app = null;
        this.db = null;
        this.auth = null;
        this.storage = null;
        
        this.init();
    }

    init() {
        const firebaseConfig = {
            apiKey: "AIzaSyA84Ty4SNDuLMKzeHX1pJMUgjoFZ89nbRE",
            authDomain: "graphzlive.firebaseapp.com",
            projectId: "graphzlive",
            storageBucket: "graphzlive.firebasestorage.app",
            messagingSenderId: "521947472086",
            appId: "1:521947472086:web:b7795552c40bb58b0b2977"
        };

        try {
            this.app = firebase.initializeApp(firebaseConfig);
            this.db = firebase.firestore();
            this.auth = firebase.auth();
            this.storage = firebase.storage();
            
            console.log('✅ Firebase initialized');
        } catch (error) {
            console.error('❌ Firebase initialization failed:', error);
        }
    }

    // Utility methods for features
    async getGraphs() {
        try {
            const snapshot = await this.db.collection('graphs').get();
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Error getting graphs:', error);
            return [];
        }
    }

    async addGraph(graphData) {
        try {
            const docRef = await this.db.collection('graphs').add({
                ...graphData,
                createdAt: new Date(),
                views: 0,
                rating: 0,
                ratingCount: 0
            });
            return docRef.id;
        } catch (error) {
            console.error('Error adding graph:', error);
            throw error;
        }
    }
}
