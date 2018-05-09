import React , {PropTypes} from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import Profile from './profile.jsx';
import ProjectList from './projectlist.jsx';
import { Link, browserHistory } from 'react-router';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Featured from './featured.jsx';
import Snackbar from 'material-ui/Snackbar';
import {changeImageAddress} from './desktopproject.jsx';
import AllProjects from './allprojects.jsx';
import DocumentTitle from 'react-document-title';
import MediaQuery from 'react-responsive';
import SignupModal from './signupmodal.jsx';
import fire from '../fire';

let db = fire.firestore()


const styles = {
  selectedTab: {
    height: '60px',
    backgroundColor: 'white',
    color: '#E55749',
    textTransform: 'none',
    fontSize: '16px',
    letterSpacing: '0.4px',
    lineHeight: '16px',
    paddingLeft: '20px',
    paddingRight: '20px',
    fontWeight: 600
  },
  tab: {
    height: '60px',
    backgroundColor: 'white',
    color: '#484848',
    textTransform: 'none',

    fontSize: '16px',
    letterSpacing: '0.4px',
    lineHeight: '16px',
    paddingLeft: '20px',
    paddingRight: '20px',

  },
  mobileSelectedTab: {
    height: '60px',
    backgroundColor: 'white',
    color: '#E55749',
    textTransform: 'none',
    fontSize: '16px',
    letterSpacing: '0.4px',
    lineHeight: '16px',
    paddingLeft: '10px',
    paddingRight: '10px',
    fontWeight: 600
  },
  mobileTab: {
    height: '60px',
    backgroundColor: 'white',
    color: '#484848',
    textTransform: 'none',

    fontSize: '16px',
    letterSpacing: '0.4px',
    lineHeight: '16px',
    paddingLeft: '10px',
    paddingRight: '10px',

  },
  textfield: {
    height: '40px',
    fontsize: '20px'
  },
  button: {
    fontFamily: 'Permanent Marker',
    fontSize: '18px'
  }
}


export default class UserTabs extends React.Component {
  constructor(props){
    super(props);
    this.state = {}
    var lookup = ['projects','profile','charities']
    this.state = {
      slideIndex: this.props.params.tab ? lookup.indexOf(this.props.params.tab) : 0,
      inkBarLeft: '6.375px',
    };
  }

  componentDidMount() {
    fetch('https://ident.me/.json')
    .then(response => response.json())

    // Get location from ip address

    .then(function(data) {
      var ip = data
      console.log(data)
      return fetch('https://freegeoip.net/json/' + data.address)
    })
    .then(response => response.json())
    .then(data => {
      this.setState({location: data.city + ', ' + data.country_name})
      if (fire.auth().currentUser) {
        var userId = fire.auth().currentUser.uid


        var body = {
          'Location': data.city + ', ' + data.country_name
        };
          db.collection("User").doc(userId).update(body).then(() => {})
          .catch(error => console.log('Error', error))

          }
      } )
    this.setState({value: this.props.params.tab})
  }

  changeAnchorEl = (e) => {
    console.log('handleMultipleChoiceClick')
    e.preventDefault()
    console.log(e)
    var rect = e.target.getBoundingClientRect()
    console.log(rect)
    this.setState({inkBarLeft: (rect.width-100)/2  + rect.x - 100,

    })

  }

  handleTwoTabClick = (value) => {
    var lookup = ['projects','profile','charities']
    browserHistory.push('/' + value)
    this.setState({
      value: value,
      slideIndex: lookup.indexOf(value),
    });
  }

  handleCapture = () => {
    var email = this.state.emailSignup
    var location = this.state.location
    db.collection("Newsletter").add({
      email: this.state.emailSignup,
      location: this.state.location ? this.state.location: null
    }).then(() => {
      this.setState({signedUp: true, emailSignup: ''})
    })
  }

  handleRequestClose = () => {
    this.setState({
      signedUp: false,
    });
  };

  handleModalChangeOpen = (e) => {
    this.setState({modalOpen: false})
  }

  handleImIn = () => {
    if (!fire.auth().currentUser) {
      this.setState({modalOpen: !this.state.modalOpen})
    }
  }

  render () {
    console.log(this.state)
    return (
      <div>
        <DocumentTitle title="Who's In?"/>
        <Snackbar
          open={this.state.signedUp}
          message="We've added you to the mailing list"
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}
        />
        <MediaQuery maxDeviceWidth={700}>
          <img
            style={{height: '90vh', width: '100%', objectFit: 'cover', position: 'relative', marginTop: '-51px'}}
            src={changeImageAddress('https://d3kkowhate9mma.cloudfront.net/important/jeremy-bishop-170994-unsplash.jpg', '750xauto')}/>
          <div style={{position: 'absolute',top:'-51px',  height: '100%', width: '100%',
            background: 'radial-gradient(ellipse closest-side, rgba(0,0,0,0.75), rgba(0,0,0,0))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          paddingLeft: '20px', paddingRight: '20px', boxSizing: 'border-box'}}>
            <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'
              , justifyContent: 'center', width: '300px'}}>
              <h2 style={{color: 'white', fontSize: '36px'}}>Get up off your ass and do something good</h2>
              <span style={{fontWeight: 'lighter', color: 'white'}}>
                Doing good shouldn't be hard. Find a project near you to get involved with.

              </span>
              {
                !fire.auth().currentUser ?

              <div style={{paddingTop: 20}}>
              <RaisedButton label="I'm In."
                primary={true}
                onClick={this.handleImIn}
                labelStyle={{letterSpacing: 0.3, fontWeight: 700}}
                />
              <div style={{width: '80vw'}}>
                  <SignupModal
                    open={this.state.modalOpen}
                    changeOpen={this.handleModalChangeOpen}
                  />
              </div>
              </div>
              :
              null
            }
            </div>
          </div>
        </MediaQuery>

        <MediaQuery minDeviceWidth={700}>
          <div>
            <img
              style={{height: '90vh', width: '100%', objectFit: 'cover', position: 'relative', marginTop: '-51px'}}
              src={changeImageAddress('https://d3kkowhate9mma.cloudfront.net/important/jeremy-bishop-170994-unsplash.jpg', '2000xauto')}/>
            <div style={{position: 'absolute',top:'-51px',  height: '100%', minWidth: 350,
              width: '100%',
              left: 0
              ,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            paddingLeft: '20px', paddingRight: '20px', boxSizing: 'border-box'}}>
              <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column',
                 background: 'radial-gradient(ellipse closest-side, rgba(0,0,0,0.75), rgba(0,0,0,0))',
                 height: 650
                , justifyContent: 'center', width: 550}}>
                <h2 style={{color: 'white', fontSize: '45px', marginBottom: 10}}>Get up off your ass and do something good</h2>
                <span style={{fontWeight: 'lighter', color: 'white', fontSize: '20px', width: 400}}>
                Doing good shouldn't be hard. Find a project near you to get involved with.

                </span>
                {
                  !fire.auth().currentUser ?

                <div style={{paddingTop: 20}}>
                <RaisedButton label="I'm In."
                  primary={true}
                  onClick={this.handleImIn}
                  labelStyle={{letterSpacing: 0.3, fontWeight: 700}}
                  />
                  <SignupModal
                    open={this.state.modalOpen}
                    changeOpen={this.handleModalChangeOpen}
                  />
                </div>
                :
                null
              }
                <div style={{paddingTop: '30px'}}>

                </div>
              </div>
            </div>
          </div>

          </MediaQuery>


          <AllProjects/>


      </div>
    )
  }
}
