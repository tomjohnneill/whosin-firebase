const functions = require('firebase-functions');
const fetch = require('node-fetch')
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

let db = admin.firestore()

var mailgun = require('mailgun-js')({apiKey: 'key-dfe410401ff096a0f1764383dfb5e89a', domain: 'mg.whosin.io'})

function changeImageAddress(file, size) {
  if (file && file.includes('https://d3kkowhate9mma.cloudfront.net')) {
    var str = file, replacement = '/' + size + '/';
    str = str.replace(/\/([^\/]*)$/,replacement+'$1');
    return(str + '?pass=this')
  } else {
    return (file)
  }
}

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

    var User = newValue.User;
    var ProjectSize
    db.collection("Engagement").where("User", "==", User).get().then((querySnapshot) => {
      ProjectSize = querySnapshot.size
      db.collection("User").doc(User).collection("public").doc(User).set({
        ProjectCount: ProjectSize
      }, {merge: true})
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

    var User = newValue.User;
    var ProjectSize
    db.collection("Engagement").where("User", "==", User).get().then((querySnapshot) => {
      ProjectSize = querySnapshot.size
      db.collection("User").doc(User).collection("public").doc(User).set({
        ProjectCount: ProjectSize
      }, {merge: true})
    })

    return (null)
});


exports.reviewLinkEmail = functions.firestore
  .document('UserReview/{userReviewId}')
  .onCreate(event => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    var newValue = event.data.data();

    db.collection("User").doc(newValue.User).get().then((userDoc) => {
      var user = userDoc.data()
      console.log(user)
      db.collection("emailTemplates").doc('eEqHHHsWFjQc4dlK4qqU').get().then((emailDoc) => {
        var email = emailDoc.data().html
        var Project = newValue.Project;
        email = email.replace("{{%20reviewLink }}", `https://whosin.io/projects/p/${Project}/review/project`)
        email = email.replace(/{{ Name }}/g, user.Name.replace(/ .*/,''))
        email = email.replace(/{{ Organiser }}/g, newValue.Organiser)
        let data = {
            from: "Tom <tom@whosin.io>",
            subject: `You've got a review`,
            html: email,
            'h:Reply-To': 'tom@whosin.io',
            to: user.Email
          }
          mailgun.messages().send(data, function (error, body) {
            console.log(body)
          })

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
            email = email.replace("{{ projectUrl }}", `https://whosin.io/projects/${encodeURIComponent(ProjectData.Name)}/${ProjectData._id}`)
            email = email.replace("{{ projectName }}", ProjectData.Name)
            email = email.replace(/{{ Name }}/g, newValue.Name)
            email = email.replace("{{ imageUrl }}", changeImageAddress(ProjectData['Featured Image'], '750xauto'))
            email = email.replace("{{ startTime }}", ProjectData['Start Time'] ? ProjectData['Start Time'].toLocaleString() : null)
            email = email.replace("{{ endTime }}", ProjectData['End Time'] ? ProjectData['End Time'].toLocaleString() : null)
            email = email.replace("{{ location }}", ProjectData['Location'])
            email = email.replace("{{ locationUrl }}", `https://www.google.com/maps/?q=${ProjectData.Location}`)
            email = email.replace("{{ organiser }}", ProjectData['Charity Name'])
            email = email.replace("{{ schemaScript }}", ProjectData['Location'])
            console.log(email)
            console.log(user.Email)
            let data = {
                from: "Who's In? You're in <tom@whosin.io>",
                subject: `${ProjectData.Name}`,
                html: email,
                'h:Reply-To': 'alerts@whosin.io',
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

exports.getTwitterKey = functions.https.onRequest((req, res) => {
  fetch('https://api.twitter.com/oauth2/token?grant_type=client_credentials', {
    headers: {
      'Authorization': 'Basic T3RWZlVNUHdkT1FWZEgyUkNCeHlnbVJGWTpqeW9vUWdDakpVUnhpM3I0ZW5tSVVhb1NXYVVPUTVuZ3FXdUFiMEdXMzliV21STW5GSA==',
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    method: 'POST'
  })
  .then(response => response.json())
  .then(data => {
    console.log(data)
    console.log(req.query.hashtag)
    fetch('https://api.twitter.com/1.1/search/tweets.json?q=' + encodeURIComponent(req.query.hashtag), {
      headers: {
        'Authorization': 'Bearer ' + data.access_token,
        'Accept-Encoding': 'gzip',
        'User-Agent': 'My Twitter App v1.0.23'
      }
    })
    .then(response => response.json())
    .then(newData => {
      console.log(newData)
      res.header("Access-Control-Allow-Origin", "*");
      res.status(200).send({tweets: newData.statuses})
    })
  })
})

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
                  email = email.replace("{{%20projectUrl }}", `https://whosin.io/projects/${encodeURIComponent(ProjectData.Name)}/${ProjectData._id}`)
                  email = email.replace("{{ projectName }}", ProjectData.Name)
                  email = email.replace("{{ imageUrl }}", ProjectData['Featured Image'])
                  email = email.replace("{{ startTime }}", ProjectData['Start Time'] ? ProjectData['Start Time'].toLocaleString() : null)
                  email = email.replace("{{ location }}", ProjectData['Location'])
                  let data = {
                      from: "Who's In? Reminder <alerts@whosin.io>",
                      subject: `${ProjectData.Name}`,
                      html: email,
                      'h:Reply-To': 'alerts@whosin.io',
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

exports.reviewReminder = functions.https.onRequest((req, res) => {
    var dateObj = new Date(Date.now() - 86400000 /2)
    db.collection("emailTemplates").doc('eEqHHHsWFjQc4dlK4qqU').get().then((emailDoc) => {
      db.collection("Project").where("End Time", "<", dateObj).get().then((querySnapshot) => {
        db.collection("User").doc()
        querySnapshot.forEach((project) => {
          if (!project.data().reviewReminded) {
            var ProjectData = project.data()
            ProjectData['_id'] = project.id
            console.log(ProjectData.Name)
            let email = emailDoc.data().html
            email = email.replace("{{ projectUrl }}", `https://whosin.io/projects/${ProjectData.Name}/${ProjectData._id}`)
            let data = {
                from: "Who's In? Feedback <reminders@whosin.io>",
                subject: `${ProjectData.Name}`,
                html: email,
                'h:Reply-To': 'reminders@whosin.io',
                to: userDoc.data().Email
              }
              mailgun.messages().send(data, function (error, body) {
                console.log(body)
              })
          }
          db.collection("Project").doc(project.id).update({
            reviewReminded: true
          })
        })
      })
    })
    res.status(200).send('Done');
});

exports.projectCreatedAdminEmail = functions.firestore
  .document('Project/{projectId}')
  .onCreate(event => {
    var project = event.data.data();
    var htmlString = `
      <a href='https://console.firebase.google.com/u/0/project/whos-in-firebase/database/firestore/data/Project/${event.params.projectId}'>
      Approve link</a>
      <br></br>
      ${JSON.stringify(project, null, 2)}
    `
    let data = {
        from: `Project Created <admin@whosin.io>`,
        subject: `New: ${project.Name}`,
        html: htmlString,
        'h:Reply-To': 'alerts@whosin.io',
        to: 'mevanbabakar@gmail.com'
      }
      mailgun.messages().send(data, function (error, body) {
        console.log(body)
      })
    data = {
        from: `Project Created <admin@whosin.io>`,
        subject: `New: ${project.Name}`,
        html: htmlString,
        'h:Reply-To': 'alerts@whosin.io',
        to: 'thomasjohnneill@gmail.com'
      }
      mailgun.messages().send(data, function (error, body) {
        console.log(body)
      })
    return (null)
  })

/*
exports.addOneToPeople = functions.firestore
  .document('User Review/{reviewId}')
  .onCreate(event => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    var newValue = event.data.data();

    // access a particular field as you would any JS property
    var Project = newValue.Project;



    return (null)
    // perform desired operations ...
});
*/

var algoliasearch = require('algoliasearch')
const ALGOLIA_ID = functions.config().algolia.app_id;
const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key;
const ALGOLIA_SEARCH_KEY = functions.config().algolia.search_key;

if (functions.config().environment === 'staging') {
  var ALGOLIA_INDEX_NAME = 'staging_projects';
  var SECOND_ALGOLIA_INDEX_NAME = 'staging_organisations';
} else {
  var ALGOLIA_INDEX_NAME = 'projects';
  var SECOND_ALGOLIA_INDEX_NAME = 'organisations';
}

const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);

exports.addProjectToSearch = functions.firestore.document('Project/{projectId}').onWrite(event => {
    // Get the note document
    if (event.data.exists) {
      var project = event.data.data()
    } else {
      var project = event.data.previous.data()
    }

    project._id = event.params.projectId

    // Add an 'objectID' field which Algolia requires
    project.objectID = event.params.projectId;

    // Write to the algolia index
    const index = client.initIndex(ALGOLIA_INDEX_NAME);
    return index.saveObject(project);
});

exports.addCharityToSearch = functions.firestore.document('Charity/{charityId}').onCreate(event => {
    // Get the note document
    const charity = event.data.data();
    charity._id  = event.params.charityId;

    // Add an 'objectID' field which Algolia requires
    charity.objectID = event.params.charityId;

    // Write to the algolia index
    const index = client.initIndex(SECOND_ALGOLIA_INDEX_NAME);
    return index.saveObject(charity);
});


var site = 'https://whosin.io'

function buildHtmlWithProject (post, id) {
  var string
  try {
    string = `<!DOCTYPE html><head>
      <title>' + post.Name + ' | Example Website</title>
      <meta property="og:title" content="${post.Name}">
      <meta property="twitter:title" content="${post.Name}">
      <meta property="og:type" content="article" />
      <meta property="og:description" content="${post.Sumary ? post.Summary : post.Description}" />
      <meta property="og:image" content="${post['Featured Image']}" />
      <meta name="twitter:card" content="summary" />
      <link rel="icon" href="https://example.com/favicon.png">
      </head><body>
      <script>window.location="${site}/project/?project=${id}";</script>
      </body></html>`
  }
    catch(error) {
      string = `<!DOCTYPE html><head>
        </head><body>
        <script>window.location="${site}/project/?project=${id}&challenge=${challengeId}";</script>
        </body></html>`
    };
  return string;
}

exports.project = functions.https.onRequest((req, res) => {
  const path = req.path.split('/');
  console.log(path)
  const projectId = path[3];
  console.log(projectId)
  db.collection("Project").doc(projectId).get().then((doc) => {
    const htmlString = buildHtmlWithProject(doc.data(), doc.id);
    res.set('Cache-Control', 'public, max-age=172800, s-maxage=172800');
    res.status(200).end(htmlString);
  })
});

function buildHtmlWithChallenge (id, post, challenge, challengeId) {
  var string
  try {
  string = `<!DOCTYPE html><head>
    <title>' + post.Name + ' | Example Website</title>
    <meta property="og:title" content="${post.Name}">
    <meta property="twitter:title" content="${post.Name}">
    <meta property="og:type" content="article" />
    <meta property="og:description" content="${post.Sumary ? post.Summary : post.Description}" />
    <meta property="og:image" content="${post['Featured Image']}" />
    <meta name="twitter:card" content="summary" />
    <link rel="icon" href="https://example.com/favicon.png">
    </head><body>
    <script>window.location="${site}/project/?project=${id}&challenge=${challengeId}";</script>
    </body></html>`;
  } catch(error) {
    string = `<!DOCTYPE html><head>
      </head><body>
      <script>window.location="${site}/project/?project=${id}&challenge=${challengeId}";</script>
      </body></html>`
  }
  return string;
}

exports.challenge = functions.https.onRequest((req, res) => {
  const path = req.path.split('/');
  console.log(path)
  const projectId = path[3];
  const challengeId = path[4]
  db.collection("Project").doc(projectId).get().then((doc) => {
    db.collection("Project").doc(projectId).collection("Challenge")
      .doc(challengeId).get().then((challengeDoc) => {
        const htmlString = buildHtmlWithChallenge(doc.id, doc.data(), challengeDoc.data(), challengeDoc.id);
        res.status(200).end(htmlString);
    })
  })
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
