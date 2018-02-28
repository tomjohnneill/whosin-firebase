import React , {PropTypes} from 'react';
import {grey200, grey500, grey100, amber500, grey300, lightBlue50} from 'material-ui/styles/colors'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';
import Divider from 'material-ui/Divider';
import {Tabs, Tab} from 'material-ui/Tabs';
import Dialog from 'material-ui/Dialog';
import {Link, browserHistory} from 'react-router';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import Edit from 'material-ui/svg-icons/image/edit';
import DocumentTitle from 'react-document-title';
import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import {Helmet} from "react-helmet";
import Chip from 'material-ui/Chip';
import FontIcon from 'material-ui/FontIcon';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
//import MessengerPlugin from 'react-messenger-plugin';
//import Form from '/imports/ui/components/form.jsx';
//import OrgFeedback from '/imports/ui/components/organisationfeedback.jsx';
import ShowChart from 'material-ui/svg-icons/editor/show-chart';
import ThumbsUpDown from 'material-ui/svg-icons/action/thumbs-up-down';
import Notifications from 'material-ui/svg-icons/social/notifications';
import Payment from 'material-ui/svg-icons/action/payment';
import Assignment from 'material-ui/svg-icons/action/assignment';
import People from 'material-ui/svg-icons/social/person-outline';
import Group from 'material-ui/svg-icons/social/group';
import MediaQuery from 'react-responsive';
import DesktopProject from './desktopproject.jsx';
import SignupModal from './signupmodal.jsx';
import JoiningModal from './joiningmodal.jsx';
import Badge from 'material-ui/Badge';
import AccessTime from 'material-ui/svg-icons/device/access-time';
import Place from 'material-ui/svg-icons/maps/place';
import FacebookProvider, { Like } from 'react-facebook';
import {WhosIn} from './desktopproject.jsx';
import fire from '../fire';

let db = fire.firestore()


const Loading = () => (
  <div/>
)


const styles = {
  box: {
    backgroundColor: grey200,
    marginTop: '10px',
    marginBottom: '10px',
    padding: '10px'
  },
  header: {
    backgroundColor: 'white',
    fontSize: '20pt',
    fontWeight: 'bold',
    padding: '10px',
  },
  cardTitle: {
    display: 'flex',
    marginTop: '10px'
  },
  bigTitle: {
    width: '50%',
    fontStyle: 'italic',
    color: grey500
  },
  currentCommitments: {
    textAlign: 'center',

  },
  targetCommitments: {
    textAlign: 'center'
  },
  smallIcon: {
    width: 24,
    height: 24,
    color: 'white',
  },
  mediumIcon: {
    width: 48,
    height: 48,
  },
  largeIcon: {
    width: 60,
    height: 60,
  },
  small: {
    width: 36,
    height: 36,
    padding: '4px 4px 4px 20px'
  },
  medium: {
    width: 96,
    height: 96,
    padding: 24,
  },
  large: {
    width: 120,
    height: 120,
    padding: 30,
  },
  number: {
    color: '#FF9800',
    fontSize: '20px',

  },
  bottomBit: {
    color: grey500,
    marginTop: '-5px'
  },
  chip: {
  margin: 4,
},
explanation: {
  fontSize: '8pt',
  color: grey500
},selectedTab: {
    height: '36px',
    backgroundColor: 'white',
    color: '#FF9800',
    textTransform: 'none',
    fontSize: '20px',
    letterSpacing: '0.4px',
    fontFamily: 'Permanent Marker',
    lineHeight: '16px',

    paddingLeft: '20px',
    paddingRight: '20px',
  },
  tab: {
    height: '36px',
    fontFamily: 'Open Sans',
    backgroundColor: 'white',
    color: '#484848',
    textTransform: 'none',

    fontSize: '16px',
    letterSpacing: '0.4px',
    lineHeight: '16px',
    paddingLeft: '20px',
    paddingRight: '20px',

  },
}


