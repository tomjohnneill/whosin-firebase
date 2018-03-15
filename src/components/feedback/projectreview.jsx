import React from 'react';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import Slider from 'material-ui/Slider';
import {grey200, grey500, red500, red100, orange500, orange100, yellow500,
  yellow100, limeA200, limeA700, green300} from 'material-ui/styles/colors'
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

  handleRating = (rating) => {
    this.setState({rating: rating})
  }

  handleSubmit = (e) => {
    e.preventDefault()
    var body = {
      Project: this.props.params._id,
      "Project Name": this.state.project.Name,
      Charity: this.state.charity._id,
      User: fire.auth().currentUser.uid,
      publicReview: this.state.publicReview,
      feedback: this.state.feedback,
      rating: this.state.rating,
      issueImportance: this.state.issueImportance,
      charityImportance: this.state.charityImportance
    }
    db.collection("ProjectReviews").add(body).then((docRef) => (
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
                hintText={'Let other people know how you found the project. Did you have a good experience?'}
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

                <h2 style={styles.title}>How important do think this cause is?</h2>
                  <Slider step={1} min={0} max={7} value={this.state.issueImportance}
                    onChange={this.handleIssue}
                    />

                <h2 style={styles.title}>{`How much do you value ${this.state.charity.Name}'s work?`}</h2>
                  <Slider step={1} min={0} max={7} value={this.state.charityImportance}
                    onChange={this.handleCharity}
                    />


                  <h2 style={styles.title}>How worthwhile was the project?</h2>
                  <div style={{marginBottom: 16}}>

                    <div style={{color: grey500, fontSize: '16px', marginLeft: 20, marginBottom: 10, marginTop: 15}}>
                      Not particularly
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
                      Very much so
                    </div>
                </div>

                <RaisedButton primary={true} labelStyle={{fontWeight: 700, textTransform: 'none'}}
                  onClick={this.handleSubmit}
                  label='Submit' />
            </div>
          </div>
      }
      </div>
    )
  }
}
