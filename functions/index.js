const functions = require('firebase-functions');
const fetch = require('node-fetch')
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

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
  .onCreate((snap, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    var newValue = snap.data();

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
  .onDelete((snap, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    var newValue = snap.data();

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

exports.projectApprovedEmail = functions.firestore
  .document('Project/{projectId}')
  .onUpdate((change, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    let newValue = change.after.data();
    let previousValue = change.before.data();
    if (newValue.Approved && !previousValue.Approved) {
      newValue._id = change.after.id;
      db.collection("User").doc(newValue.Creator).get().then((userDoc) => {
        let user = userDoc.data()
        console.log(user)
        db.collection("emailTemplates").doc('guUfm7g6ee5dCeRwxctp').get().then((emailDoc) => {
          let email = emailDoc.data().html
          email = email.replace("{{projectUrl}}", `https://whosin.io/projects/p/${newValue._id}`)
          email = email.replace(/{{ Name }}/g, user.Name.replace(/ .*/,''))
          email = email.replace(/{{ projectName }}/g, newValue.Name)
          let data = {
              from: "Tom <tom@whosin.io>",
              subject: `Your project has been approved`,
              html: email,
              'h:Reply-To': 'tom@whosin.io',
              to: user.Email
            }
            mailgun.messages().send(data, function (error, body) {
              console.log(body)
            })

        })
      })
    }
    return (null)
});

sendGroupInviteEmailToExistingUser = (key, group, uid) => {

    db.collection("User").doc(key).get().then((userDoc) => {
      let userData = userDoc.data()
      db.collection("emailTemplates").doc("jCpsFOWCV0NRQgCcer9e").get().then((emailDoc) => {
        let email = emailDoc.data().html
        var namesorted =  email.replace("{{firstName}}", userData.Name.replace(/ .*/,''))
        var groupsorted = namesorted.replace("{{ groupName }}", group.Name)
        var urlsorted = groupsorted.replace("{{groupUrl}}", `https://whosin.io/groups/${group._id}`)
        let data = {
            from: "Tom <tom@whosin.io>",
            subject: `You've been invited to join ${group.Name}`,
            html: urlsorted,
            'h:Reply-To': 'tom@whosin.io',
            to: userData.Email
          }
          mailgun.messages().send(data, function (error, body) {
            console.log(body)
          })
      })
  })
  return (null)
}

sendGroupInviteEmailToEmailAddress = (emailAddress, group) => {
  console.log(group)
    db.collection("emailTemplates").doc("jCpsFOWCV0NRQgCcer9e").get().then((emailDoc) => {
      let email = emailDoc.data().html

      let namesorted = email.replace(" {{firstName}}", '')
      let groupsorted = namesorted.replace("{{ groupName }}", `"${group.Name}"`)
      let urlsorted = groupsorted.replace("{{groupUrl}}", `https://whosin.io/groups/${group._id}`)

      let data = {
          from: "Tom <tom@whosin.io>",
          subject: `You've been invited to join ${group.Name}`,
          html: urlsorted,
          'h:Reply-To': 'tom@whosin.io',
          to: emailAddress
        }
        mailgun.messages().send(data, function (error, body) {
          console.log(body)
        })
    })
    return (null)
}

exports.queueInviteToGroupEmails = functions.firestore
  .document('Group/{groupId}')
  .onWrite((change, context) => {
    var newValue = change.after.data();
    newValue._id = context.params.groupId
    var previousValue = change.before.data();
    if (!previousValue || newValue.members !== previousValue.members ) {
      if (newValue.members) {
        Object.keys(newValue.members).forEach((key) => {
          if (!previousValue.members || (newValue.members[key] === true && !previousValue.members[key])) {
            let user = key
            sendGroupInviteEmailToExistingUser(user, newValue)
          }
        });
      }
    }
    if (!previousValue || newValue.invites !== previousValue.invites) {
      if (newValue.invites) {
        Object.keys(newValue.invites).forEach((key) => {
          if (!previousValue.invites || (newValue.invites[key] === true && !previousValue.invites[key])) {
            let email = key
            sendGroupInviteEmailToEmailAddress(email.replace("SJR2pDzRb9XHFdZ", "."), newValue)
          }
        });
      }
    }
    return (null)
  })


exports.peopleHaveSignedUpEmail = functions.firestore
  .document('Engagement/{engagementId}')
  .onCreate((snap, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    var newValue = snap.data();
    console.log(newValue)
    db.collection("emailTemplates").doc('QAtE3qMFF5TJO8v0Hsjj').get().then((emailDoc) => {
      var email = emailDoc.data().html
      console.log(email)
      var Project = newValue.Project;
      db.collection("Project").doc(Project).get().then((doc) => {
        var ProjectData = doc.data()
        if (!ProjectData.adminReminded && ProjectData['People Pledged'] > 1) {
          ProjectData['_id'] = doc.id
          db.collection("User").doc(ProjectData.Creator).get().then((userDoc) => {
            var user = userDoc.data()
              email = email.replace("{{projectUrl}}", `https://whosin.io/projects/p/${ProjectData._id}`)
              email = email.replace("{{adminUrl}}", `https://whosin.io/projects/p/${ProjectData._id}/admin/admin`)
              email = email.replace("{{ projectName }}", ProjectData.Name)
              email = email.replace(/{{ Name }}/g, newValue.Name)
              let data = {
                  from: "Tom <tom@whosin.io>",
                  subject: `${ProjectData.Name}`,
                  html: email,
                  'h:Reply-To': 'tom@whosin.io',
                  to: user.Email
                }
                mailgun.messages().send(data, function (error, body) {
                  console.log(body)
                  db.collection("Project").doc(Project).update({
                    adminReminded: true
                  })
                })

            });
        }
      })
    })

    return (null)
});

exports.reviewLinkEmail = functions.firestore
  .document('UserReview/{userReviewId}')
  .onCreate((snap, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    var newValue = snap.data();

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
  .onCreate((snap, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    var newValue = snap.data();
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
            email = email.replace("{{ startTime }}", ProjectData['Start Time'] ? ProjectData['Start Time'].toLocaleString('en-GB') : null)
            email = email.replace("{{ endTime }}", ProjectData['End Time'] ? ProjectData['End Time'].toLocaleString('en-GB') : null)
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

exports.getMeetupRSVPs = functions.https.onRequest((req, res) => {
  fetch(`https://api.meetup.com/${req.query.group}/events/${req.query.eventId}/rsvps?key=163f53653d28356f76636170132325`)
  .then(response => response.json())
  .then(data => {
    var returned = []
    data.forEach((rsvp) => {
      if (rsvp.response === "yes") {
        returned.push({
          Name: rsvp.member.name,
          Photo: rsvp.member.photo.photo_link,
          created: rsvp.created
        })
      }
    })
    res.header("Access-Control-Allow-Origin", "*");
    res.status(200).send({rsvps: returned})
  })
})

// Fix this

exports.getMeetupEventInfo = functions.https.onRequest((req, res) => {
  fetch(`https://api.meetup.com/${req.query.group}/events/${req.query.eventId}?key=163f53653d28356f76636170132325`)
  .then(response => response.json())
  .then(data => {
    res.header("Access-Control-Allow-Origin", "*");
    res.status(200).send({data: data})
  })
})

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
    var dateObj = new Date(Date.now() + 86400000)
    db.collection("emailTemplates").doc('UiHoAj6WOBDEO949x1Vn').get().then((emailDoc) => {
      db.collection("Project").where("Start Time", "<", dateObj).get().then((querySnapshot) => {
        querySnapshot.forEach((project) => {
          db.collection("Engagement").where("Project", "==", project.id).get().then((engSnapshot) => {
            engSnapshot.forEach((engagement) => {
              if (!engagement.data().reminded && project.data()['Start Time'] > new Date(Date.now())) {
                db.collection("User").doc(engagement.data().User).get().then((userDoc) => {
                  var ProjectData = project.data()
                  ProjectData['_id'] = project.id
                  var userData = userDoc.data()
                  console.log(ProjectData.Name)
                  let email = emailDoc.data().html
                  email = email.replace("{{%20projectUrl }}", `https://whosin.io/projects/${encodeURIComponent(ProjectData.Name)}/${ProjectData._id}`)
                  email = email.replace("{{ projectName }}", ProjectData.Name)
                  email = email.replace("{{ imageUrl }}", ProjectData['Featured Image'])
                  email = email.replace("{{ startTime }}", ProjectData['Start Time'] ? ProjectData['Start Time'].toLocaleString() : null)
                  email = email.replace("{{ location }}", ProjectData['Location'])
                  email = email.replace("{{ firstName }}", userData['Name'].replace(/ .*/,''))
                  if (ProjectData['Charity Data']) {
                    email = email.replace("{{ organisation }}", ProjectData['Charity Data'])
                  } else {
                    email = email.replace("by {{ organisation }} ", '')
                  }
                  email = email.replace("{{ endTime }}", ProjectData['End Time'] ? ProjectData['End Time'].toLocaleString() : null)
                  let data = {
                      from: "Who's In? Reminder <tom@whosin.io>",
                      subject: `${ProjectData.Name}`,
                      html: email,
                      'h:Reply-To': 'tom@whosin.io',
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
    var dateObj = new Date(Date.now())
    db.collection("emailTemplates").doc('fQQG0fSxrpArSdEtosj4').get().then((emailDoc) => {
      db.collection("emailTemplates").doc('FEtq5PN7FYehWIQXTusa').get().then((volunteerEmailDoc) => {
        db.collection("Project").where("End Time", "<", dateObj).get().then((querySnapshot) => {

          querySnapshot.forEach((project) => {
            console.log(project.data())
            let ProjectData = project.data()
            ProjectData['_id'] = project.id
            if (!ProjectData.reviewReminded && ProjectData.Approved) {

              console.log(ProjectData.Name)
              let email = emailDoc.data().html
              db.collection("User").doc(ProjectData.Creator).get().then((userDoc) => {
                email = email.replace("{{reviewLink}}", `https://whosin.io/projects/p/${ProjectData._id}/admin/leave-reviews`)
                let data = {
                    from: "Tom <tom@whosin.io>",
                    subject: `Feedback for ${ProjectData.Name}`,
                    html: email,
                    'h:Reply-To': 'tom@whosin.io',
                    to: userDoc.data().Email
                  }
                  mailgun.messages().send(data, function (error, body) {
                    console.log(body)
                  })
              })

            }
            db.collection("Project").doc(project.id).update({
              reviewReminded: true
            })

            db.collection("Engagement").where("Project", "==", project.id).get()
            .then((engSnapshot) => {
                engSnapshot.forEach((eng) => {
                  if (!eng.data().reviewReminded) {
                    let engData = eng.data()
                    console.log(engData)
                    let email = volunteerEmailDoc.data().html
                    db.collection("User").doc(engData.User).get().then((userDoc) => {
                      email = email.replace("{{ projectName }}", ProjectData.Name)
                      email = email.replace(/{{ organisation }}/g, ProjectData['Charity Name'] ? ProjectData['Charity Name'] : "your last project")
                      email = email.replace("{{reviewLink}}", `https://whosin.io/projects/p/${ProjectData._id}/review/project/short`)
                      email = email.replace("{{imageUrl}}", changeImageAddress(ProjectData['Featured Image'], '750xauto'))

                      let data = {
                          from: "Tom <tom@whosin.io>",
                          subject: `Leave some feedback for ${ProjectData.Name}`,
                          html: email,
                          'h:Reply-To': 'reminders@whosin.io',
                          to: userDoc.data().Email
                        }
                        mailgun.messages().send(data, function (error, body) {
                          console.log(body)
                        })
                  })

                  db.collection("Engagement").doc(eng.id).update({
                    reviewReminded: true
                  })
                }
              })
            })
          })
        })
      })
    })
    res.status(200).send('Done');
});

exports.projectCreatedAdminEmail = functions.firestore
  .document('Project/{projectId}')
  .onCreate((snap, context) => {
    var project = snap.data();
    var htmlString = `
      <a href='https://console.firebase.google.com/u/0/project/whos-in-firebase/database/firestore/data/Project/${context.params.projectId}'>
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

exports.addProjectToSearch = functions.firestore.document('Project/{projectId}').onWrite((change, context) => {
    // Get the note document
    var project
    if (change.after) {
      project = change.after.data()
    } else {
      project = change.data()
    }
    project._id = context.params.projectId

    // Add an 'objectID' field which Algolia requires
    project.objectID = context.params.projectId;

    // Write to the algolia index
    const index = client.initIndex(ALGOLIA_INDEX_NAME);
    return index.saveObject(project);
});

exports.removeProjectFromSearch = functions.firestore.document('Project/{projectId}').onDelete((snap, context) => {
    // Get the note document
    var project = snap.data()
    project._id = context.params.projectId

    // Add an 'objectID' field which Algolia requires
    project.objectID = context.params.projectId;

    // Write to the algolia index
    const index = client.initIndex(ALGOLIA_INDEX_NAME);
    return index.saveObject(project);
});

exports.addCharityToSearch = functions.firestore.document('Charity/{charityId}').onCreate((snap, context) => {
    // Get the note document
    const charity = snap.data();
    charity._id  = context.params.charityId;

    // Add an 'objectID' field which Algolia requires
    charity.objectID = context.params.charityId;

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
      <meta property="og:image" content="${changeImageAddress(post['Featured Image'], '750xauto')}" />
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