var _MS_PER_DAY = 1000 * 60 * 60 * 24;

export function changeImageAddress(file, size) {
  if (file && file.includes('https://d3kkowhate9mma.cloudfront.net')) {
    var str = file, replacement = '/' + size + '/';
    str = str.replace(/\/([^\/]*)$/,replacement+'$1');
    return(str + '?pass=this')
  } else {
    return (file)
  }
}

const FB = window.FB

var worktoolsToken = localStorage.getItem('worktoolsToken') ? localStorage.getItem('worktoolsToken') :
  '05a797cd-8b31-4abe-b63b-adbf0952e2c7'

export default class Project extends React.Component {
  constructor(props) {
    super(props);
    var worktoolsToken = localStorage.getItem('worktoolsToken')
    var loggedIn
    if (worktoolsToken) {
      loggedIn = true
    } else {
      loggedIn = false
    }
    this.state = {open: false, adminDrawerOpen: false, selectedIndex: 0, loading:true, loggedIn: loggedIn,
      charity: {}, inkBarLeft: '20px'}
  }

  loadFbLoginApi() {

       window.fbAsyncInit = function() {
           window.FB.init({
               appId      : '1924574794468253',
               cookie     : true,  // enable cookies to allow the server to access
               // the session
               xfbml      : true,  // parse social plugins on this page
               version    : 'v2.1' // use version 2.1
           });
       };

       console.log("Loading fb api");
         // Load the SDK asynchronously
       (function(d, s, id) {
           var js, fjs = d.getElementsByTagName(s)[0];
           if (d.getElementById(id)) return;
           js = d.createElement(s); js.id = id;
           js.src = "//connect.facebook.net/en_US/sdk.js";
           fjs.parentNode.insertBefore(js, fjs);
       }(document, 'script', 'facebook-jssdk'));
  }


  componentDidMount(props) {

    this.loadFbLoginApi()
    this.setState({ loading: true });

    db.collection("Project").doc(this.props.params._id).get().then((doc) => {
      var project = doc.data()
      project._id = doc.id
      this.setState({ project: project, charity: {}})
      if (project.Charity) {
        db.collection("Charity").doc(project.Charity).get().then((charityDoc) => {
            var charity = charityDoc.data() ? charityDoc.data() : {}
            charity._id = charityDoc.id
            this.setState({ charity: charity, loading: false})
          })
      }
    });

    if (fire.auth().currentUser) {
      db.collection("Engagement").where("User", "==", fire.auth().currentUser.uid)
      .where("Project", "==", this.props.params._id).get().then((querySnapshot) => {
        if (querySnapshot.size > 0) {
          this.setState({joined: true})
        } else {
          this.setState({joined: false})
        }
      })
    }

    if (this.props.params.challengeId) {
      this.setState({loading: true})
      db.collection("Project").doc(this.props.params._id)
      .collection("Challenge").doc(this.props.params.challengeId).get().then((doc) => {
        var challenge = doc.data()
        challenge['_id'] = doc.id
        db.collection("User").doc(challenge.User).get().then((userDoc) => {
          this.setState({loading: false, challenge: challenge, challengeUser: userDoc.data()})
        })

      })
    }



  }

  handleLinkedInAuthorize = () => {
    browserHistory.push(`https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=77x7m5rz1zpal8&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Flinkedin%2F%3Fid%3D${this.state.project.id}&state=987654321&scope=r_basicprofile`)
  }


  handleTabClick = (tab) => {
    console.log(tab)
  }

  handleModal = (e) => {
    this.setState({modalOpen: true})
  }

  handleModalChangeOpen = (e) => {
    console.log('modal change state fired for some reason')
    this.setState({modalOpen: false})
  }

  handleJoiningModal = (e) => {

    this.setState({joiningOpen: true})
  }

  handleJoiningChangeOpen = () => {
    console.log('modal change state fired for some reason')
    this.setState({joiningOpen: false})


  }

  handleDecline(e) {
    e.preventDefault()
    this.setState({open: true})
  }

