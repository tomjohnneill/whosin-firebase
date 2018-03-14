import React , {PropTypes} from 'react';
import {grey200, grey500, grey100, amber500, grey300, lightBlue50, blue500, yellow600} from 'material-ui/styles/colors'
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
import ShowChart from 'material-ui/svg-icons/editor/show-chart';
import ThumbsUpDown from 'material-ui/svg-icons/action/thumbs-up-down';
import Notifications from 'material-ui/svg-icons/social/notifications';
import Payment from 'material-ui/svg-icons/action/payment';
import Assignment from 'material-ui/svg-icons/action/assignment';
import People from 'material-ui/svg-icons/social/person-outline';
import Group from 'material-ui/svg-icons/social/group';
import AccessTime from 'material-ui/svg-icons/device/access-time';
import Place from 'material-ui/svg-icons/maps/place';
import SignupModal from './signupmodal.jsx';
import JoiningModal from './joiningmodal.jsx';
import Badge from 'material-ui/Badge';
import {Spiral, World, Tick} from './icons.jsx';
import Share from './share.jsx'
import ConditionalModal from './conditionalmodal.jsx';
import {List, ListItem} from 'material-ui/List';
import MediaQuery from 'react-responsive';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import fire from '../fire';

let db = fire.firestore()
const { MarkerWithLabel } = require("react-google-maps/lib/components/addons/MarkerWithLabel")

const Loading = () => (
  <div/>
)

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
    color: '#FF9800',
    fontSize: '20px',

  },
  bottomBit: {
    marginTop: '-5px',
    fontWeight: 'lighter',
    width: '100%',
    color: grey500,
    textAlign: 'left'
  },
  chip: {
  margin: 4,
},
explanation: {
  fontSize: '8pt',
  color: grey500
},     selectedTab: {
    height: '36px',
    backgroundColor: 'white',
    color: '#FF9800',
    textTransform: 'none',
    letterSpacing: '0.4px',
    lineHeight: '16px',
    fontWeight: 700,
    paddingLeft: '20px',
    paddingRight: '20px',
  },
  tab: {
    height: '36px',
    fontFamily: 'Open Sans',
    backgroundColor: 'white',
    color: '#484848',
    textTransform: 'none',
    letterSpacing: '0.4px',
    lineHeight: '16px',
    paddingLeft: '20px',
    paddingRight: '20px',

  },
  contactIcon: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  }
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

