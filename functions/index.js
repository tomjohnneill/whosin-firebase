const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

let db = admin.firestore()

exports.addOneToPeople = functions.firestore
  .document('Engagement/{engagementId}')
  .onCreate(event => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    var newValue = event.data.data();

    // access a particular field as you would any JS property
    var Project = newValue.Project;
    db.collection("Engagement").where("Project", "==", Project).get().then((querySnapshot) => {
      var peoplePledged = querySnapshot.size
      db.collection("Project").doc(Project).update({
        'People Pledged': peoplePledged
      })
    })

    return (null)
    // perform desired operations ...
});

exports.removeOneToPeople = functions.firestore
  .document('Engagement/{engagementId}')
  .onDelete(event => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    var newValue = event.data.previous.data();

    // access a particular field as you would any JS property
    var Project = newValue.Project;
    db.collection("Engagement").where("Project", "==", Project).get().then((querySnapshot) => {
      var peoplePledged = querySnapshot.size
      db.collection("Project").doc(Project).update({
        'People Pledged': peoplePledged
      })
    })

    return (null)
});


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
