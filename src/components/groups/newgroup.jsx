import React from 'react';
import {Link, browserHistory} from 'react-router';
import TextField from 'material-ui/TextField';
import {List, ListItem} from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import Share from '../share.jsx';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import fire from '../../fire';

let db = fire.firestore()

const styles = {
  buttonLabel: {
    fontWeight: 700,
    textTransform: 'none',
    letterSpacing: 0.5
  },
  inputStyle: {
    borderRadius: '6px',
    border: '1px solid #858987',
    paddingLeft: '12px',
    boxSizing: 'border-box'
  },
  hintStyle: {
     paddingLeft: '12px',
     bottom: '8px'
  },
  outline: {
    height: '40px',
    fontsize: '20px'
  },
  miniHeading: {
    fontWeight: 700,
    paddingTop: 10,
    paddingBottom: 10
  }
}

export default class CreateGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {users: [], emails: []}
  }

  componentDidMount(props) {
    var groupRef = db.collection("Group").doc()
    this.setState({groupId: groupRef.id})

    var data = {}
    db.collection("Engagement").where("User", "==", fire.auth().currentUser.uid).get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        db.collection("Engagement").where("Project", "==", doc.data().Project).get()
        .then((otherEngagements) => {
          otherEngagements.forEach((engDoc) => {
            data[engDoc.data().User] = {
              User: engDoc.data().User,
              'Project Photo': engDoc.data()['Project Photo'],
              'Volunteer Picture': engDoc.data()['Volunteer Picture'],
              Name : engDoc.data().Name,
              Project : engDoc.data()['Project Name']
            }
            console.log(data)
            this.setState({whosinPeople: data})
          })
        })
      })
    })
  }

  handleUpdateInput = (e, searchText) => {
    this.setState({searchText: searchText})
  }

  addPerson = (userId, Name) => {
    var users = this.state.users
    if (!users.includes({id: userId, Name: Name})) {
      users.push({id: userId, Name: Name})
    }
    this.setState({users: users, searchText: ''})
  }

  removePerson = (userId, Name) => {
    var users = this.state.users
    var index = users.indexOf({id: userId, Name: Name})
    users.splice(index, 1)
    this.setState({users: users})
  }

  handleSaveGroup = () => {
    if (fire.auth().currentUser) {
      var updateString = "members." + fire.auth().currentUser.uid
      db.collection("Group").doc(this.state.groupId).set({
        Creator: fire.auth().currentUser.uid,
        Name: this.state.groupName,

      }).then(() => {
        db.collection("Group").doc(this.state.groupId).update({
          [updateString] : true
        })
      })

      db.collection("User").doc(fire.auth().currentUser.uid).get().then((doc) => {
        var userName = doc.data().Name.replace(/ .*/,'')
        var users = this.state.users
        users.push({
          id: fire.auth().currentUser.uid,
          Name: userName
        })
        var batch = db.batch();

        users.forEach((user) => {
          var memberRef = db.collection("Group").doc(this.state.groupId).collection("Members").doc(user.id)
          batch.set(memberRef, {
            Name: user.Name,
            'Volunteer Picture': user['Volunteer Picture'] ? user['Volunteer Picture'] : null
          })
        })
        batch.commit().then(() => {
            browserHistory.push(`/groups/${this.state.groupId}`)
        })
      })


    }


  }

  handleGroupName = (e, nv) => {
    this.setState({groupName: nv})
  }

  render() {

    var updatedList
    if (this.state.searchText && this.state.whosinPeople) {
      var length = this.state.searchText.length
      var people = Object.values(this.state.whosinPeople)
      var filteredPeople = []
      people.forEach((person) => {
        if (person.Name.substring(0, length).toLowerCase() === this.state.searchText.toLowerCase()) {
          filteredPeople.push(person)
          console.log(person)
        }
      })
      console.log(filteredPeople)
    }

    return (
      <div style={{textAlign: 'left', padding: 10}}>
        <h2 style={{marginTop: 0}}>Create a group</h2>
        <div style={styles.miniHeading}>
          Name your group
        </div>
        <TextField
          underlineShow={false}
          fullWidth={true}
          value={this.state.groupName}
          onChange={this.handleGroupName}
          style={styles.outline}
          hintStyle={styles.hintStyle}
          inputStyle={styles.inputStyle}
          />
        <div style={styles.miniHeading}>
          Add some people you've met before
        </div>
        {
          this.state.users && this.state.users.length > 0 ?
          <div style={{display: 'flex', flexWrap: 'wrap', paddingBottom: 10}}>
            {this.state.users.map((user) => (
              <Chip style={{marginRight: 4, marginLeft: 4}}
                onRequestDelete={() => this.removePerson(user.id, user.Name)}
                >
                {user.Name}
              </Chip>
            ))}
          </div>
          :
          null
        }
        <TextField
          underlineShow={false}
          fullWidth={true}
          ref={el => { this.el = el; }}
          value={this.state.searchText}
          style={styles.outline}
          hintText='Type some names'
          hintStyle={styles.hintStyle}
          onChange={this.handleUpdateInput}
          inputStyle={styles.inputStyle}
          />

        {this.state.searchText && filteredPeople ?
          <List>
          {
            filteredPeople.map((person) => (
              <ListItem
                leftAvatar={<Avatar />}
                onClick={() => this.addPerson(person.User, person.Name)}
                primaryText={person.Name}
                secondaryText={person.Project}
              />
            ))
          }
          </List>
        : null
        }


        <div style={styles.miniHeading}>
          Invite some others
        </div>
        <Share
        buttonClicked={this.handleButtonClicked}
        Name={this.state.Name ? this.state.Name : ''}
        url={window.location.href + '/' + this.state.groupId}
        smsbody={encodeURIComponent("Join my group on Who's In?: " + window.location.href + '/' + this.state.groupId)}
        emailbody={encodeURIComponent("Join my group on Who's In?: " +  window.location.href + '/' + this.state.groupId)}
        />
        <div style={{width: '100%', paddingTop: 16}}>
          <div style={{float: 'right'}}>
            <RaisedButton
              labelStyle={styles.buttonLabel}
              primary={true}
              onClick={this.handleSaveGroup}
              label='Create'/>
          </div>
        </div>
      </div>
    )
  }
}
