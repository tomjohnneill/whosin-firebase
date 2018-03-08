import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import fire from '../../fire';

let db = fire.firestore()
var firebase = require("firebase");

export default class FirebaseAuth extends React.Component{
  constructor(props) {
    super(props);
  }

  componentDidMount(props) {
    fire.auth().getRedirectResult().then(function(result) {
      if (result.credential) {
        // Accounts successfully linked.
        var credential = result.credential;
        console.log(credential)
        var user = result.user;
        console.log(user)
        // ...
      }
    }).catch(function(error) {
      // Handle Errors here.
      // ...
    });
  }

  handleFacebook = (e) => {
    e.preventDefault()
    var provider = new firebase.auth.FacebookAuthProvider();
    fire.auth().currentUser.linkWithRedirect(provider)
  }

  handleGoogle = (e) => {
    e.preventDefault()
    var provider = new firebase.auth.GoogleAuthProvider();
    fire.auth().currentUser.linkWithRedirect(provider)
  }

  handleTwitter = (e) => {
    e.preventDefault()
    var provider = new firebase.auth.TwitterAuthProvider();
    fire.auth().currentUser.linkWithRedirect(provider)
  }

  handleLinkedIn = (e) => {
    e.preventDefault()

  }

  render() {
    return (
      <div>
        <div style={{width: '100%', display: 'flex',
          flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center'}}>
          <div style={{height: '150px', width: '150px', margin: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <RaisedButton label='Facebook' onClick={this.handleFacebook}/>
          </div>
          <div style={{height: '150px', width: '150px', margin: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <RaisedButton label='Google' onClick={this.handleGoogle}/>
          </div>
                    <div style={{height: '150px', width: '150px', margin: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <RaisedButton label='Twitter' onClick={this.handleTwitter}/>
          </div>
          <div style={{height: '150px', width: '150px', margin: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <RaisedButton label='LinkedIn' onClick={this.handleLinkedIn}/>
          </div>
          <div style={{height: '150px', width: '150px', margin: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <RaisedButton label='Phone' onClick={this.handleLinkedIn}/>
          </div>
        </div>
      </div>
    )
  }
}
