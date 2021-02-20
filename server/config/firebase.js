const firebase = require('firebase');

var config = {
  apiKey: "AIzaSyDrhmNJdUg7pb-naO-hRw8nJL8ThrX9MWs",
  authDomain: "video-app-4f774.firebaseapp.com",
  databaseURL: "https://video-app-4f774-default-rtdb.firebaseio.com/",
  // storageBucket: "bucket.appspot.com"
};
const app = firebase.initializeApp(config);

const db = app.database();

module.exports = db;