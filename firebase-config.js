// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Function to load environment variables
async function loadEnvVariables() {
  try {
    const response = await fetch('.env');
    const text = await response.text();
    const envVars = {};
    
    text.split('\n').forEach(line => {
      // Skip comments and empty lines
      if (line.trim() && !line.startsWith('#')) {
        const [key, value] = line.split('=');
        if (key && value) {
          envVars[key.trim()] = value.trim();
        }
      }
    });
    
    return envVars;
  } catch (error) {
    console.error('Error loading .env file:', error);
    return {};
  }
}

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
let firebaseConfig = {
  // Default values as fallback
  apiKey: "AIzaSyCKCRUXuXTrrwCIpZk5xBjAd7OHqMez92o",
  authDomain: "amik-qr-code.firebaseapp.com",
  projectId: "amik-qr-code",
  storageBucket: "amik-qr-code.firebasestorage.app",
  messagingSenderId: "876567502941",
  appId: "1:876567502941:web:a15e528f68c6304f06edb4",
  measurementId: "G-0P0VVLM834"
};

// Initialize Firebase with environment variables
async function initializeFirebase() {
  try {
    const env = await loadEnvVariables();
    
    // Update config with environment variables if available
    if (env.FIREBASE_API_KEY) firebaseConfig.apiKey = env.FIREBASE_API_KEY;
    if (env.FIREBASE_AUTH_DOMAIN) firebaseConfig.authDomain = env.FIREBASE_AUTH_DOMAIN;
    if (env.FIREBASE_PROJECT_ID) firebaseConfig.projectId = env.FIREBASE_PROJECT_ID;
    if (env.FIREBASE_STORAGE_BUCKET) firebaseConfig.storageBucket = env.FIREBASE_STORAGE_BUCKET;
    if (env.FIREBASE_MESSAGING_SENDER_ID) firebaseConfig.messagingSenderId = env.FIREBASE_MESSAGING_SENDER_ID;
    if (env.FIREBASE_APP_ID) firebaseConfig.appId = env.FIREBASE_APP_ID;
    if (env.FIREBASE_MEASUREMENT_ID) firebaseConfig.measurementId = env.FIREBASE_MEASUREMENT_ID;
    
    console.log('Firebase config loaded from environment variables');
  } catch (error) {
    console.warn('Using default Firebase configuration:', error);
  }
  
  try {
    // Initialize Firebase
    console.log('Initializing Firebase with config:', JSON.stringify(firebaseConfig));
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const db = getFirestore(app);
    
    console.log('Firebase initialized successfully');
    return { app, analytics, db };
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    throw error; // Re-throw to handle in the calling function
  }
}

// Export Firebase services for use in other files
async function exportFirebaseServices() {
  try {
    const { app, analytics, db } = await initializeFirebase();
    
    // Make Firebase services available globally
    window.firebaseApp = app;
    window.firebaseAnalytics = analytics;
    window.firebaseDB = db;
    window.firebaseServices = {
      collection,
      addDoc,
      getDocs,
      deleteDoc,
      doc,
      updateDoc
    };

    // Log success message
    console.log('✅ Firebase initialized successfully!');
    console.log('📊 Analytics:', analytics);
    console.log('🗄️ Firestore:', db);
    
    // Dispatch an event to notify the app that Firebase is ready
    const event = new CustomEvent('firebase-ready', { detail: { success: true } });
    document.dispatchEvent(event);
    
    return { app, analytics, db };
  } catch (error) {
    console.error('Failed to initialize Firebase services:', error);
    
    // Set a flag to indicate Firebase initialization failed
    window.firebaseInitFailed = true;
    
    // Dispatch an event to notify the app that Firebase failed
    const event = new CustomEvent('firebase-ready', { detail: { success: false, error } });
    document.dispatchEvent(event);
    
    // Return null values to indicate failure
    return { app: null, analytics: null, db: null };
  }
}

// Initialize Firebase when the script loads
try {
  exportFirebaseServices().catch(error => {
    console.error('Failed to initialize Firebase:', error);
  });
} catch (error) {
  console.error('Critical error during Firebase initialization:', error);
  // Set a flag to indicate Firebase initialization failed
  window.firebaseInitFailed = true;
}