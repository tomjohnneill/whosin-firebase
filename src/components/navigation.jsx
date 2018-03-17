import React, {PropTypes} from 'react';
import { IndexLink, Link, browserHistory } from 'react-router';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import MediaQuery from 'react-responsive';
import Settings from 'material-ui/svg-icons/action/settings';
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
    color: '#FF9800',
    fontSize: '30px',
    marginRight: '15px',
    width: '100px'
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
    this.state = {open: false, changePasswordOpen: false, modalOpen: false, loading: true};
    this.logout = this.logout.bind(this);

  }


  componentDidMount(props) {


    console.log(fire.auth())
    fire.auth().onAuthStateChanged((user) => {
      if (user === null) {

      } else {
        console.log(user)
        db.collection("User").doc(fire.auth().currentUser.uid).get().then((data) => {
          console.log(data.data())
          this.setState({user: data.data(), userPicture: data.data().Picture, loading: false})
        })
        .catch(error => console.log('Error', error))
      }
    })

    if (fire.auth().currentUser) {
      console.log(fire.auth().currentUser)
      db.collection("User").doc(fire.auth().currentUser.uid).get().then((data) => {
        console.log(data.data())
        this.setState({user: data.data(), userPicture: data.data().Picture, loading: false})
      })
      .catch(error => console.log('Error', error))
    }
  }


  logout(e){
    e.preventDefault();

    this.setState({data: {isAuthenticated: false}})


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

  render() {
    console.log(this.state)

  return(

      <div >

        <AppBar
          showMenuIconButton={false}
          style={window.location.pathname.includes('/embed/') ? style.embedAppBar :
            window.location.pathname === '/why' ? style.whyAppBar : style.appBar}
          className={'appbar'}
          iconElementRight={
                            <div style={{display: 'flex', alignItems: 'center'}}>

                            <MediaQuery minDeviceWidth = {700}>
                              {!window.location.pathname.includes('create-project') ?
                                <div style={{display: 'flex'}}>
                                  <div style={{
                                    fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', paddingRight:20}}
                                    onTouchTap={() => browserHistory.push('/about')}
                                    >
                                    About
                                  </div>
                                  <div style={{
                                    fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', paddingRight:20}}
                                    onTouchTap={() => browserHistory.push('/projects')}
                                    >
                                    Projects
                                  </div>
                                  <div style={{
                                    fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', paddingRight:20}}
                                    onTouchTap={() => browserHistory.push('/why')}
                                    >
                                    Why start a project?
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
                              <IconButton onTouchTap={() => browserHistory.push('/profile')}
                                style={{padding: 0, height: 40, width: 40, marginRight: 16}}>
                                <Avatar src={this.state.userPicture}/>
                              </IconButton> :
                              <RaisedButton label='Login' primary={true}
                                onClick={this.handleModal}
                                 labelStyle={{height: '36px', display: 'inline-flex', alignItems: 'center', textAlign: 'center', paddingLeft: '19px',
                                      letterSpacing: '0.6px', fontWeight: 'bold'}}

                                />}
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
              Who's In?
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
         changeOpen={this.handleModalChangeOpen}
         onComplete = {this.handleComplete}
         />

      </div>
    );
  }

}
