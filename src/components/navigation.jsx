import React, {PropTypes} from 'react';
import { IndexLink, Link, browserHistory } from 'react-router';
import Menu from 'material-ui/Menu';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import MediaQuery from 'react-responsive';
import Settings from 'material-ui/svg-icons/action/settings';
import Drawer from 'material-ui/Drawer';
import {Ass} from './icons.jsx'
import InfoOutline from 'material-ui/svg-icons/action/info';
import SignupModal from './signupmodal.jsx';
//import MessagingButton from '/imports/ui/components/messagingbutton.jsx';
import fire from '../fire';

let db = fire.firestore()
//import globalStyles from '/client/main.css';


const style = {
  display: 'inline-block',
  margin: '16px 32px 16px 0',
  title: {
    cursor: 'pointer',
    fontFamily: 'Permanent Marker',
    color: '#E55749',
    fontSize: '30px',
    marginRight: '10px'
  },
  appBar: {
    margin: '0px',
    boxShadow: 'inset 0px 1px 3px rgba(0,0,0.5), 0px 2px 4px, rgba(0,0,0.5)',
    paddingLeft: '16px',
    position: 'fixed',
    color: 'inherit',
    marginBottom: 56,
    top: 0,
    backgroundColor: 'white',
    borderBottom: '1px solid #DBDBDB'
  },
  embedAppBar: {
    display: 'none'
  },
  whyAppBar: {
    margin: '0px',
    boxShadow: 'inset 0px 1px 3px rgba(0,0,0.5), 0px 2px 4px, rgba(0,0,0.5)',
    paddingLeft: '16px',
    position: 'fixed',
    top: 0,
    backgroundColor: 'white',
    borderBottom: '1px solid #DBDBDB'
  },
  otherAnchor :{
    float: 'right',
    width: '10px',
  },
  popover: {
    maxWidth: '180px'
  },
  avatar: {
    cursor: 'pointer'
  }
  , badge: {
    paddingBottom : '0px'
    , paddingTop: '16px'
    , marginRight: '12px'
    , cursor: 'pointer'
  }
  , alertBadge: {
    paddingBottom : '0px'
    , paddingTop: '16px'
    , cursor: 'pointer'
  }
  , rightSide: {
    height: '50px'
    , display: 'flex'
    , alignItems: 'center'
  }
  , plainIcon: {
    paddingRight: '36px',
    paddingLeft: '12px'
  }
  , alertPlain: {
    paddingRight: '12px'
  }
  , verifiedPlain: {
    paddingRight: '24px'
  }
};

export default class Navigation extends React.Component {

  constructor(props){
    super(props);
    this.state = {drawerOpen: false, open: false, changePasswordOpen: false, modalOpen: false, loading: true};

  }


  componentDidMount(props) {
    fire.auth().onAuthStateChanged((user) => {
      if (user === null) {

      } else {
        db.collection("User").doc(fire.auth().currentUser.uid).get().then((data) => {
          this.setState({user: data.data(), userPicture: data.data().Picture, loading: false})
        })
        .catch(error => console.log('Error', error))
      }
    })

    if (fire.auth().currentUser) {
      db.collection("User").doc(fire.auth().currentUser.uid).get().then((data) => {
        this.setState({user: data.data(), userPicture: data.data().Picture, loading: false})
      })
      .catch(error => console.log('Error', error))
    }
  }


  handleOpen() {
  this.setState({changePasswordOpen: true});
  };

  handleClose() {
    this.setState({changePasswordOpen: false});
  };


  handleRequestClose() {
    this.setState({
      open: false
    });
  };

  handleChange(textField, event) {
        this.setState({
            [textField]: event.target.value
        });
    }

  handleTitleTap(event) {
    event.preventDefault();

    browserHistory.push('/')
  }

  handleYourListings(event) {
    browserHistory.push('/yourdetails')
  }

  handleDashboard(event) {
    browserHistory.push('/dashboard')
  }

  handleBlog(event) {
    event.preventDefault()
    browserHistory.push('/blog')
  }

  handleChangePassword(e) {

  }

  handleSettingsClick = (e) => {
    e.preventDefault()
    this.setState({
      open: true,
      anchorEl: e.currentTarget
    })
  }

  handleAboutClick = (e) => {
    e.preventDefault()
    browserHistory.push('/messages')
  }

  handleSignOut = (e) => {
    e.preventDefault()
    fire.auth().signOut()
    .then(() => {browserHistory.push('/'); this.setState({drawerOpen: false})})

    fire.auth().onAuthStateChanged((user) => {
      if (user === null) {
        this.setState({user: null, userPicture: null})
      }
    })
  }

  handleModal = (e) => {
    this.setState({open: false})
    this.setState({modalOpen: !this.state.modalOpen})

  }

  setModal = () => {
    let modal = this.state.modalOpen
    this.setState({modalOpen: !modal})
  }

  handleModalChangeOpen = (e) => {
    this.setState({modalOpen: false})
  }

  handleSignIn = (e) => {
    e.preventDefault()

  }

  handleTerms = (e) => {
    e.preventDefault()
    browserHistory.push('/terms')
  }

  handlePrivacyPolicy = (e) => {
    e.preventDefault()
    browserHistory.push('/privacypolicy')
  }


  handleNewPledge = (e) => {
    console.log('handleNewPledge fired')

  }

  handleCreateProject = (e) => {
    e.preventDefault()
    if (fire.auth().currentUser) {
      browserHistory.push('/create-project/0')
    } else {
      this.setState({modalOpen: true})
    }

  }

