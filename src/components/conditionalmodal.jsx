import React , {PropTypes} from 'react';
import SignupModal from './signupmodal.jsx';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import MediaQuery from 'react-responsive';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import Subheader from 'material-ui/Subheader';
import Slider from 'material-ui/Slider';
import Share from './share.jsx'
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import {blue500, yellow600, orange600, red600, blueGrey600} from 'material-ui/styles/colors';
import {grey200, grey500, grey100, amber500, blue200} from 'material-ui/styles/colors';
import CheckboxIcon from 'material-ui/svg-icons/toggle/check-box';
import RadioButtonIcon from 'material-ui/svg-icons/toggle/radio-button-checked';
import TextIcon from 'material-ui/svg-icons/content/text-format';
import Photo from 'material-ui/svg-icons/image/photo';
import People from 'material-ui/svg-icons/social/people';
import LocationOn from 'material-ui/svg-icons/communication/location-on';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import FontIcon from 'material-ui/FontIcon';
import fire from '../fire';

let db = fire.firestore()

const styles = {
  option : {
    fontFamily: 'Permanent Marker',
    fontSize: '18px'
  },
  line: {
    padding: "0.625em 0",
    borderBottom: "1px solid #dbd9db",
    boxSizing: 'border-box',
    textAlign: 'left',
    display: 'flex',
    cursor: 'pointer'
  },
  icon: {
    marginRight: '16px',
    width: '24px',
    marginLeft: '6px'
  }
}

