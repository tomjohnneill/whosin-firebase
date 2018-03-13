import React from 'react'
import {changeImageAddress, dateDiffInDays} from './desktopproject.jsx'
import {Tick} from './icons.jsx';
import RaisedButton from 'material-ui/RaisedButton';
import AddToCalendar from 'react-add-to-calendar';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import LinearProgress from 'material-ui/LinearProgress';
import FlatButton from 'material-ui/FlatButton';
import {Link} from 'react-router';
import {YouMightLike} from './cantcome.jsx';
import MediaQuery from 'react-responsive';
import fire from '../fire';

let db = fire.firestore()

let icon = { 'calendar-plus': 'left' };

const styles = {

  number: {
    color: '#FF9800',
    fontSize: '20px',

  },
  bottomBit: {
    marginTop: '-5px',
    fontWeight: 'lighter',
    letterSpacing: '1.5px'
  }
}


export default class ProjectJoined extends React.Component{
  constructor(props) {
    super(props)
    this.state = {loading: true}
  }

  componentDidMount(props) {
    db.collection("Project").doc(this.props.params._id).get().then((doc) => {
      var project = doc.data()
      project._id = doc.id
      this.setState({project: project, loading: false, charity: {}})
      this.setState({event: {
              title: project.Name,
             description: project.Summary,
             location: project.Location,
             startTime: project['Start Time'],
             endTime: project['End Time']
      }})
    });

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

  render() {

    console.log(this.state)

    return(
      <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
        {this.state.loading ?
          <div/> :
        <div style={{maxWidth: '1000px', width: '100%', marginTop: 30, padding: 10}}>
          <MediaQuery minDeviceWidth={700}>
            <div style={{display: 'flex'}}>
              <div style={{flex: 2, marginRight: 30}}>

                <Tick color={'#3B9E74'}/>
              </div>
              <div style={{flex: 5}}>
                <div style={{fontSize: '32px', fontWeight: 'bold', textAlign: 'left', marginBottom: 16}}>
                  {this.state.project.Name}
                </div>
                <img src={changeImageAddress(this.state.project['Featured Image'], '750xauto')}
                  style={{width: '100%', height: '220px', objectFit: 'cover'}}
                  />
              </div>
            </div>
          </MediaQuery>
          <MediaQuery maxDeviceWidth={700}>
            <div style={{display: 'flex'}}>
              <div style={{flex: 1, marginRight: 30}}>

                <Tick color={'#3B9E74'}/>
              </div>
              <div style={{flex: 5}}>
                <div style={{fontSize: '32px', fontWeight: 'bold', textAlign: 'left', marginBottom: 16}}>
                  {this.state.project.Name}
                </div>
              </div>
            </div>
            <img src={changeImageAddress(this.state.project['Featured Image'], '750xauto')}
              style={{width: '100%', height: '220px', objectFit: 'cover'}}
              />
          </MediaQuery>
          <div style={{textAlign: 'left'}}>
            <div style={{fontSize: '24px', fontWeight: 'bold', textAlign: 'left', marginBottom: 16, marginTop: 16}}>
              {
                this.state.challenge ?
                `Nice, we'll let ${this.state.challengeUser.Name} know you said yes.`
                :
                "Nice, you're all done."
              }
            </div>
            <div style={{marginBottom: '16px', fontWeight: 'lighter'}}>
              {
                this.state.project['Start Time'] ?
                <div>
                  See you on {!this.state.loading && this.state.project['Start Time'] ? this.state.project['Start Time'].toLocaleString('en-gb', {month: 'long', day: 'numeric'}) : null}, don't forget to let them know if you can't make it.
                </div>
                : null}
            </div>

            <div style={{marginTop: '30px'}}>

              <AddToCalendar
                style={{padding: 16}}
                displayItemIcons={false}
                buttonTemplate={icon} event={this.state.event}/>
            </div>

            <div style={{fontSize: '24px', fontWeight: 'bold', textAlign: 'left', marginBottom: 16, marginTop: 80}}>
              You might also like
            </div>
            <div style={{width: '60%', borderBottom: 'solid 1px #DDDDDD'}}/>


            <YouMightLike project={this.state.project}/>


          </div>
        </div>
      }
      </div>
    )
  }
}
