// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAlemnsNkn6OewEqsF5FLwa1JxQRvrkukA",
  authDomain: "mini-chain-of-custody.firebaseapp.com",
  projectId: "mini-chain-of-custody",
  storageBucket: "mini-chain-of-custody.firebasestorage.app",
  messagingSenderId: "1091266900897",
  appId: "1:1091266900897:web:d07054b06c0a2108fa91e0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
