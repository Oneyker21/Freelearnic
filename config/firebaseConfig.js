import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Tu configuración de Firebase aquí
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
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Auth
let auth;
if (getApps().length === 1) {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} else {
  auth = getAuth(app);
}

export { auth };
