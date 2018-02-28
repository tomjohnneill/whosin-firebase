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
    backgroundColor: 'white',
    borderBottom: '1px solid #DBDBDB'
  },
  loggedInAppBar : {
    margin: '0px',
    boxShadow: 'inset 0px 1px 3px rgba(0,0,0.5), 0px 2px 4px, rgba(0,0,0.5)',
    paddingLeft: '16px',
    background: 'linear-gradient(rgba(0,0,0,1), rgba(0,0,0,0.07))'
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
    this.state = {open: false, changePasswordOpen: false, modalOpen: false};
    this.logout = this.logout.bind(this);

  }


  componentDidMount(props) {
    if (fire.auth().currentUser) {
      db.collections("User").doc(fire.auth().currentUser.uid).get().then((data) => {
        this.setState({userPicture: data.data().Picture})
      })
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
    this.setState({modalOpen: true})
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
    browserHistory.push('/create-project/0')
  }

  renderLayout() {

  return(

      <div >

        <AppBar
          showMenuIconButton={false}
          style={window.location.pathname === '/' && localStorage.getItem('worktoolsToken') ? style.loggedInAppBar : style.appBar}
          className={this.props.location === '/' && localStorage.getItem('worktoolsToken') ? 'loggedInAppBar' :'appbar'}
          iconElementRight={
                            <div style={{display: 'flex', alignItems: 'center'}}>
                              <IconButton onTouchTap={() => browserHistory.push('/profile')}
                                style={{padding: 0, height: 40, width: 40, marginRight: 16}}>
                                <Avatar src={this.state.userPicture}/>
                              </IconButton>
                            <MediaQuery minDeviceWidth = {700}>
                              {localStorage.getItem('worktoolsToken') && !window.location.pathname.includes('create-project') ?
                              <RaisedButton
                                style={{height: '36px', marginRight: '16px', boxShadow: ''}} primary={true} overlayStyle={{height: '36px'}}
                                buttonStyle={{height: '36px'}}
                                 labelStyle={{height: '36px', display: 'inline-flex', alignItems: 'center',
                                      letterSpacing: '0.6px', fontWeight: 'bold'}}
                                labelClassName
                                 label={<span className='flexthis'>Start a Project</span>} onTouchTap={this.handleCreateProject}/>
                               :
                               null}
                            </MediaQuery>
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
      </div>
    );
  }
  render () {


    return(
    <div>
      {this.renderLayout()}

    </div>
  )
  }
}
