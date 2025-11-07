// Auth Module - Handles authentication
export class AuthModule {
    static async init(eventBus) {
        this.eventBus = eventBus;
        this.currentUser = null;
        
        console.log('🔐 Auth Module initialized');
        
        // Set up auth state listener
        this.setupAuthListener();
        
        return this;
    }

    static setupAuthListener() {
        firebase.auth().onAuthStateChanged(async (user) => {
            this.currentUser = user;
            
            if (user) {
                await this.handleUserLogin(user);
            } else {
                this.handleUserLogout();
            }
            
            this.eventBus.emit('user-changed', this.currentUser);
        });
    }

    static async handleUserLogin(user) {
        console.log('👤 User logged in:', user.email);
        
        // Create/update user profile in Firestore
        await this.updateUserProfile(user);
        
        // Update UI through event bus
        this.eventBus.emit('auth:login', user);
    }

    static handleUserLogout() {
        console.log('👤 User logged out');
        this.eventBus.emit('auth:logout');
    }

    static async signUp(email, password, userData) {
        try {
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            await userCredential.user.updateProfile({ displayName: userData.displayName });
            
            await firebase.firestore().collection('users').doc(userCredential.user.uid).set({
                ...userData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                role: 'user'
            });
            
            return { success: true, user: userCredential.user };
            
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async signIn(email, password) {
        try {
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
            return { success: true, user: userCredential.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async signInWithGoogle() {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            const userCredential = await firebase.auth().signInWithPopup(provider);
            return { success: true, user: userCredential.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async signOut() {
        await firebase.auth().signOut();
    }

    static async updateUserProfile(user) {
        const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
        
        if (!userDoc.exists) {
            await firebase.firestore().collection('users').doc(user.uid).set({
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                role: 'user'
            });
        }
    }
}

// Module exports
export async function init(eventBus) {
    return await AuthModule.init(eventBus);
}

// Export individual methods for other modules
export const signUp = AuthModule.signUp.bind(AuthModule);
export const signIn = AuthModule.signIn.bind(AuthModule);
export const signInWithGoogle = AuthModule.signInWithGoogle.bind(AuthModule);
export const signOut = AuthModule.signOut.bind(AuthModule);
