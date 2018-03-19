import React , {PropTypes} from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import Home from './home.jsx';
import Profile from './profile.jsx';
import ProjectList from './projectlist.jsx';
import { Link, browserHistory } from 'react-router';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Featured from './featured.jsx';
import {changeImageAddress} from './desktopproject.jsx';
import AllProjects from './allprojects.jsx';
import MediaQuery from 'react-responsive';
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

  render () {
    console.log(this.state)
    return (
      <div>
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
              <h2 style={{color: 'white'}}>Doing good shouldn’t be hard.</h2>
              <span style={{fontWeight: 'lighter', color: 'white'}}>
                Finding the right project to get involved with isn’t easy. That’s why we built Who’s In.

              </span>
              <div style={{display: 'flex', paddingTop: '30px'}}>
                <RaisedButton labelStyle={styles.button} primary={true}
                  onClick={() => browserHistory.push('/projects')} label='Find a project'/>
              </div>
            </div>
          </div>
        </MediaQuery>

        <MediaQuery minDeviceWidth={700}>
          <div>
            <img
              style={{height: '90vh', width: '100%', objectFit: 'cover', position: 'relative', marginTop: '-51px'}}
              src={changeImageAddress('https://d3kkowhate9mma.cloudfront.net/important/jeremy-bishop-170994-unsplash.jpg', '2000xauto')}/>
            <div style={{position: 'absolute',top:'-51px',  height: '100%', minWidth: 350,
              width: '30%',
              left: '5%'
              , background: 'radial-gradient(ellipse closest-side, rgba(0,0,0,0.75), rgba(0,0,0,0))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            paddingLeft: '20px', paddingRight: '20px', boxSizing: 'border-box'}}>
              <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'
                , justifyContent: 'center', width: 350}}>
                <h2 style={{color: 'white'}}>Doing good shouldn’t be hard.</h2>
                <span style={{fontWeight: 'lighter', color: 'white'}}>
                  Finding the right project to get involved with isn’t easy. That’s why we built Who’s In.

                </span>
                <div style={{display: 'flex', paddingTop: '30px'}}>
                <RaisedButton labelStyle={styles.button} primary={true}
                   onClick={() => browserHistory.push('/projects')} label='Find a project'/>
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