  handleClose() {
  this.setState({open: false});
};


  descriptionMarkup() {
    return {__html: this.state.project.Description ?
      this.state.project.Description.replace('<img', '<img style="width:100%;height:auto"') : this.state.project.what}
  }

  setLoggedIn = () => {
    this.setState({loggedIn: true, modalOpen: false})
  }


  handleLetsGo = (e) => {
    e.preventDefault()
    browserHistory.push('/create-project/0')
  }


  changeAnchorEl = (e) => {
    console.log('handleMultipleChoiceClick')
    e.preventDefault()
    console.log(e)
    var rect = e.target.getBoundingClientRect()
    console.log(rect)
    console.log(window.innerWidth)
    this.setState({inkBarLeft: (rect.width-60)/2  + rect.x - (window.innerWidth - Math.min(window.innerWidth,1000) )/2  ,

    })

  }

  handleModal = (e) => {
    if (localStorage.getItem('worktoolsToken')) {
      if (this.state.questions) {
        browserHistory.push(window.location.href + '/questions')
      } else {
        this.createEngagement()
        browserHistory.push(window.location.href + '/joined')
      }

    } else {
      this.setState({modalOpen: true})
    }
  }

  onComplete = () => {
    if (this.state.questions) {
      browserHistory.push(window.location.href + '/questions')
    } else {
      this.createEngagement()
      browserHistory.push(window.location.href + '/joined')
    }
  }

  createEngagement = () => {
    console.log(fire.auth().currentUser)
    db.collection("User").doc(fire.auth().currentUser.uid).get().then((doc) => {
      var body = {
        "Project": this.state.project._id,
        "User": fire.auth().currentUser.uid,
        "Name": doc.data().Name,
        "Location": doc.data().Location ? doc.data().Location : null
      }
      console.log(body)
      db.collection("Engagement").add(body)
      .then(data => console.log(data))
    })

    .catch(error => {this.setState({error: error}); console.log(error)})
  }


  render () {

    var badgeFill = 1
    var tabLength = 2


    console.log(this.state)

    return (
      <div>
        <div>
        {this.state.loading ?

          <MediaQuery maxDeviceWidth={700}>
            <Card style={{backgroundColor: 'white', maxWidth: '700px'}}>
              <div style={{padding: '10px'}}>
                <Chip
                  style={{paddingLeft: '10px', paddingRight: '40px'}}
                >
                .
                </Chip></div>
                <CardMedia
                >
                  <div style={{height: '200px', backgroundColor: grey200, width: '100%'}} />
                </CardMedia>
                <CardTitle
                  style={{overflowX:'hidden'}}
                  title={<div style={{backgroundColor: '#dbdbdb', height: '36px', width: '90%'}}/>}
                  subtitle={<div style={{backgroundColor: '#efefef', height: '16px', width: '100%', marginTop: '3px'}}/>}
                  children={
                    <div>
                      <div style={{height: '16px'}}/>
                      <LinearProgress  style={{height: '10px', borderRadius: '4px'}}
                        color={amber500} mode="determinate"
                        value={0} />
                      <div style={{display: 'flex', paddingTop: '16px'}}>
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1}}>
                          <div style={{backgroundColor: '#ffefd8', height: '16px', width: '5px'}}>

                          </div>
                          <div style={{color: grey500}}>
                           people
                          </div>
                        </div>

                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1}}>
                          <div style={{backgroundColor: '#ffefd8', height: '16px', width: '5px'}}>

                          </div>
                          <div style={{color: grey500}}>
                            days to go...
                          </div>
                        </div>
                      </div>

                      <div>

                        <div style={{alignItems: 'center', display: 'flex', paddingLeft: '32px', marginTop: '16px', width: '100%', boxSizing: 'border-box'}}>
                          <Place style={{marginRight: '16px'}} color={grey500}/>
                          <div style={{backgroundColor: '#efefef', height: '12px', width: '60%'}}/>
                        </div>