// a and b are javascript Date objects
export function dateDiffInDays(a, b) {
  // Discard the time and time-zone information.
  try {
    var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  } catch(err) {
    var utc1 = 0
    var utc2 = 1
  }

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

function readableTimeDiff(a, b) {
  try{
    var diff = Math.abs(a - b)
    console.log(diff)
    if (diff/1000 < 60) {
      return `${Math.round(diff/1000)} seconds ago`
    } else if (diff/1000/60 < 60) {
      return `${Math.round(diff/1000/60)} minutes ago`
    } else if (diff/1000/60/60 < 24) {
      return `${Math.round(diff/1000/60/60)} hours ago`
    } else if (diff/1000/60/60/24/14 < 2) {
      return `${Math.round(diff/1000/3600/24)} days ago`
    } else {
      return `${Math.round(diff/1000/3600/24/7)} weeks ago`
    }
  }
  catch(err) {
    return null
  }
}

var worktoolsToken = localStorage.getItem('worktoolsToken') ? localStorage.getItem('worktoolsToken') :
  '05a797cd-8b31-4abe-b63b-adbf0952e2c7'

export const MyMapComponent = withGoogleMap((props) =>
  <GoogleMap
    defaultZoom={10}
    defaultCenter={props.Geopoint}
  >
  <MarkerWithLabel
      position={props.Geopoint}
      labelAnchor={new window.google.maps.Point(0, 0)}
      labelStyle={{backgroundColor: 'rgba(255,255,255,0.7)', padding: 4, borderRadius: 2}}
    >
      <div>{props.address}</div>
    </MarkerWithLabel>
    {props.isMarkerShown && <Marker position={props.Geopoint} />}
  </GoogleMap>
)

class CompletedModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Dialog
          modal={false}
          open={this.props.open}
          onRequestClose={this.props.handleClose}
        >
        <div style={{maxWidth: '1000px', width: '100%', marginTop: 30}}>

          <div style={{display: 'flex'}}>
            <div style={{flex: 2, marginRight: 30}}>

              <Tick color={'#3B9E74'}/>
            </div>
            <div style={{flex: 5}}>
              <div style={{fontSize: '32px', fontWeight: 'bold', textAlign: 'left', marginBottom: 16}}>
                {this.props.project.Name}
              </div>
              <img src={changeImageAddress(this.props.project['Featured Image'], '750xauto')}
                style={{width: '100%', height: '220px', objectFit: 'cover'}}
                />
            </div>
          </div>
          <div style={{textAlign: 'left'}}>
            <div style={{width: '60%'}}>
              <div style={{display: 'inline-block',fontSize: '24px', fontWeight: 'bold', textAlign: 'left', marginBottom: 16, marginTop: 16}}>
                Nice, you've started a project.
              </div>
              <div style={{float: 'right', height: '64.8px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>

              </div>
            </div>
            <div style={{marginBottom: '16px', fontWeight: 'lighter'}}>
              Now the fun really starts.
            </div>
            <div style={{marginTop: '30px'}}>


            </div>
          </div>
        </div>
        </Dialog>
      </div>
    )
  }
}

export class WhosIn extends React.Component{
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount(props) {
    db.collection("Engagement").where("Project", "==", this.props.project._id).get().then((querySnapshot) => {
      var data = []
      querySnapshot.forEach((doc) => {
        console.log(doc.data())
        var elem = doc.data()
        elem['_id'] = doc.id
        data.push(elem)
      });
      this.setState({engagements: data, loading: false})
    });
    }

  render() {
    return (
      <div>
        {this.state.engagements ?
          this.state.engagements.map((eng) => (
            <Link to={'/profile/' + eng.User}>
            <ul style={{textAlign: 'left', alignItems: 'center', borderBottom: '1px solid #DDDDDD', height: '60px', fontSize: '10px', display: 'flex'}}>
              {eng['Volunteer Picture'] ?

              <Avatar src={eng['Volunteer Picture']}/>:
                <Avatar>{eng['Name'] ? eng['Name'].substring(0,1) : null}</Avatar>}
              <div style={{flex: 2, paddingLeft: '24px',display: 'flex', alignItems: 'center'}}>
                <div>
                  <b>{eng['Name']}</b> <br/>
                {eng['Location']}
              </div>
              </div>
              <div style={{flex: 1, display: 'flex', alignItems: 'center'}}>
                {eng['created'] ? readableTimeDiff(new Date(), eng['created']) : null}
              </div>
            </ul>
            </Link>
          ))
          :
          null}

      </div>
    )
  }
}