  handleComplete = () => {
    this.setState({modalOpen: false})
  }

  goToAndClose = (url) => {
    this.setState({drawerOpen: false})
    browserHistory.push(url)
  }

  render() {
    console.log(this.state)

  return(

      <div >

        <AppBar

          style={window.location.pathname.includes('/embed/') ? style.embedAppBar :
            window.location.pathname === '/why' ? style.whyAppBar : style.appBar}
          iconClassNameLeft='mobile-nav-bar'
          iconElementLeft={
            <div>
              <MediaQuery minDeviceWidth={700}>
                <div style={{width: 16}}/>
              </MediaQuery>
              <MediaQuery maxDeviceWidth={700}>
                <IconButton onClick={() => this.setState({drawerOpen: true})} tooltip='Menu'>
                  <MenuIcon/>
                </IconButton>
              </MediaQuery>
            </div>
          }
          className={'appbar'}
          iconElementRight={
                            <div style={{display: 'flex', alignItems: 'center'}}>

                            <MediaQuery minDeviceWidth = {700}>
                              {!window.location.pathname.includes('create-project') ?
                                <div style={{display: 'flex'}}>
                                  <div style={{
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', paddingRight:25}}
                                    onTouchTap={() => browserHistory.push('/why')}
                                    >
                                    Why start a project?
                                  </div>
                                  <div style={{
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', paddingRight:25}}
                                    onTouchTap={() => browserHistory.push('/about')}
                                    >
                                    About
                                  </div>
                                  <div style={{
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', paddingRight:25}}
                                    onTouchTap={() => browserHistory.push('/groups')}
                                    >
                                    Groups
                                  </div>
                                  <div style={{
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', paddingRight:25}}
                                    onTouchTap={() => browserHistory.push('/projects')}
                                    >
                                    Projects
                                  </div>

                                <RaisedButton
                                  style={{height: '36px', marginRight: '16px', boxShadow: ''}} primary={true} overlayStyle={{height: '36px'}}
                                  buttonStyle={{height: '36px'}}
                                   labelStyle={{height: '36px', display: 'inline-flex', alignItems: 'center',
                                        letterSpacing: '0.6px', fontWeight: 'bold'}}
                                  labelClassName
                                   label={<span className='flexthis'>Start a Project</span>} onTouchTap={this.handleCreateProject}/>
                               </div>
                               :
                               null}
                            </MediaQuery>
                            {this.state.loading ? null :
                              this.state.user ?
                              <div style={{
                                  height: '100%',
                                  alignItems: 'center',
                                  display: 'flex'
                                }}>
                                <IconButton onTouchTap={() => browserHistory.push('/profile')}
                                style={{padding: 0, height: 40, width: 40, marginRight: 16}}>
                                {this.state.userPicture ?
                                <Avatar src={this.state.userPicture}/>
                                :
                                <Avatar> {this.state.user.Name.substring(0,1)}</Avatar>
                                }
                              </IconButton>
                              <MediaQuery minDeviceWidth={700}>
                              <div
                                onTouchTap={this.handleSignOut}
                                style={{cursor: 'pointer',
                                  fontWeight: 700,
                                  height: '100%', alignItems: 'center',
                                  display: 'flex',
                                  color: 'inherit',
                                  paddingLeft: 10, paddingRight: 10}}>Sign Out
                                </div>
                                </MediaQuery>
                              </div> :
                            null}
                            {!this.state.user ?
                              <div
                                onTouchTap={this.setModal}
                                style={{cursor: 'pointer',
                                  fontWeight: 700,
                                  color: 'inherit',
                                  paddingLeft: 10, paddingRight: 10}}>Log In
                                </div>
                            : null}
                            </div>}
          title={
            <div className='flexthis' style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>

            <span onTouchTap ={this.handleTitleTap.bind(this)}  className = 'whosin' style={style.title}>
              who's in?
            </span>

            </div>
          }
          titleStyle = {{display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}
          />

        <div>
          {/*<SignupModal

            open={this.state.modalOpen}
            changeOpen={this.handleModalChangeOpen}
          />
          */}
       </div>
       <SignupModal
         open={this.state.modalOpen}
         type='login'
         changeOpen={this.handleModalChangeOpen}
         onComplete = {this.handleComplete}
         />
       <Drawer
         style={{textAlign: 'left'}}
          onRequestChange={(drawerOpen) => {
            this.setState({drawerOpen: drawerOpen})
            console.log('request changed')
          }}
          docked={false}
          open={this.state.drawerOpen}>
            <div style={{height: 51, display: 'flex', alignItems: 'center'}}>
              <IconButton style={{marginRight: 8}}
                onClick={() => this.setState({drawerOpen: false})} tooltip='Menu'>
                <MenuIcon/>
              </IconButton>
              <span onTouchTap ={this.handleTitleTap.bind(this)}  className = 'whosin' style={style.title}>
                who's in?
              </span>
            </div>
            <MenuItem onClick={() => this.goToAndClose('/about')}>About</MenuItem>
            <MenuItem onClick={() => this.goToAndClose('/why')}>Why start a project?</MenuItem>
            <MenuItem onClick={() => this.goToAndClose('/projects')}>Projects</MenuItem>
            <MenuItem onClick={() => this.goToAndClose('/create-project/0')}>Start a project</MenuItem>
            <MenuItem onClick={this.handleSignOut}>
              Sign out</MenuItem>
          </Drawer>

      </div>
    );
  }

}
