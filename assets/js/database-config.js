var firebaseConfig = {
  apiKey: "AIzaSyD8D96eRHqq7vqvZy76jspJPPVIvjbMY_0",
  authDomain: "yuminmytum-fb9b9.firebaseapp.com",
  databaseURL: "https://yuminmytum-fb9b9.firebaseio.com",
  projectId: "yuminmytum-fb9b9",
  storageBucket: "yuminmytum-fb9b9.appspot.com",
  messagingSenderId: "170412031845",
  appId: "1:170412031845:web:3ca950d6602795d4b3eb8c"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.firestore();