export default class DesktopProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {open: false, adminDrawerOpen: false, selectedIndex: 0
      , loading: true, selected: 'story', inkBarLeft: '30px', conditionalStatus: false,
    challengeExists: false, completedOpen: false}
  }

  componentDidMount(props) {
    this.setState({project: this.props.project, charity: this.props.charity, loading: false})
    console.log(window.location.pathname.substr(window.location.pathname.length - 7))
    if (window.location.pathname.substr(window.location.pathname.length - 10) === '/completed') {
      console.log('project is completed')
      setTimeout(function() { this.setState({completedOpen: true}); }.bind(this), 2000);
    }
  }

  deleteEngagement = () => {
    console.log('remove engagement')
      db.collection("Engagement").where("Project", "==", this.props.project._id)
      .where("User", "==", fire.auth().currentUser.uid).get().then((querySnapshot) => {
          querySnapshot.forEach(function(doc) {
            doc.ref.delete();
          })
      })
    .catch(error => {this.setState({error: error}); console.log(error)})
    this.forceUpdate()
  }

  createEngagement = () => {

    console.log(this.props.project)
    console.log(fire.auth().currentUser)
    db.collection("User").doc(fire.auth().currentUser.uid).get().then((doc) => {
      var body = {
        "Project": this.props.project._id,
        "Project Name": this.props.project.Name,
        "User": fire.auth().currentUser.uid,
        "Name": doc.data().Name,
        "Project Photo": this.props.project['Featured Image'],
        "Charity": this.props.project['Charity Name'] ? this.props.project['Charity Name'] : null,
        "Charity Number": this.props.project.Charity,
        "Email": doc.data().Email,
        "Volunteer Picture": doc.data().Picture ? doc.data().Picture : null,
        "Location": doc.data().Location ? doc.data().Location : null,
        "created": new Date()
      }
      console.log(body)
      db.collection("Engagement").where("Project", "==", this.props.project._id)
      .where("User", "==", fire.auth().currentUser.uid).get().then((querySnapshot) => {
          if (querySnapshot.size === 0) {
            db.collection("Engagement").add(body)
            .then(data => console.log(data))
          }
      })

    })

    .catch(error => {this.setState({error: error}); console.log(error)})
  }

  addChallengeMember = () => {
    var challengeRef = db.collection("Project").doc(this.props.project._id).collection("Challenge").doc(this.props.challenge._id)
    challengeRef.get().then((data) => {
      var challengeMembers = data.data().challengeMembers ? data.data().challengeMembers : []
      challengeMembers.push(fire.auth().currentUser.uid)
      challengeRef.update({challengeMembers: challengeMembers})
    })
  }

  setModal = () => {
    let modal = this.state.modalOpen
    this.setState({modalOpen: !modal})
  }

  handleModal = (e) => {
    if (fire.auth().currentUser) {
      if (this.props.questions) {
        browserHistory.push(window.location.href + '/questions')
      } else {
        this.createEngagement()
        if (this.props.challenge) {
          this.addChallengeMember()
        }
        if (window.location.pathname.includes('/joined')) {
          browserHistory.push(window.location.pathname)
        } else {
          browserHistory.push(window.location.pathname + '/joined')
        }
      }

    } else {
      this.setState({modalOpen: true})
    }
  }

  handleModalChangeOpen = (e) => {
    this.setState({modalOpen: false})
  }

  handleJoiningModal = (e) => {

    this.setState({joiningOpen: true})
  }

  handleConditionalModal = (e) => {
    if (localStorage.getItem('worktoolsToken')) {
      this.setState({conditionalOpen: true})
    } else {
      this.setState({modalOpen: true, conditionalStatus: true})
    }
  }

  handleConditionalChangeOpen = () => {
    this.setState({conditionalOpen: false})
  }

  handleJoiningChangeOpen = () => {
    console.log('modal change state fired for some reason')
    this.setState({joiningOpen: false})


  }

  handleCompletedModalChangeOpen = () => {
    this.setState({completedOpen: false})
    browserHistory.push(window.location.pathname.replace('/completed', ''))
  }

  handleDecline(e) {
    e.preventDefault()
    this.setState({open: true})
  }

  handleClose() {
  this.setState({open: false});
};

  handleEditClick = (e) => {
    e.preventDefault()
    browserHistory.push(`/projects/${ this.props.pledge.slug }/${ this.props.pledge._id }/edit` )
  }


  descriptionMarkup() {
    return {__html: this.state.project.Description ?
      this.state.project.Description.replace('<img', '<img style="width:100%;height:auto"') : this.state.project.Description}
  }

  onComplete = () => {
    if (this.state.conditionalStatus) {
      this.setState({conditionalOpen: true, conditionalStatus: false, modalOpen: false})
    }
    else if (this.props.questions) {
      browserHistory.push(window.location.href + '/questions')
    } else {
      this.createEngagement()
      browserHistory.push(window.location.href + '/joined')
    }
  }

  handleLetsGo = (e) => {
    e.preventDefault()
    if (fire.auth().currentUser) {
      browserHistory.push('/create-project/0')
    } else {
      this.setModal()
    }

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

  handleUnJoin = (e) => {
    e.preventDefault()
    this.deleteEngagement()
    browserHistory.push(window.location.pathname + '/declined')
  }

  handleChangeTab = (value) => {
    this.setState({selected: value})
  }

  handleEditProject = (e) => {
    e.preventDefault()
    localStorage.removeItem('basics')
    localStorage.removeItem('times')
    localStorage.removeItem('story')
    localStorage.removeItem('coverPhoto')
    var basics = {
      min: this.state.project['Target People'],
      max: this.state.project['Maximum People'],
      deadline: this.state.project['Deadline'],
      tags: this.state.project.Tags
    }
    var times = {
      'Start Time': this.state.project['Start Time'],
      'End Time': this.state.project['End Time'],
      address: this.state.project.Location
    }
    var story = {
      title: this.state.project.Name,
      story: this.state.project.Description,
      summary: this.state.project.Summary
    }
    var coverPhoto = this.state.project['Featured Image']
    localStorage.setItem('basics', JSON.stringify(basics))
    localStorage.setItem('times', JSON.stringify(times))
    localStorage.setItem('story', JSON.stringify(story))
    localStorage.setItem('coverPhoto', coverPhoto)
    localStorage.setItem('editProject', this.state.project._id)
    browserHistory.push('/create-project/1')
  }


  render () {

    console.log(this.props)
    console.log(this.state)
    var badgeFill = 1


    return (
      <div>

        {this.state.loading ?


          <div style={{marginTop: '36px'}}>

          <div style={{paddingLeft: 'auto', paddingRight: 'auto', display: 'flex',
                justifyContent: 'center'}}>
                <div style={{flex: 1, height: '100%', width: '60%'}}>
                  <div style={{backgroundColor: grey200, width: '100%', height: '300px'}}/>
                </div>
                <div style={{flex: 1, height: '100%', width: '40%', justifyContent: 'space-between', display: 'flex', flexDirection: 'column'}}>
                  <CardTitle
                    style={{paddingTop: '0px', paddingLeft: '32px',  overflowX:'hidden', paddingBottom: '0px'}}
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
                      </div>

                    }/>
                </div>
              </div>
            </div>

         :
            <div style={{marginTop: '20px'}}>

            <div style={{paddingLeft: 'auto', paddingRight: 'auto', display: 'flex',
                  justifyContent: 'center'}}>
                  <div style={{width: '100%', maxWidth: '1000px'}}>
                  <div >
                    <div style={{display: 'flex'}}>
                  <p style={{fontSize: '32px', fontWeight: 'bold', textAlign: 'left', margin: 0, flex: 1}}>
                    {this.state.project.Name}
                  </p>
                  {fire.auth().currentUser && this.state.project.Creator === fire.auth().currentUser.uid ?
                  <div style={{width: '250px' }}>
                    <RaisedButton label='Admin View'
                      secondary={true}
                      style={{marginRight: 16}}
                      onClick={() => browserHistory.push(window.location.pathname + '/admin')}
                      labelStyle={{textTransform: 'none', fontWeight: 700}}/>
                    <RaisedButton label='Edit Project'
                      secondary={true}
                      onClick={this.handleEditProject}
                      labelStyle={{textTransform: 'none', fontWeight: 700}}/>
                  </div> : null
                  }
                  </div>
                  <p style={{fontSize: '18px', fontWeight: 'light', textAlign: 'left'}}>
                    {this.state.project.Summary}
                  </p>
                </div>

              <div
                ref='variableBox'
                style={{display: 'flex',
                    alignItems: 'center', flexDirection: 'row'}}>
              <div style={{flex: 538, height: '370px', width: '60%', position: 'relative'}}>
                <img src={changeImageAddress(this.state.project['Featured Image'], '750xauto')}
                  style={{borderRadius: 4, height: '370px', width: '100%', position: 'relative'
                  , objectFit: 'cover'}}/>

                {this.state.project['Start Time'] ?
                <div style={{background: 'linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.8))', width: '100%', height: '50px', position: 'absolute',
                    zIndex: 3, bottom: 0, left: 0, color: 'white', textAlign: 'left', paddingLeft: 24, boxSizing: 'border-box',
                  fontWeight: 700, display: 'flex', alignItems: 'center'}}
                  className='dateOverlay'>
                  <FontIcon style={{marginRight: 16}} className="far fa-calendar-alt" color={'white'} />
                  {this.state.project['Start Time'].toLocaleString('en-gb', {weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'})}
                </div> :
                null}

              </div>
              <div style={{ width: '383px', height: this.props.challenge || this.props.joined ? '370px' : null}}>
                <CardTitle
                  style={{height: '100%', paddingTop: '0px', paddingLeft: '32px',  overflowX:'hidden', paddingBottom: '1px'}}
                  children={
                    <div style={{justifyContent: 'space-between', display: 'flex', flexDirection: 'column', height: '100%'}}>
                      <div>
                        <p style={{fontWeight: '600',  textAlign: 'left', margin: '0px'}}>
                          {this.state.project['People Pledged'] ? this.state.project['People Pledged'] : 0} people are in
                        </p>
                        <p style={{fontWeight: 'lighter',  textAlign: 'left', marginTop: '4px'}}>
                          {this.state.project['Target People']} people needed
                        </p>
                        <LinearProgress  style={{height: '5px', borderRadius: '1.5px'}} color={'#00ABE8'} mode="determinate"
                          min={0} max={this.state.project['Target People']}
                          value={this.state.project['People Pledged'] === null ? 0 : this.state.project['People Pledged']} />

                        <div style={{fontWeight: 'lighter', textAlign: 'left', marginTop: 10, marginBottom: 16}}>
                          <b style={{fontSize: '18px'}}>
                            {this.state.project['Deadline'] ? dateDiffInDays(new Date(),this.state.project['End Date']) : 10}
                          </b> days to go...
                        </div>

                        {this.state.project.Geopoint ?
                          <div style={{marginBottom: 16}}>
                            <MyMapComponent
                              Geopoint={this.state.project.Geopoint}
                              address={this.state.project.Location}
                              isMarkerShown
                              googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
                              loadingElement={
                                <div>
                                <MediaQuery minDeviceWidth={700}>
                                  <div style={{ height: `100%` , borderRadius: 20}} />
                                </MediaQuery>
                                </div>}
                              containerElement={<div style={{ height: `200px`}} />}
                              mapElement={<div style={{ height: `100%`, borderRadius: 20 }} />} />
                          </div>
                        : null}

                      </div>
                      {!this.props.joined && this.props.challenge ?
                        <div>
                          <div style={{marginBottom: 10}}>
                          <span style={{fontWeight: 700, fontSize: '18px', display: 'inline-block', width: '100%'}}>
                            {`Accept ${this.props.challengeUser.Name}'s challenge:`}

                        </span>
                        <span style={{fontWeight: 'lighter', color: 'grey', fontSize: '14px'}}>(They're not coming unless you are)</span>
                        </div>
                        <RaisedButton

                           primary={true} fullWidth={true}
                            labelStyle={{letterSpacing: '0.6px', fontWeight: 'bold', fontFamily: 'Permanent Marker', fontSize: '18px'}}
                           label='Join Now' onTouchTap={this.handleModal} />
                         </div>

                         :
                         !this.props.joined ?


                        <div>

                            {!this.state.challengeExists && !this.props.challengeExists && !this.props.challenge ?
                              <div>


                          <RaisedButton

                             primary={true} fullWidth={true}
                              labelStyle={{letterSpacing: '0.6px', fontWeight: 'bold', fontFamily: 'Permanent Marker', fontSize: '18px'}}
                             label="Join Now" onTouchTap={this.handleModal} />
                         </div> : <RaisedButton
                            style={{marginTop: 16}}
                            primary={true} fullWidth={true}
                             labelStyle={{letterSpacing: '0.6px', fontWeight: 'bold', fontFamily: 'Permanent Marker', fontSize: '18px'}}
                            label='Join Now' onTouchTap={this.handleModal} />}
                           </div>
                     :
                     <RaisedButton

                         fullWidth={true}
                         labelStyle={{letterSpacing: '0.6px', fontWeight: 'bold', fontFamily: 'Permanent Marker', fontSize: '18px'}}
                        label="I can't come" onTouchTap={this.handleUnJoin} />}



                    </div>

                  }/>




                    <div>
                      {this.state.project.location ?
                    <div style={{alignItems: 'center', display: 'flex', paddingLeft: '32px'}}>
                      <Place style={{marginRight: '16px'}} color={grey500}/>
                      {this.state.project.location.place}
                    </div>
                    : null}
                    {this.state.project['End Date'] != null ?
                    <div style={{alignItems: 'center', display: 'flex', paddingLeft: '32px', marginTop: '12px'}}>
                      <AccessTime style={{marginRight: '16px'}} color={grey500}/>
                      {this.state.project['End Date']}
                    </div> : null
                  }
                    </div>
              </div>
              </div>
              </div>
            </div>

            <div style={{paddingLeft: 'auto', paddingRight: 'auto', display: 'flex',
                  justifyContent: 'center', marginTop: '32px'}}>
                <div style={{width: '300px', maxWidth: '300px'}}>



                </div>
            </div>

            <div style={{display: 'flex', justifyContent: 'center'}}>
          <div style={{backgroundColor: 'white', maxWidth: '1000px', width: '100%', display: 'flex'}}>



            <Tabs
              ref='tabs'
              style={{flex: 538, borderBottom: '1px solid #e4e4e4'}}
              tabItemContainerStyle={{ backgroundColor: 'white', borderBottom: '1px solid #DDDDDD'}}


                inkBarStyle={{zIndex: 2, backgroundColor: '#FF9800',
                left:this.state.inkBarLeft, width: '60px'}}



              onChange={this.handleChangeTab}
              tabTemplateStyle={{backgroundColor: 'white'}}

              >
              <Tab
                style={{width: 'auto'}}
                buttonStyle={this.state.selected === 'story' ? styles.selectedTab : styles.tab}
                value='story'
                onTouchTap={this.changeAnchorEl}
                label='The Story'>
                <CardText  children = {
                    <div>
                        <Link to={`/charity/${this.state.charity._id}`} >
                          {this.state.charity['Featured Image'] ?
                            <img style={{height: '90px', marginBottom: 10,  width: 'auto', objectFit: 'cover'}}
                              src ={this.state.charity['Featured Image'] }/>
                            :
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center',
                              width: '120px', height: '90px', marginBottom: 10, borderRadius: '4px', backgroundColor: 'rgb(247,247,247)'}}>
                              <World style={{height: '30px', width: '30px'}} fill={'#E55749'}/>
                            </div>
                          }

                          <p style={{margin: 0, fontWeight: 'bold', marginBottom: 30}}>
                              {this.props.charity.Name}
                            </p>


                        </Link>
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
                              labelStyle={{fontFamily: 'Permanent Marker'}}/>
                          </div>
                        </div>
                    </div>
                  }>

                </CardText>
              </Tab>

              <Tab
                value='aboutus'
                style={{width: 'auto'}}
                buttonStyle={this.state.selected === 'aboutus' ? styles.selectedTab : styles.tab}
                onTouchTap={this.changeAnchorEl}
                label='About Us'>
                <div style={{padding: 16}}>
                  <h2>{this.state.charity.Name}</h2>
                  <div style={{fontWeight: 'lighter', fontSize: '14px', marginBottom: 20}}>
                    {this.state.charity.Description}
                  </div>
                  {this.state.charity.Facebook || this.state.charity.Twitter || this.state.charity.Instagram ?
                    <div>
                      <Divider/>

                      <h2 style={{fontSize: '18px', marginBottom: 16}}>Contact Us</h2>
                      <div style={{display: 'flex', width: '100%'}}>
                        {this.state.charity.Facebook ?
                        <span style={styles.contactIcon}>
                          <Avatar
                            icon={<FontIcon className="fab fa-facebook-f fa-2x" />}
                            color={'white'}
                            backgroundColor={'#3b5998'}
                            size={50}
                            style={style}
                          />
                        {this.state.charity.Facebook}
                      </span> : null }
                        {this.state.charity.Twitter ?
                        <span style={styles.contactIcon}>
                          <Avatar
                            icon={<FontIcon className="fab fa-twitter fa-2x" />}
                            color={'white'}
                            backgroundColor={'#00aced'}
                            size={50}
                            style={style}
                          />
                        {this.state.charity.Twitter}
                      </span> : null }
                        {this.state.charity.Instagram ?
                        <span style={styles.contactIcon}>
                          <Avatar
                            icon={<FontIcon className="fab fa-instagram fa-2x" />}
                            color={'white'}
                            backgroundColor={'#fb3958'}
                            size={50}
                            style={style}
                          />
                        {this.state.charity.Instagram}
                        </span> : null}
                      </div>
                    </div>
                    : null
                  }
                </div>
              </Tab>

              {this.state.project.stripe && this.state.project.stripe.plans ?
              <Tab
                value='support'
                buttonStyle={styles.selectedTab}
                label='Support'>
                <div>


                </div>
              </Tab> : null}
            </Tabs>

            <div style={{width: 383, boxSizing: 'border-box', padding: '0px 16px 0px 32px'}}>
              <div style={{height: '36px', borderBottom: 'solid 1px #DDDDDD'}}/>
              <h1 style={{fontFamily: 'Permanent Marker', textAlign: 'left'}}>Who's In?</h1>
              <li>

                <WhosIn project={this.props.project}/>


              </li>
              <ConditionalModal
                _id={this.props.params._id}
                challengeExists={this.props.challengeExists}
                onConditionalComplete={() => this.setState({challengeExists: true})}
                title={this.props.params.project}
                project = {this.state.project ? this.state.project : null}
                  open={this.state.conditionalOpen}
                  changeOpen={this.handleConditionalChangeOpen}
                  />
                <div style={{height: 60}}/>
            </div>


            <CardActions>

            </CardActions>
          </div>
          </div>

          <SignupModal
            _id={this.props.params._id}
            title={this.props.params.pledge}
            open={this.state.modalOpen}
            changeOpen={this.handleModalChangeOpen}
          onComplete={this.onComplete}/>

        <CompletedModal
            open={this.state.completedOpen}
            handleClose={this.handleCompletedModalChangeOpen}
            project={this.state.project}
            />

          <JoiningModal
            _id={this.props.params._id}
            title={this.props.params.project}
              open={this.state.joiningOpen}
              changeOpen={this.handleJoiningChangeOpen}
              onComplete={this.onComplete}
              />





      {/*
      <div>
      <FacebookProvider appId={Meteor.settings.public.FacebookAppId}>
        <Comments href={'https://www.allforone.io' +browserHistory.getCurrentLocation().pathname} />
      </FacebookProvider>
      </div>
      */}

      </div>
    }
  </div>
    )
  }
}
