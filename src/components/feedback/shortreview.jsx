import React from 'react';
import MediaQuery from 'react-responsive';
import {grey200, grey500, red500, red100, orange500, orange100, yellow500,
  yellow100, limeA200, limeA700, green300} from 'material-ui/styles/colors'
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {browserHistory} from 'react-router';

import fire from '../../fire';


let db = fire.firestore()

const styles = {
  smallIcon: {
    width: 36,
    height: 36,
  },
  mediumIcon: {
    width: 48,
    height: 48,
  },
  tickMed: {
    width: 58,
    height:58
  },
  largeIcon: {
    width: 60,
    height: 60,
  },
  small: {
    width: 72,
    height: 72,
    padding: 16,
  },
  medium: {
    width: 96,
    height: 96,
  },
  large: {
    width: 96,
    height: 96,

  },
  circle : {
    borderRadius: '50%',
    border: '2px solid ' + grey200,
    color: grey500,
    width: 36,
    fontWeight: 700,
    height: 36,
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  badRating : {
    borderRadius: '50%',
    border: '2px solid rgb(182,48,43)',
    color: 'white',
    width: 36,
    fontWeight: 700,
    height: 36,
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(182,48,43)',
    cursor: 'pointer'
  },
  middleRating : {
    borderRadius: '50%',
    border: '2px solid ' + yellow500,
    color: 'inherit',
    width: 36,
    fontWeight: 700,
    height: 36,
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: yellow500,
    cursor: 'pointer'
  },
  goodRating : {
    borderRadius: '50%',
    border: '2px solid ' + 'rgb(59,158,116)',
    color: 'white',
    width: 36,
    fontWeight: 700,
    height: 36,
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(59,158,116)',
    cursor: 'pointer'
  }
}

export default class ShortReview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  handleRating = (rating) => {
    this.setState({rating: rating})
  }

  componentDidMount(props) {
    db.collection("Project").doc(this.props.params._id).get().then((doc) => {
      var project = doc.data()
      project._id = doc.id
      db.collection("Charity").doc(project.Charity).get().then((charityDoc) => {
        var charity = charityDoc.data()
        charity._id = charityDoc.id
        this.setState({project: project, charity: charity, loading: false})
      })
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    var body = {
      Project: this.props.params._id,
      Charity: this.state.charity._id,
      User: fire.auth().currentUser.uid,
      feedback: this.state.feedback,
      rating: this.state.rating,
      "Project Name": this.state.project.Name,
    }
    db.collection("ProjectReviews").add(body).then((docRef) => (
      browserHistory.push(window.location.pathname + '/thanks')
    ))
  }

  render() {
    return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
        <div style={{width: '100%', boxSizing: 'border-box', padding: 24, maxWidth: '500px', textAlign: 'left'}}>
          <h2 style={{marginBottom: 36}}>
            Was it worth it?
          </h2>

          <div style={{color: grey500, fontSize: '16px', marginLeft: 20, marginBottom: 10, marginTop: 15}}>
            Tbh, not really
          </div>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginLeft: 20, marginRight: 20}}>
            <span onTouchTap={() => this.handleRating(1)}
                style={this.state.rating > 3 ? styles.goodRating : this.state.rating === 3 ? styles.middleRating : this.state.rating < 3 ? styles.badRating :  styles.circle}>
              1
            </span>
            <span onTouchTap={() => this.handleRating(2)}
                style={this.state.rating > 3 ? styles.goodRating : this.state.rating === 3 ? styles.middleRating : this.state.rating === 2 ? styles.badRating :  styles.circle}>
              2
            </span>
            <span onTouchTap={() => this.handleRating(3)}
                style={this.state.rating > 3 ? styles.goodRating : this.state.rating === 3 ? styles.middleRating : styles.circle}>
              3
            </span>
            <span onTouchTap={() => this.handleRating(4)}
                style={this.state.rating > 3 ? styles.goodRating : styles.circle}>
              4
            </span>
            <span onTouchTap={() => this.handleRating(5)}
              style={this.state.rating === 5 ? styles.goodRating : styles.circle}>
              5
            </span>
          </div>
          <div style={{color: grey500, fontSize: '16px', textAlign: 'right', marginRight: 20, marginTop: 10}}>
            Yes, definitely
          </div>

          {this.state.rating ?
          <div>
            <h2 style={{marginTop: 36, marginBottom: 6}}>
              How could it have been better?
            </h2>
            <div style={{color: grey500}}>

            </div>
            <div style={{width: '100%', paddingTop: 15, paddingBottom: 30}}>
              <TextField
                inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                  paddingLeft: '12px',  boxSizing: 'border-box'}}
                underlineShow={false}
                hintText={`Don't worry, this is private feedback`}
                multiLine={true}
                fullWidth={true}
                value={this.state.additional}
                onChange={this.handleSetAdditional}
                rows={5}
                hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                />
            </div>
            <RaisedButton
              onTouchTap={this.handleSaveReview}
              style={{marginTop: 36}}
               primary={true} fullWidth={true}
                labelStyle={{letterSpacing: '0.6px', fontWeight: 'bold', fontFamily: 'Permanent Marker', fontSize: '18px'}}
               label="Finish"  />
          </div>
          :
          null}

        </div>

    </div>
    )
  }
}