export default  class ConditionalModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {login: true, loading: false, slider: 50, type: null,
       shared: false, targetCreated: false, modalOpen: false}
  }

  handleSlider = (e, v) => {
    this.setState({slider: v})
  }

  createTarget = () => {
    db.collection("Project").doc(this.props.project._id).collection("Target").add({
      Threshold: Math.round(this.props.project['Target People']/2),
      User: fire.auth().currentUser.uid,
      Project: this.props.project._id,
      Status: 'Pending'
    })
  }

  createChallenge = () => {
    db.collection("Project").doc(this.props.project._id).collection("Challenge").add({
      Threshold: 2,
      User: fire.auth().currentUser.uid,
      Project: this.props.project._id,
      Status: 'Pending'
    })
    .then((docRef) => {
      this.setState({challengeId: docRef.id, type: 'friends'})
    })
  }

  handleSwitchType = (e) => {
    e.preventDefault()
    var login = this.state.login
    this.setState({login: !login})
  }

  handleFinalJoin = (e) => {
    e.preventDefault()
    this.props.changeOpen()

  }

  handleTargetClick = () => {
    this.createTarget()
    this.setState({targetCreated: true})
  }

  handleFriendsClick = (e) => {
    e.preventDefault()
    if (fire.auth().currentUser) {
      this.createChallenge()
      if (this.props.onConditionalComplete) {
        this.props.onConditionalComplete()
      }
    } else {
      this.setState({modalOpen: true})
    }

  }

  handleModalChangeOpen = (e) => {
    this.setState({modalOpen: false})
  }

  handleButtonClicked = () => {
    console.log('button clicked')
    this.setState({shared: true})
    console.log(this.state)
  }

  onComplete = () => {
    this.setState({modalOpen: false})
    this.createChallenge()
  }

  handleUnclick = () => {
    this.setState({shared: false, type: null, undo: true})
  }

  render() {
    console.log(window.navigator)

    return (
      <div>

          {this.state.loading  ?
          <div style={{width: '100%', height: '100%', position: 'absolute', top: '0px',
            left: '0px',zIndex: '20', boxSizing: 'border-box', backgroundColor: 'rgba(255,255,255,0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <CircularProgress/>
          </div>
          : null }

          <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center'}} >
            <div style={{width: '100%'}}>



             {(this.state.type === 'friends' && !this.state.shared
               && !this.state.targetCreated) || (this.props.challengeExists && !this.state.undo) ?

               <div style={{fontWeight: 200, textAlign: 'left',
                     borderRadius: 6, marginBottom: 15,
                   marginTop: '17.4px', background: 'linear-gradient(0deg, rgb(255, 255, 255), rgb(247, 247, 247))',
                   borderLeft: '3px solid rgb(33, 150, 243)', paddingLeft: 16}}>
                 <Subheader style={{color: 'inherit',  fontWeight: 700, fontSize: '24px', paddingLeft: 0}}>
                   Go on then, ask them:
                 </Subheader>
                 <Share
                   buttonClicked={this.handleButtonClicked}
                   Name={this.props.project.Name}
                   url={window.location.href + '/' + this.state.challengeId}
                   smsbody={encodeURIComponent("I'm thinking of going to this event, can you come with me? ") + window.location.href + '/' + this.state.challengeId}
                   emailbody={`Hi%20there%2C%0A%0AI%20just%20agreed%20to%20go%20to%20this%20event%3A%20%22${this.props.project.Name}%22%2C%20but%20don%27t%20really%20want%20to%20go%20to%20it%20by%20myself.%20%0A%0AIf%20you%20come%20with%20me%2C%20we%20could%20both%20do%20something%20good.%20You%20can%20read%20a%20bit%20more%20about%20it%20here%3A%0A%0A${encodeURIComponent(window.location.href + '/' + this.state.challengeId)}%0A%0AThanks!%0A%0A` + "name"}
                   />

                 <li style={styles.line} onTouchTap={this.handleUnclick}>
                     <FontIcon style={styles.icon} className={"fas fa-undo"}/>
                     Ah, no I didn't mean that
                   </li>
               </div>

                :

              this.state.type === 'half' ?

              <div>
                Half
              </div>

              :

              this.state.shared ?

              <div style={{fontWeight: 200, textAlign: 'left',
                    borderRadius: 6, marginBottom: 15,
                  marginTop: '17.4px', background: 'linear-gradient(0deg, rgb(255, 255, 255), rgb(247, 247, 247))',
                  borderLeft: '3px solid rgb(33, 150, 243)', padding: 16}}>
                <Subheader style={{color: 'inherit',fontWeight: 700, fontSize: '24px', paddingLeft: 0}}>
                  Thanks for sharing
                </Subheader>
                <span style={{textAlign: 'left', marginBottom: 16}}>
                  We can't actually check if you did, so we're just assuming <br/><br/>
                If your friends join the project, we'll let you know.
                </span>
              </div>
              :

              this.state.targetCreated ?

              <div style={{fontWeight: 200, textAlign: 'left',
                    borderRadius: 6, marginBottom: 15,
                  marginTop: '17.4px', background: 'linear-gradient(0deg, rgb(255, 255, 255), rgb(247, 247, 247))',
                  borderLeft: '3px solid rgb(33, 150, 243)', padding: 16}}>
                <Subheader style={{color: 'inherit', fontWeight: 700, fontSize: '24px', paddingLeft: 0}}>
                  OK, cool
                </Subheader>
                <span style={{textAlign: 'left', marginBottom: 16}}>
                  We'll sign you up if it happens
                </span>
              </div>

              :



              <div>

                <List style={{fontWeight: 200, textAlign: 'left', textTransform: 'lowercase',
                      borderRadius: 6, marginBottom: 15,
                    marginTop: '17.4px', background: 'linear-gradient(0deg, rgb(255, 255, 255), rgb(247, 247, 247))',
                    borderLeft: '3px solid rgb(33, 150, 243)', paddingLeft: 16}}>
                  <Subheader style={{textTransform: 'none', color: 'inherit', fontWeight: 700, fontSize: '24px', paddingLeft: 0}}>
                    I'll sign up if...
                  </Subheader>
                  <ListItem
                    leftAvatar={<Avatar icon={<People/>} backgroundColor={blue500} />}
                    onTouchTap={this.handleFriendsClick}
                    primaryText="2 of my Friends Come"

                  />
                {/*
                  <ListItem
                    leftAvatar={<Avatar icon={<FontIcon className='fas fa-bullseye' />} backgroundColor={yellow600} />}
                    onTouchTap={this.handleTargetClick}
                    primaryText={`${Math.round(this.props.project['Target People']/2)} people sign up`}

                  />
                  */}

                </List>


          </div>

            }
             </div>

           </div>
           <div style={{marginBottom: this.state.modalOpen ? 16 : 0}}>
             <SignupModal

               _id={this.props.project._id}
               title={this.props.project.Name}
               open={this.state.modalOpen}
               changeOpen={this.handleModalChangeOpen}
             onComplete={this.onComplete}/>
           </div>

      </div>
    )
  }
}
