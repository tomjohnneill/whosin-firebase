const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

let db = admin.firestore()

var mailgun = require('mailgun-js')({apiKey: 'key-dfe410401ff096a0f1764383dfb5e89a', domain: 'mg.intervention-tools.com'})

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


exports.sendSignUpEmail = functions.firestore
  .document('Engagement/{engagementId}')
  .onCreate(event => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    var newValue = event.data.data();
    console.log(newValue)
    db.collection("User").doc(newValue.User).get().then((userDoc) => {
      var user = userDoc.data()
      console.log(user)
      db.collection("emailTemplates").doc('ZpdFCZa0qgFEi6twPRBp').get().then((emailDoc) => {
        var email = emailDoc.data().html
        var mergeTags = emailDoc.data().mergeTags

        console.log(email)
        var Project = newValue.Project;
        db.collection("Project").doc(Project).get().then((doc) =>
          {
            var ProjectData = doc.data()
            ProjectData['_id'] = doc.id
            email = email.replace("{{ projectUrl }}", `https://whos-in-firebase.firebaseapp.com/projects/${ProjectData.Name}/${ProjectData._id}`)
            email = email.replace("{{ projectName }}", ProjectData.Name)
            email = email.replace('{{ Name }}', newValue.Name)
            email = email.replace("{{ imageUrl }}", ProjectData['Featured Image'])
            email = email.replace("{{ startTime }}", ProjectData['Start Time'].toLocaleString())
            email = email.replace("{{ location }}", ProjectData['Location'])
            email = email.replace("{{ schemaScript }}", ProjectData['Location'])
            console.log(email)
            console.log(user.Email)
            let data = {
                from: "Who's In? Confirmation <alerts@intervention-tools.com>",
                subject: `${ProjectData.Name}`,
                html: email,
                'h:Reply-To': 'alerts@intervention-tools.com',
                to: user.Email
              }
              mailgun.messages().send(data, function (error, body) {
                console.log(body)
              })

          });
      })
    })

    return (null)
});

exports.checkForUpcoming = functions.https.onRequest((req, res) => {
    var dateObj = new Date(Date.now() + 86400000 /2)
    db.collection("emailTemplates").doc('UiHoAj6WOBDEO949x1Vn').get().then((emailDoc) => {
      db.collection("Project").where("Start Time", "<", dateObj).get().then((querySnapshot) => {
        querySnapshot.forEach((project) => {
          db.collection("Engagement").where("Project", "==", project.id).get().then((engSnapshot) => {
            engSnapshot.forEach((engagement) => {
              if (!engagement.data().reminded) {
                db.collection("User").doc(engagement.data().User).get().then((userDoc) => {
                  var ProjectData = project.data()
                  ProjectData['_id'] = project.id
                  console.log(ProjectData.Name)
                  let email = emailDoc.data().html
                  email = email.replace("{{%20projectUrl }}", `https://whos-in-firebase.firebaseapp.com/projects/${ProjectData.Name}/${ProjectData._id}`)
                  email = email.replace("{{ projectName }}", ProjectData.Name)
                  email = email.replace("{{ imageUrl }}", ProjectData['Featured Image'])
                  email = email.replace("{{ startTime }}", ProjectData['Start Time'].toLocaleString())
                  email = email.replace("{{ location }}", ProjectData['Location'])
                  let data = {
                      from: "Who's In? Reminder <alerts@intervention-tools.com>",
                      subject: `${ProjectData.Name}`,
                      html: email,
                      'h:Reply-To': 'alerts@intervention-tools.com',
                      to: userDoc.data().Email
                    }
                    mailgun.messages().send(data, function (error, body) {
                      console.log(body)
                    })
                })
              }
              db.collection("Engagement").doc(engagement.id).update({
                reminded: true
              })
            })
          })
        })
      })
    })

    res.status(200).send('Done');
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
