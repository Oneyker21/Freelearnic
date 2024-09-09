import { initializeApp } from "firebase/app";
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
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Auth
let auth;
try {
  auth = getAuth(app);
} catch (error) {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
}

export { auth };