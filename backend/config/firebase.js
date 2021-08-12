const firebase = require("firebase/app").default;
require("firebase/auth");

const app = firebase.initializeApp({
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: "trackex-app.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECTID,
  storageBucket: "trackex-app.appspot.com",
  messagingSenderId: "994479060086",
  appId: process.env.FIREBASE_APPID,
});

module.exports = { app };
