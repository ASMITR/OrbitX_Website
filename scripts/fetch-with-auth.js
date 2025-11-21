const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, connectAuthEmulator } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

const firebaseConfig = {
  apiKey: "AIzaSyAZwGvejoCn2df7CX_JudFKQwqVQrlDgjk",
  authDomain: "orbitx-website-f3acc.firebaseapp.com",
  projectId: "orbitx-website-f3acc",
  storageBucket: "orbitx-website-f3acc.firebasestorage.app",
  messagingSenderId: "260733151823",
  appId: "1:260733151823:web:33264bc7e2c21e689d583a",
  measurementId: "G-EPVZ6SXDLY"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const collections = ['events', 'projects', 'members', 'messages', 'blogs', 'merchandise', 'orders', 'settings', 'adminProfiles'];

async function fetchAllData() {
  try {
    // Sign in as admin (replace with actual admin credentials)
    await signInWithEmailAndPassword(auth, 'admin@orbitx.com', 'your-admin-password');
    console.log('Authenticated successfully');
    
    const allData = {};
    
    for (const collectionName of collections) {
      try {
        const snapshot = await getDocs(collection(db, collectionName));
        allData[collectionName] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log(`✓ ${collectionName}: ${allData[collectionName].length} documents`);
      } catch (error) {
        console.log(`✗ ${collectionName}: ${error.message}`);
        allData[collectionName] = [];
      }
    }
    
    console.log('\n=== COMPLETE DATA ===');
    console.log(JSON.stringify(allData, null, 2));
    
  } catch (error) {
    console.error('Authentication failed:', error.message);
  }
}

fetchAllData();