import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2lBEopK9_fmDuCRq_sh3gKAq-SiZ3zT4",
  authDomain: "freelearnic.firebaseapp.com",
  projectId: "freelearnic",
  storageBucket: "freelearnic.appspot.com",
  messagingSenderId: "337517983563",
  appId: "1:337517983563:web:303bbb92b47f56f3ed9ace",
  measurementId: "G-FBNJ92Y7MN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { app, auth };
