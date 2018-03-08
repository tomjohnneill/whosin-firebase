import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import SignupModal from './signupmodal.jsx';
import {browserHistory } from 'react-router';
import fire from '../fire';

let db = fire.firestore()

const styles = {
  number : {
    flex: 1, fontSize: '84px', textAlign: 'center', fontWeight: 'bold', lineHeight: '69px',
    color: '#E55749'
  },
  picture : {
    height: '100%', width: '100%', objectFit: 'cover', borderRadius: 6
  },
  para: {
    fontSize: '16px', lineHeight: '24px', fontWeight: 300, marginBottom: '16px'
  },
  text: {
    flex: 6
  },
  reason : {
    fontSize: '16px', lineHeight: '24px'
  },
  reasonHeader: {
    fontSize: '28px', lineHeight: '32px', paddingBottom: '10px', margin: 0
  }
}

export function changeImageAddress(file, size) {
  if (file && file.includes('https://d3kkowhate9mma.cloudfront.net')) {
    var str = file, replacement = '/' + size + '/';
    str = str.replace(/\/([^\/]*)$/,replacement+'$1');
    return(str + '?pass=this')
  } else {
    return (file)
  }
}

export default class Why extends React.Component {
  constructor(props) {
    super(props)
    this.state = {modalOpen: false}
  }

  handleGetStarted = (e) => {
    e.preventDefault()
    if (fire.auth().currentUser) {
      browserHistory.push('/create-project/1')
    } else {
      this.setState({modalOpen: true})
    }
  }

  onComplete = () => {
    this.setState({modalOpen: false})
    browserHistory.push('/create-project/1')
  }

  handleModalChangeOpen = () => {
    this.setState({modalOpen: false})
  }

