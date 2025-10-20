// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBuv-Tb24wZPKg-9y7TCHH46SJJuesGKrg",
  authDomain: "entrevestor-77473.firebaseapp.com",
  databaseURL: "https://entrevestor-77473-default-rtdb.firebaseio.com",
  projectId: "entrevestor-77473",
  storageBucket: "entrevestor-77473.appspot.com",
  messagingSenderId: "231545180576",
  appId: "1:231545180576:web:aa37852672152d942d94c5",
  measurementId: "G-NJZ4ED1RMH"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

console.log('🔥 Firebase initialized successfully!');