import React from 'react';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import Slider from 'material-ui/Slider';
import RaisedButton from 'material-ui/RaisedButton';
import {browserHistory} from 'react-router';
import fire from '../../fire';

let db = fire.firestore()

const styles = {
  title: {
    fontSize: '18px',
    marginBottom: 6,
    textAlign: 'left'
  },
  detail: {
    fontSize: '12px',
    fontWeight: 'lighter',
    marginBottom: 6
  }
}

const SliderExampleStep = () => (
  <Slider step={1} min={0} max={7} value={4} />
);

export default class ProjectReview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loading: true,
      feedback: null, publicReview: null, issueImportance: 4, charityImportance: 4}
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

  handleCharity = (e, value) => {
    this.setState({charityImportance: value})
  }

  handleIssue = (e, value) => {
    this.setState({issueImportance: value})
  }

  handleSetPublicReview = (e, nv) => {
    this.setState({publicReview: e.target.value})
  }

  handleSetFeedback = (e, nv) => {
    this.setState({feedback: e.target.value})
  }

  handleYes = () => {
    this.setState({recommendation: 'Yes'})
  }

  handleNo = () => {
    this.setState({recommendation: 'No'})
  }

  handleSubmit = (e) => {
    e.preventDefault()
    var body = {
      Project: this.props.params._id,
      Charity: this.state.charity._id,
      User: fire.auth().currentUser.uid,
      publicReview: this.state.publicReview,
      feedback: this.state.feedback,
      recommendation: this.state.recommendation,
      issueImportance: this.state.issueImportance,
      charityImportance: this.state.charityImportance
    }
    db.collection("Project Reviews").add(body).then((docRef) => (
      browserHistory.push(window.location.pathname + '/thanks')
    ))
  }

  render() {

    console.log(this.state)

    return (
      <div style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center',
      background: 'linear-gradient(0deg, rgb(255, 255, 255), rgb(247, 247, 247))'}}>
        {this.state.loading ?
        null :
          <div style={{width: '100%', maxWidth: '1000px', display: 'flex', marginBottom: 50}}>
            <div style={{flex: 2}}>
              <h2 style={styles.title}>Rate & Review</h2>
              <img src={this.state.project['Featured Image']} style={{width: '100%', height: '150px', objectFit: 'cover'}}/>
              <h2 style={styles.title}>{this.state.project.Name}</h2>
            </div>
            <div style={{flex: 1}}/>
            <div style={{flex: 6, textAlign: 'left'}}>
              <h2 style={styles.title}>Describe your experience</h2>
              <div style={styles.detail}>Your review will be public on the organiser's profile</div>
              <TextField  fullWidth={true}
                style={{backgroundColor: 'white'}}
                hintStyle={{fontSize: '12px'}}
                inputStyle={{borderRadius: '3px', border: '1px solid #858987',
                  paddingLeft: '12px',  boxSizing: 'border-box', fontSize: '12px'}}
                underlineShow={false}
                hintText={'Let other people know how you found the project. Was it worthwhile? Did you have a good experience?'}
                multiLine={true}
                value={this.state.publicReview}
                onChange={this.handleSetPublicReview}

                rows={4}
                hintStyle={{ paddingLeft: '12px', bottom: '8px'}}/>

              <h2 style={styles.title}>Private Feedback</h2>
                <div style={styles.detail}>Only the organiser will see this. It won't be made public.</div>
                <TextField  fullWidth={true}
                    style={{backgroundColor: 'white'}}
                  inputStyle={{borderRadius: '3px', border: '1px solid #858987',
                    paddingLeft: '12px',  boxSizing: 'border-box'}}
                  underlineShow={false}
                  hintStyle={{fontSize: '12px'}}
                  hintText={'Is there anything the organiser could have done to make the project a bit better?'}
                  multiLine={true}
                  value={this.state.feedback}
                  onChange={this.handleSetFeedback}

                  rows={4}
                  hintStyle={{ paddingLeft: '12px', bottom: '8px'}}/>

                <h2 style={styles.title}>How important do think XXXX is?</h2>
                  <Slider step={1} min={0} max={7} value={this.state.issueImportance}
                    onChange={this.handleIssue}
                    />

                <h2 style={styles.title}>{`How much do you value ${this.state.charity.Name}'s work?`}</h2>
                  <Slider step={1} min={0} max={7} value={this.state.charityImportance}
                    onChange={this.handleCharity}
                    />


                <h2 style={styles.title}>Would you recommend this project?</h2>
                    <div style={styles.detail}>We won't publish this anywhere.</div>

                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 20}}>
                  <IconButton tooltip="Yes" iconStyle={{color: this.state.recommendation === 'Yes' ?  '#FF9800' : 'inherit'}}
                    onTouchTap={this.handleYes}>

                        <FontIcon className="fas fa-thumbs-up" />
                  </IconButton>
                  Yes
                  <div style={{width: '20px'}}/>
                  <IconButton tooltip="No" iconStyle={{color: this.state.recommendation === 'No' ?  '#FF9800' : 'inherit'}} onTouchTap={this.handleNo}>
                        <FontIcon className="fas fa-thumbs-down" />
                  </IconButton>
                  No
                </div>

                <RaisedButton primary={true} labelStyle={{fontWeight: 700, textTransform: 'none'}}
                  label='Submit' />
            </div>
          </div>
      }
      </div>
    )
  }
}