  render() {
    return (
      <div>
        <div style={{height: '80vh', width: '100%', position: 'relative'}}>
          <div style={{width: '100%', height: '100%', position: 'relative'}}>
            <img src='https://d3kkowhate9mma.cloudfront.net/8a39e19b-4eda-4269-924e-4d9605968c94'
               style={{position: 'relative', width: '100%', height: '100%', objectFit: 'cover'}}/>
          </div>

          <div style={{position: 'absolute', zIndex: 3, width: '100%', bottom: '0px',
            backgroundImage: 'linear-gradient(-180deg, rgba(247,247,247,0.00) 0%, rgba(247,247,247,0.67) 60%, rgba(247,247,247,0.88) 80%, rgba(247,247,247,1.00) 100%)'
            , height: '200px'}}>

          </div>
          <div style={{position: 'absolute', zIndex: 3, left: 'calc(50% - 200px)', top: '50%', maxWidth: '400px', width: '100%',
              boxSizing: 'border-box', borderRadius: 6,
             padding: '20px', background: 'linear-gradient(to bottom, rgba(255,255,255,0.75), #F2F2F2)'}}>
            <h1 style={{fontFamily: 'Permanent Marker', fontSize: '48px', marginBottom: 10
              , marginTop: 0, color: '#FF9800'}} >Who's In?</h1>
            Start a project, and find more people who want to make a difference
          </div>
        </div>
        <div style={{width: '100%', height: 'auto',
            boxSizing: 'border-box',
           display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <div style={{display: 'flex', textAlign: 'left', maxWidth: '1050px', width: '100%', paddingTop: '48px', paddingBottom: '48px'}}>
            <span style={{flex: 1, marginRight: '24px'}}>
              <h2 style={styles.reasonHeader}>Why use Who's In?</h2>
                <span style={styles.reason}>
                  Whatever the project, Who's In? makes it simple to find new supporters and reach volunteers looking to help out with a cause like yours.
                </span>
            </span>
            <span style={{flex: 1, marginRight: '24px'}}>
              <h2 style={styles.reasonHeader}>You're in control</h2>
                <span style={styles.reason}>
                  With Who's In?, you're in control of when and where you run your project, how many people you need, and what the maximum number of people you can deal with.
                </span>
            </span>
            <span style={{flex: 1}}>
              <h2 style={styles.reasonHeader}>We'll help you out</h2>
              <span style={styles.reason}>
                We offer tools for contacting volunteers, conducting surveys, creating compelling impact summaries and demographic statistics for donors.
              </span>
            </span>
          </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'left'}}>
          <div style={{maxWidth: '1050px'}}>
            <h1 style={{marginBottom: '60px', marginTop: '60px', fontSize: '48px'}}>How to start a project</h1>
            <div style={{display: 'flex', marginBottom: '100px'}}>
              <span style={styles.number}>
                1
              </span>
              <div style={styles.text}>
                <h2 style={{marginTop: 0}}>Create your project page</h2>
                <div style={styles.para}>
                  It's free and easy to create a project page. Describe your project, tell people why you're doing it, and let them know when and where it's going to be.
                </div>
                <div style={styles.para}>
                  If you're a charity, we can even pull your details straight from the Charity Commission (so please use your charity email address).
                </div>
              </div>
              <div style={{flex: 6, marginLeft: '30px'}}>
                <img src='https://d3kkowhate9mma.cloudfront.net/41394607-58f0-4305-83a4-a6eab2755f61'
                  style={styles.picture} />
              </div>
            </div>
            <div style={{display: 'flex', marginBottom: '100px'}}>
              <div style={{flex: 6, marginRight: '30px'}}>
                <img src='https://d3kkowhate9mma.cloudfront.net/d9b2ac00-2db5-4567-8c71-bae246d6d089'
                  style={styles.picture} />
              </div>
              <span style={styles.number}>
                2
              </span>
              <div style={styles.text}>
                <h2 style={{marginTop: 0}}>Let us know what you want from volunteers</h2>
                <div style={styles.para}>
                  If you need to know anything about your volunteers, from demographic information to whether they have a DBS check, simply add that question to your project page.
                </div>
                <div style={styles.para}>
                  Let us know if you are looking for a certain skillset, or particular demographic for your funding, and we will show your project to the right potential volunteers.
                </div>
              </div>
            </div>
            <div style={{display: 'flex', marginBottom: '150px'}}>
              <span style={styles.number}>
                3
              </span>
              <div style={styles.text}>
                <h2 style={{marginTop: 0}}>Get and give feedback</h2>
                <div style={styles.para}>
                  When your project is finished, we'll collect feedback from your volunteers, and compile it into one page, together with your summary of the event.
                </div>
                <div style={styles.para}>
                  Leave some feedback for your volunteers, it's a great way to share information across charities, and the best way to continue your volunteer's journey into a supporter.
                </div>
              </div>
              <div style={{flex: 6, marginLeft: '30px'}}>
                <img src='https://d3kkowhate9mma.cloudfront.net/d4e8d8a0-5a48-4bd8-84dd-816643cae7e0'
                  style={styles.picture} />
              </div>
            </div>
          </div>
        </div>


        <div style={{position: 'relative'}}>
          <img src={changeImageAddress('https://d3kkowhate9mma.cloudfront.net/feaa6167-0bfa-4eed-b62f-639c94e0d2be', '1800xauto')}
            style={{width: '100%', height: '500px', objectFit: 'cover', position: 'relative'}}/>
          <div style={{position: 'absolute', top: '30%', left: '20%', zIndex: 2,
          display: 'flex', alignItems: 'left', flexDirection: 'column'}}>
            <div style={{fontSize: '44px', lineHeight: '56px', marginBottom: '40px',
              fontWeight: 700, textAlign: 'left', maxWidth: '280px', color: 'white'}}>
              Start creating <br/> your project
            </div>
            <RaisedButton
              onClick={this.handleGetStarted}
                labelStyle={{letterSpacing: '1.5px', fontWeight: 'bold',
              fontFamily: 'Permanent Marker', fontSize: '20px'}} label='Get Started' primary={true}/>
              <SignupModal
                open={this.state.modalOpen}
                changeOpen={this.handleModalChangeOpen}
                onComplete = {this.handleComplete}
                />
          </div>
        </div>
      </div>
    )
  }
}