                        <div style={{alignItems: 'center', display: 'flex', paddingLeft: '32px', marginTop: '12px', width: '100%', boxSizing: 'border-box'}}>
                          <AccessTime style={{marginRight: '16px'}} color={grey500}/>
                          <div style={{backgroundColor: '#efefef', height: '12px', width: '30%'}}/>
                        </div>

                      </div>
                    </div>

                  }/>
            </Card>
          </MediaQuery>
            :
          <DocumentTitle title={this.state.project.Name}>
            <div>
          <MediaQuery minDeviceWidth={700}>
              <DesktopProject params={this.props.params} project={this.state.project}
                joined={this.state.joined}
                challenge = {this.state.challenge}
                challengeUser={this.state.challengeUser}
                charity={this.state.charity} questions={this.state.questions}/>
          </MediaQuery>

          <MediaQuery maxDeviceWidth = {700}>
          <Card style={{backgroundColor: 'white', maxWidth: '700px', padding: '30px', fontSize: '14px'}}>

            <div >
            <p style={{fontSize: '18px', fontWeight: 'bold', textAlign: 'left', margin: 0}}>
              {this.state.project.Name}
            </p>
            <p style={{fontSize: '16px', fontWeight: 'lighter', textAlign: 'left'}}>
              {this.state.project.Summary}
            </p>
          </div>

          <img src={this.state.project['Featured Image']}
            style={{height: '175px', width: '100%', objectFit: 'cover', marginTop: '16px'}}/>

          <div style={{textAlign: 'left'}}>
              <p style={{fontWeight: '600',  textAlign: 'left', margin: '0px'}}>{this.state.project['People Pledged'] === null ? 0 : this.state.project['People Pledged']} people are in</p>
              <p style={{fontWeight: 'lighter',  textAlign: 'left', marginTop: '4px'}}>{this.state.project['Target People']} people needed</p>
              <LinearProgress  style={{height: '5px', borderRadius: '1.5px'}} color={'#00ABE8'} mode="determinate" value={6} />
              <div style={{display: 'flex', paddingTop: '16px'}}>

                    <div style={styles.bottomBit}>{this.state.project.Location}</div>



              </div>
              <div style={{marginTop: '16px', marginBottom: 16}}>
                <b>10</b> days to go...
              </div>
            </div>

              <div style={{display: 'flex', justifyContent: 'center', position: 'sticky'}}>


                  <RaisedButton

                     primary={true} fullWidth={true} labelStyle={{letterSpacing: '0.6px', fontSize: '18px', fontWeight: 700,
                        fontWeight: 'bold', fontFamily: 'Permanent Marker'}}
                      label="Join Now"
                      onTouchTap={this.handleModal} />


            </div>



            {/*
            <div style={{color: 'rgba(0, 0, 0, 0.54)', padding: '16px', fontSize: '14px'}}>
              All or nothing - either all {this.state.pledge.target} of us, or none of us do this.
            </div>
            */}
            <Divider/>


            <Tabs
              style={{marginTop: 16,borderBottom: '1px solid #e4e4e4'}}
              tabItemContainerStyle={{ backgroundColor: 'white', borderBottom: '1px solid #DDDDDD'}}
                inkBarStyle={{zIndex: 2, backgroundColor: '#FF9800',
                left:this.state.inkBarLeft, width: '60px'}}
              tabTemplateStyle={{backgroundColor: 'white'}}
              >
              <Tab
                style={{width: 'auto'}}
                buttonStyle={this.state.selected === 'story' ? styles.selectedTab : styles.tab}
                value='story'
                onTouchTap={this.changeAnchorEl}
                label='The Story'>

                    <div style={{marginTop: 16}}>
                        <div >

                          <img style={{height: '100px', width: '100px', objectFit: 'cover'}}
                            src = 'https://pbs.twimg.com/profile_images/527359343239245824/HKrgEYEh_400x400.png'/>
                          <p style={{margin: 0, fontWeight: 'bold'}}>
                              {this.state.charity.Name}
                            </p>
                        <p style={{margin: 0, paddingBottom: '16px'}}>
                            2nd project
                          </p>
                          <div style={{borderBottom: 'solid 0.5px #dddddd', width: '100%'}}/>
                        </div>
                         <div style={{marginBottom: '30px'}} dangerouslySetInnerHTML={this.descriptionMarkup()}/>
                           <div className="fb-like" href={this.state.project.FacebookURL}
                          width='200px'  layout="standard" action="like" size="small" showFaces="true" share="false"></div>
                        <div style={{marginTop: '20px', padding: '16px', boxSizing: 'border-box', backgroundColor: '#f5f5f5'
                          , display: 'flex', height: '77px', alignItems: 'center'}}>
                          <div style={{fontFamily: 'Permanent Marker', fontSize: '20px'}}>
                            Start a project of your own
                          </div>
                          <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                            <RaisedButton label="Let's Go"
                              onTouchTap={this.handleLetsGo}
                              style={{borderRadius: '4px', float: 'right'}}
                              labelStyle={{fontFamily: 'Permanent Marker', padding: 0}}/>
                          </div>
                        </div>
                    </div>

              </Tab>

              <Tab
                style={{width: 'auto'}}
                buttonStyle={this.state.selected === 'story' ? styles.selectedTab : styles.tab}
                onTouchTap={this.changeAnchorEl}
                label='Feedback'>
                <div>
                  {/*
                    <OrgFeedback
                      pledgedUsers={this.state.pledge.pledgedUsers}
                      pledgeId={this.state.params._id} pledgeCreatorId={this.state.pledge.creatorId}/>
                      */}

                </div>
              </Tab>

              {this.state.project.stripe && this.state.project.stripe.plans ?
              <Tab
                buttonStyle={{textTransform: 'none', color: 'rgba(0, 0, 0, 0.54)', backgroundColor: 'white',
                                }}
                label='Support'>
                <div>



                </div>
              </Tab> : null}
            </Tabs>

            <div style={{boxSizing: 'border-box'}}>
              <div style={{height: '36px', borderBottom: 'solid 1px #DDDDDD'}}/>
              <h1 style={{fontFamily: 'Permanent Marker', textAlign: 'left'}}>Who's In?</h1>
              <li>

                <WhosIn project={this.state.project}/>

              </li>
            </div>


            <CardActions>

            </CardActions>
          </Card>

          </MediaQuery>

          <SignupModal
            _id={this.props.params._id}
            title={this.props.params.project}
            open={this.state.modalOpen}
            changeOpen={this.handleModalChangeOpen}
          onComplete={this.setLoggedIn}/>

        <JoiningModal
          _id={this.props.params._id}
          Name={this.state.project.Name}
          title={this.props.params.project}
            open={this.state.joiningOpen}
            changeOpen={this.handleJoiningChangeOpen}
            onComplete={this.onComplete}
            />

          </div>
      </DocumentTitle >
      }
    </div>
      <Drawer
        onRequestChange={(open) => this.setState({adminDrawerOpen: open})}
        docked={false}
        open={this.state.adminDrawerOpen}>
        <Subheader style={{backgroundColor: grey200, fontSize: '20px' ,color: 'rgba(0, 0, 0, 0.87)'}}>Admin Tools</Subheader>
        <Divider/>
          <MenuItem leftIcon={<ShowChart/>} onTouchTap={this.handleAnalyticsClick} >Analytics</MenuItem>
          <MenuItem leftIcon={<ThumbsUpDown/>} onTouchTap={this.handleFeedbackClick} >Feedback</MenuItem>
          <MenuItem leftIcon={<Group/>} onTouchTap={this.handleGroupsClick} >User Groups</MenuItem>
          <MenuItem leftIcon={<People/>} onTouchTap={this.handleUserListClick} >Pledged Users List</MenuItem>
        </Drawer>

      </div>
    )
  }
}
