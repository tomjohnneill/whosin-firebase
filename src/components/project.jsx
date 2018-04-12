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
import Snackbar from 'material-ui/Snackbar';
import CircularProgress from 'material-ui/CircularProgress';
import Chip from 'material-ui/Chip';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import MediaQuery from 'react-responsive';
import DesktopProject from './desktopproject.jsx';
import SignupModal from './signupmodal.jsx';
import JoiningModal from './joiningmodal.jsx';
import Badge from 'material-ui/Badge';
import AccessTime from 'material-ui/svg-icons/device/access-time';
import Loading from './loading.jsx';
import {WhosIn} from './desktopproject.jsx';
import ConditionalModal from './conditionalmodal.jsx';
import {Spiral, CalendarIcon, Place, Clock, World} from './icons.jsx';
import {MyMapComponent} from './desktopproject.jsx';
import BottomNavigationExampleSimple from './bottomnav.jsx'
import fire from '../fire';

let db = fire.firestore()


const style = {margin: 5};

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
    color: '#E55749',
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
} ,
selectedTab: {
    height: '36px',
    backgroundColor: 'white',
    color: '#E55749',
    textTransform: 'none',
    letterSpacing: '0.4px',
    lineHeight: '16px',
    fontWeight: 700,
    paddingLeft: '20px',
    paddingRight: '20px',
    zIndex: 4
  },
  tab: {
    height: '36px',
    backgroundColor: 'white',
    color: '#484848',
    textTransform: 'none',
    letterSpacing: '0.4px',
    lineHeight: '16px',
    paddingLeft: '20px',
    paddingRight: '20px',
    zIndex: 4
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


export default class Project extends React.Component {
  constructor(props) {

    super(props);
    console.log(this.props)

    this.state = {open: false, adminDrawerOpen: false, selectedIndex: 0, loading:true,
      charity: {}, inkBarLeft: '20px', selected: 'story', challengeExists: false}
  }


  componentDidMount(props) {
    if (this.props.location.query.project) {
          window.history.replaceState({}, 'Title', '/projects/p/' + this.props.location.query.project)
    }
    this.setState({ loading: true });

    if (localStorage.getItem('project')) {
      let project = JSON.parse(localStorage.getItem('project'))
      if (typeof project['Start Time'] === 'string') {
        project['Start Time'] = new Date(project['Start Time'])
        project['End Time'] = new Date(project['End Time'])
      }
      this.setState({loading: false, project: project})
      localStorage.removeItem('project')
    }

    db.collection("Project").doc(this.props.location.query.project ?
      this.props.location.query.project : this.props.params._id).get().then((doc) => {
      var project = doc.data()
      project._id = doc.id
      this.setState({loading: false, project: project, charity: {}})
      if (project.Charity) {
        db.collection("Charity").doc(project.Charity.toString()).get().then((charityDoc) => {
            var charity = charityDoc.data() ? charityDoc.data() : {}
            charity._id = charityDoc.id
            this.setState({ charity: charity, loading: false})
          })
          .catch(error => console.log('Error', error))
      } else {
        db.collection("User").doc(project.Creator).collection("public").doc(project.Creator).get().then((userDoc) => {
          var creator = userDoc.data()
          this.setState({creator: creator})
        })
      }
    })
    .catch(error => console.log('Error', error));

    fire.auth().onAuthStateChanged((user) => {
      if (user !== null) {
        db.collection("Engagement").where("User", "==", fire.auth().currentUser.uid)
        .where("Project", "==", this.props.location.query.project ? this.props.location.query.project : this.props.params._id).get().then((querySnapshot) => {
          if (querySnapshot.size > 0) {
            this.setState({joined: true})
          } else {
            this.setState({joined: false})
          }
        })
        .catch(error => console.log('Error', error))

        db.collection("Project").doc(this.props.params._id).collection("Challenge")
        .where("User", "==", fire.auth().currentUser.uid).get().then((querySnapshot) => {
          console.log(querySnapshot)
          if (querySnapshot.size > 0) {
            this.setState({challengeExists: true})
          } else {
            this.setState({challengeExists: false})
          }
        })
        .catch(error => console.log('Error', error))
      }
    })

    if (this.props.params.challengeId || this.props.location.query.challenge) {
      db.collection("Project").doc(this.props.location.query.project ? this.props.location.query.project : this.props.params._id)
      .collection("Challenge").doc(this.props.location.query.challenge ? this.props.location.query.challenge : this.props.params.challengeId).get().then((doc) => {
        var challenge = doc.data()
        challenge['_id'] = doc.id
        db.collection("User").doc(challenge.User).get().then((userDoc) => {
          this.setState({loading: false, challenge: challenge, challengeUser: userDoc.data()})
        })
        .catch(error => console.log('Error', error))

      })
    }



  }

  handleLinkedInAuthorize = () => {
    browserHistory.push(`https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=77x7m5rz1zpal8&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Flinkedin%2F%3Fid%3D${this.state.project.id}&state=987654321&scope=r_basicprofile`)
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

  addChallengeMember = () => {
    var challengeRef = db.collection("Project").doc(this.props.params._id).collection("Challenge").doc(this.state.challenge._id)
    challengeRef.get().then((data) => {
      var challengeMembers = data.data().challengeMembers ? data.data().challengeMembers : []
      challengeMembers.push(fire.auth().currentUser.uid)
      challengeRef.update({challengeMembers: challengeMembers})
    })
  }

  handleModal = (e) => {
    console.log('handle modal fired')
    if (fire.auth().currentUser) {
      if (fire.auth().currentUser.phoneNumber) {
        if (this.state.questions) {
          browserHistory.push(window.location.href + '/questions')
        }
        else if (this.state.project['People Pledged'] >= this.state.project['Maximum People']) {
          this.addToWaitingList()
        }
        else {
          this.createEngagement()
          if (this.state.challenge) {
            this.addChallengeMember()
          }
          if (window.location.pathname.includes('/joined')) {
            browserHistory.push(window.location.pathname)
          } else {
            browserHistory.push(window.location.pathname + '/joined')
          }
        }
      } else {
          this.setState({
            modalOpen: true, modalType: 'phone'
          })
      }
    } else {
      this.setState({modalOpen: true})
    }
  }

  addToWaitingList = () => {
    db.collection("Project").doc(this.state.project._id).collection("WaitingList").add({
      user: fire.auth().currentUser.uid
    }).then(
      () => this.setState({waitingListAdded: true})
    )
  }

  handleRequestClose = () => {
    this.setState({waitingListAdded: false})
  }

  onComplete = () => {
    if (this.state.conditionalStatus) {
      this.setState({conditionalOpen: true, conditionalStatus: false, modalOpen: false})
    }
    else if (this.state.questions) {
      browserHistory.push(window.location.href + '/questions')
    } else if (this.state.project['People Pledged'] >= this.state.project['Maximum People']) {
      this.addToWaitingList()
    } else {
      this.createEngagement()
      browserHistory.push(window.location.href + '/joined')
    }
  }

  createEngagement = () => {

    console.log(this.state.project)
    console.log(fire.auth().currentUser)
    db.collection("User").doc(fire.auth().currentUser.uid).get().then((doc) => {
      var body = {
        "Project": this.state.project._id,
        "Project Name": this.state.project.Name,
        "User": fire.auth().currentUser.uid,
        "Project Photo": this.state.project['Featured Image'],
        "Charity": this.state.project['Charity Name'] ? this.state.project['Charity Name'] : null,
        "Charity Number": this.state.project.Charity ? this.state.project.Charity : null,
        "Name": doc.data().Name.replace(/ .*/,''),
        "Email": doc.data().Email,
        "Volunteer Picture": doc.data().Picture ? doc.data().Picture : null,
        "Location": doc.data().Location ? doc.data().Location : null,
        "created": new Date()
      }
      db.collection("Engagement").where("Project", "==", this.state.project._id)
      .where("User", "==", fire.auth().currentUser.uid).get().then((querySnapshot) => {
          if (querySnapshot.size === 0) {
            db.collection("Engagement").add(body)
            .then(data => db.collection("Engagement").doc(data.id).
            collection("Private").doc(this.state.project._id).
            set({
              User: fire.auth().currentUser.uid,
              Email: doc.data().Email,
              Name: doc.data().Name,
              "Volunteer Picture": doc.data().Picture ? doc.data().Picture : null,
              "Location": doc.data().Location ? doc.data().Location : null
            }))
            .catch(error => console.log('Error', error))
          }
      })

    })

    .catch(error => {this.setState({error: error}); console.log(error)})
  }

  deleteEngagement = () => {
      db.collection("Engagement").where("Project", "==", this.state.project._id)
      .where("User", "==", fire.auth().currentUser.uid).get().then((querySnapshot) => {
          querySnapshot.forEach(function(doc) {
            doc.ref.delete();
          })
      })
    .catch(error => {this.setState({error: error}); console.log(error)})
    this.forceUpdate()
  }

  handleChangeTab = (value) => {
    this.setState({selected: value})
  }

  handleUnJoin = (e) => {
    e.preventDefault()
    this.deleteEngagement()
    browserHistory.push(window.location.pathname + '/declined')
  }

  render () {
    console.log(this.state)

    return (
      <div>
        <Snackbar
          open={this.state.waitingListAdded}
          message="We've added you to the waiting list"
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}
        />
        <div>
        {this.state.loading ?

          <Loading/>
            :
          <DocumentTitle title={this.state.project.Name}>
            <div>
          <MediaQuery minDeviceWidth={700}>
            <DesktopProject params={this.props.params} project={this.state.project}
              joined={this.state.joined}
              creator={this.state.creator}
              challengeExists={this.state.challengeExists}
              challenge = {this.state.challenge}
              challengeUser={this.state.challengeUser}
              charity={this.state.charity} questions={this.state.questions}/>
          </MediaQuery>

          <MediaQuery maxDeviceWidth = {700}>
              {fire.auth().currentUser && this.state.project.Creator === fire.auth().currentUser.uid ?
                <BottomNavigationExampleSimple />
                :
                null
              }
            <img className='mobile-cover-image' src={changeImageAddress(this.state.project['Featured Image'], '500xauto')}
              style={{height: '222px', width: '100%', objectFit: 'cover'}}/>

            <div style={{padding: '20px 35px 20px 35px'}} className='mobile-project-container'>

              <p className='mobile-project-title'
                style={{fontSize: '32px', fontWeight: 'bold', textAlign: 'left',
                margin: 0}}>
                {this.state.project.Name}
              </p>

              {this.state.project.Charity ?
                <Link  className='charity-link' to={`/charity/${this.state.charity._id}`}>
                  <div className='charity-link-content'
                     style={{display: 'flex', marginTop: 6, alignItems: 'center', color: '#65A1e7'}}>
                    <div style={{marginRight: 10}} className='charity-icon'>
                      {this.state.charity['Featured Image'] ?
                        <img src={changeImageAddress(this.state.charity['Featured Image'], '50xauto')}
                          style={{height: 25, width: 25, borderRadius: '50%', objectFit: 'cover'}}/>
                        :
                        <World style={{height: 25, width: 25}} color={'#484848'}/>
                        }
                    </div>
                    <p className='charity-name' style={{margin: 0, fontSize: '14px'}}>
                        {this.state.charity.Name}
                    </p>
                  </div>
                </Link>
                :
                <Link  className='charity-link' to={`/profile/${this.state.project.Creator}`}>
                  <div className='charity-link-content'
                     style={{display: 'flex', marginTop: 6, alignItems: 'center', color: '#65A1e7'}}>
                    <div style={{marginRight: 10}} className='charity-icon'>
                      <Avatar>{this.state.creator ? this.state.creator.Name.substring(0,1) : null}</Avatar>
                    </div>
                    <p className='charity-name' style={{margin: 0, fontSize: '14px'}}>
                        {this.state.creator ? this.state.creator.Name : null}
                    </p>
                  </div>
                </Link>
              }

              <LinearProgress  style={{height: '5px', borderRadius: '1.5px', marginTop: 20}} color={'#00ABE8'} mode="determinate"
                min={0} max={this.state.project['Target People']}
                value={this.state.project['People Pledged'] === null ? 0 : this.state.project['People Pledged']} />
              <div style={{textAlign: 'right', paddingTop: 6}} className='to-go-text'>
                {this.state.project['People Pledged'] ? Math.max(Number(this.state.project['Target People']) - this.state.project['People Pledged'],0) : this.state.project['Target People']} more people needed
              </div>
            </div>


            <div style={{backgroundColor: 'rgba(216,216,216,0.2)', padding: '20px 35px 20px 35px', textAlign: 'left'}}
              className='datetime-container'>

              {this.state.project['Start Time'] ?
              <div className='date-container' style={{display: 'flex'}}>
                <div className='date-icon'>
                  <CalendarIcon color={'black'} style={{height: 20, width: 20, marginRight: 16}}/>
                </div>
                <div>
                  {this.state.project['Start Time'].toLocaleString('en-gb',
                    {weekday: 'long', month: 'long', day: 'numeric'})}
                </div>
              </div>
              : null}

              {this.state.project['Start Time'] ?
              <div className='time-container' style={{display: 'flex', marginTop: 10}}>
                <div className='time-icon'>
                  <Clock color={'black'} style={{height: 20, width: 20, marginRight: 16}}/>
                </div>
                <div >
                  {this.state.project['Start Time'].toLocaleString('en-gb',
                    {hour: '2-digit', minute: '2-digit'})} -
                    {this.state.project['End Time'].toLocaleString('en-gb',
                      {hour: '2-digit', minute: '2-digit'})}
                </div>
              </div>
              : null}

              {this.state.project.Location || this.state.project.Remote ?
                <div className='location-container' style={{display: 'flex', marginTop: 10}}>
                  <div className='location-icon'>
                    <Place color={'black'} style={{height: 20, width: 20, marginRight: 16}}/>
                  </div>
                  <div style={{textAlign: 'left'}}>
                    {
                      this.state.project.Location ?
                      <a href={`https://www.google.com/maps/?q=${this.state.project.Location}`} target='_blank' rel='noopener' style={{color: '#65A1e7', textAlign: 'left'}}>
                        {this.state.project.Location}
                      </a>
                      :
                      'Remote'
                    }
                  </div>
                </div>
                : null
              }
            </div>


            <div style={{display: 'flex', justifyContent: 'center', padding: '20px 35px 20px 35px'}}>
              {!this.state.joined && this.state.project['People Pledged'] >= this.state.project['Maximum People']?
                <div>
                  <RaisedButton
                     primary={true} fullWidth={true}
                      labelStyle={{letterSpacing: '0.6px', fontWeight: 'bold'}}
                     label="Join Waiting List" onTouchTap={this.handleModal} />
                 </div>
                 :
                !this.state.joined && this.state.challenge ?
                <div>
                  <div style={{marginBottom: 10}}>
                  <span style={{fontWeight: 700, fontSize: '18px', display: 'inline-block', width: '100%'}}>
                    {`Accept ${this.state.challengeUser.Name}'s challenge:`}
                </span>
                <span style={{fontWeight: 'lighter', color: 'grey', fontSize: '14px'}}>(They're not coming unless you are)</span>
                </div>
                <RaisedButton
                   primary={true} fullWidth={true}
                    labelStyle={{letterSpacing: '0.6px', fontWeight: 'bold', fontSize: '18px'}}
                   label='Join Now' onTouchTap={this.handleModal} />
                 </div>
                 :
                 !this.state.joined ?
                <div>
                    {!this.state.challengeExists && !this.state.challengeExists && !this.state.challenge ?
                      <div>
                  <RaisedButton
                     primary={true} fullWidth={true}
                      labelStyle={{letterSpacing: '0.6px', fontWeight: 'bold',  fontSize: '18px'}}
                     label="Join Now" onTouchTap={this.handleModal} />
                 </div> : <RaisedButton
                    primary={true} fullWidth={true}
                     labelStyle={{letterSpacing: '0.6px', fontWeight: 'bold',fontSize: '18px'}}
                    label='Join Now' onTouchTap={this.handleModal} />}
                   </div>
             :
             <RaisedButton
                 fullWidth={true}
                 labelStyle={{letterSpacing: '0.6px', fontWeight: 'bold', fontSize: '18px'}}
                label="I can't come anymore" onTouchTap={this.handleUnJoin} />}

                  </div>
                  <div style={{position: 'sticky'}}>
                    <SignupModal
                      type={this.state.modalType}
                      _id={this.props.location.query.project ? this.props.location.query.project : this.props.params._id}
                      title={this.props.params.project}
                      open={this.state.modalOpen}
                      changeOpen={this.handleModalChangeOpen}
                    onComplete={this.onComplete}/>
                </div>

            <div style={{padding: '20px 35px 20px 35px', textAlign: 'left'}}>

                 <div dangerouslySetInnerHTML={this.descriptionMarkup()}/>


            </div>




              {this.state.project.Geopoint ?
                <div style={{marginBottom: 16}}>
                  <MyMapComponent
                    Geopoint={this.state.project.Geopoint}
                    address={this.state.project.Location}
                    isMarkerShown
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBnLdq8kJzE87Ba_Q5NEph7nD6vkcXmzhA&v=3.exp&libraries=geometry,drawing,places"
                    loadingElement={<div style={{ height: `100%` , borderRadius: 6}} />}
                    containerElement={<div style={{ height: `100px`}} />}
                    mapElement={<div style={{ height: `100%`, borderRadius: 6 }} />} />
                </div>
              : null}







            <div style={{boxSizing: 'border-box', padding: 24}}>
              <div style={{height: '36px', borderBottom: 'solid 1px #DDDDDD'}}/>
              <h1 style={{fontFamily: 'Permanent Marker', textAlign: 'left'}}>Who's In?</h1>
              <li>

                <WhosIn project={this.state.project}/>
                  <ConditionalModal
                    _id={this.props.location.query.project ? this.props.location.query.project : this.props.params._id}
                    title={this.props.params.project}
                    onConditionalComplete={() => this.setState({challengeExists: true})}
                    project = {this.state.project ? this.state.project : null}
                      open={this.state.conditionalOpen}
                      challengeExists={this.state.challengeExists}
                      changeOpen={this.handleConditionalChangeOpen}
                      />
              </li>
            </div>


          </MediaQuery>



        <JoiningModal
          _id={this.props.location.query.project ? this.props.location.query.project : this.props.params._id}
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

      </div>
    )
  }
}
