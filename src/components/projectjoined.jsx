import React from 'react'
import {changeImageAddress, dateDiffInDays} from './desktopproject.jsx'
import {Tick} from './icons.jsx';
import RaisedButton from 'material-ui/RaisedButton';
import AddToCalendar from 'react-add-to-calendar';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import LinearProgress from 'material-ui/LinearProgress';
import FlatButton from 'material-ui/FlatButton';
import {Link} from 'react-router';
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

class YouMightLike extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <div style={{paddingLeft: 'auto', paddingRight: 'auto', display: 'flex', marginTop: '60px'
            }}>
            <div style={{width: '60%'}}>
              <Link to={`/projects/${this.props.project.Name}/${this.props.project.id}`}>
            <div >
            <p style={{fontSize: '18px', fontWeight: 'bold', textAlign: 'left', margin: 0, marginBottom: '24px'}}>
              {this.props.project.Name}
            </p>

          </div>

        <div
          ref='variableBox'
          style={{display: 'flex',
              alignItems: 'center', flexDirection: 'row'}}>
        <div style={{height: '130px', width: '95px'}}>
          <img src={changeImageAddress(this.props.project['Featured Image'], '150xauto')}
            style={{height: '130px', width: '95px', objectFit: 'cover'}}
            />
        </div>
        <div style={{ height: '130px', flex: 1}}>
          <CardTitle
            style={{height: '100%', paddingTop: '0px', paddingLeft: '32px',  overflowX:'hidden', paddingBottom: '0px'}}
            children={
              <div style={{justifyContent: 'space-between', display: 'flex', flexDirection: 'column', height: '100%'}}>
                <div>
                  <p style={{fontWeight: '600',  textAlign: 'left', margin: '0px'}}>50 people are in</p>
                  <p style={{fontWeight: 'lighter',  textAlign: 'left', marginTop: '0px', marginBottom: '6px'}}>65 people needed</p>
                  <LinearProgress  style={{height: '5px', borderRadius: '1.5px'}} color={'#00ABE8'} mode="determinate" value={6} />
                </div>
                <div>
                  <div style={{display: 'flex', paddingTop: '6px'}}>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1}}>
                      <div style={styles.bottomBit}>
                        Where
                      </div>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1}}>
                      <div style={styles.bottomBit}>
                        Type
                      </div>
                    </div>
                  </div>
                </div>
              <div>

                  <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <div style={styles.number}>
                      {this.props.project['End Date'] ? dateDiffInDays(new Date(),this.props.project['End Date']) : 10}
                    </div>
                    <div style={{fontWeight: 'lighter', marginLeft: '6px'}}>
                      days to go...
                    </div>
                  </div>
                </div>
                <div>
                </div>
              </div>
            }/>

        </div>

        </div>
        <p style={{fontSize: '14px', fontWeight: 'light', textAlign: 'left'}}>
          {this.props.project.Summary} blah blah blah
        </p>
        <div style={{dispay: 'flex'}}>
          <span style={{fontFamily: 'Permanent Marker', color: '#FF9800' }}>
            Who's In?
          </span>
          <FlatButton style={{marginLeft: '16px'}}
            label='Read More' labelStyle={{color: '#65A1e7', textTransform: 'none'}}/>

        </div>
        <div style={{height: '20px', borderBottom: 'solid 1px #DDDDDD', width: '100%', marginBottom: 1}}/>
        </Link>
        </div>
      </div>
    )

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
    });
        this.setState({event: {
                title: 'Sample Event',
               description: 'This is the sample event provided as an example only',
               location: 'Portland, OR',
               startTime: '2016-09-16T20:15:00-04:00',
               endTime: '2016-09-16T21:45:00-04:00'
        }})

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
            <div style={{fontSize: '24px', fontWeight: 'bold', textAlign: 'left', marginBottom: 16, marginTop: 16}}>
              Nice, you're all done.
            </div>
            <div style={{marginBottom: '16px', fontWeight: 'lighter'}}>
              See you on XXX date, don't forget to let them know if you can't make it.
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
            <YouMightLike project={this.state.project}/>
            <YouMightLike project={this.state.project}/>



          </div>
        </div>
      }
      </div>
    )
  }
}
