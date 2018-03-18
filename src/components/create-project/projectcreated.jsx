import React from 'react'
import {changeImageAddress, dateDiffInDays} from '../desktopproject.jsx'
import {Tick} from '../icons.jsx';
import RaisedButton from 'material-ui/RaisedButton';
import AddToCalendar from 'react-add-to-calendar';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import LinearProgress from 'material-ui/LinearProgress';
import FlatButton from 'material-ui/FlatButton';
import {Link, browserHistory} from 'react-router'
import fire from '../../fire';

let db = fire.firestore()

let icon = { 'calendar-plus': 'left' };

const styles = {

  number: {
    color: '#E55749',
    fontSize: '20px',

  },
  bottomBit: {
    marginTop: '-5px',
    fontWeight: 'lighter',
    letterSpacing: '1.5px'
  }
}



export default class ProjectCreated extends React.Component{
  constructor(props) {
    super(props)
    this.state = {loading: true}
  }

  componentDidMount(props) {
    db.collection("Project").doc(this.props.params._id).get().then((doc) => {
      console.log(doc.data())
      this.setState({project: doc.data(), charity:{}, loading: false})
    });

      this.setState({event: {
              title: 'Sample Event',
             description: 'This is the sample event provided as an example only',
             location: 'Portland, OR',
             startTime: '2016-09-16T20:15:00-04:00',
             endTime: '2016-09-16T21:45:00-04:00'
      }})
  }

  handleGoToProject = (e) => {
    e.preventDefault()
    browserHistory.push(`/projects/${this.state.project.Name}/${this.props.params._id}`)
  }

  render() {

    console.log(this.state)

    return(
      <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
        {this.state.loading ?
          <div/> :
        <div style={{maxWidth: '1000px', width: '100%', marginTop: 30}}>

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
          <div style={{textAlign: 'left'}}>
            <div style={{width: '60%'}}>
              <div style={{display: 'inline-block',fontSize: '24px', fontWeight: 'bold', textAlign: 'left', marginBottom: 16, marginTop: 16}}>
                Nice, you've started a project.
              </div>
              <div style={{float: 'right', height: '64.8px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <RaisedButton backgroundColor={'#65A1e7'} onTouchTap={this.handleGoToProject}
                  labelStyle={{color: 'white', fontFamily: 'Permanent Marker', padding: '10px', fontSize: '20px'}}
                   label='Go to project'/>
              </div>
            </div>
            <div style={{marginBottom: '16px', fontWeight: 'lighter'}}>
              Now the fun really starts.
            </div>
            <div style={{marginTop: '30px'}}>

              <AddToCalendar
                style={{padding: 16}}
                displayItemIcons={false}
                buttonTemplate={icon} event={this.state.event}/>
            </div>



            <div style={{width: '60%', borderBottom: 'solid 1px #DDDDDD'}}/>

            <div>
              What can you do next?
            </div>

            <div>
              Add some extra details
            </div>

            <div>
              <li>
                <ul>Facebook page</ul>
                <ul>Twitter page</ul>
                <ul>Instagram page</ul>
                <ul>Instagram page</ul>
              </li>
            </div>

            <div>
              Add some 'requirements'
            </div>
            <div>
              Go to form page
            </div>
            <div>
              Instant Sign up toggle
            </div>

            <div>
              Find some people!
            </div>

            <div style={{display: 'flex'}}>
              <div>
                Facebook
              </div>
              <div>
                Twitter
              </div>
            </div>

          </div>
        </div>
      }
      </div>
    )
  }
}
