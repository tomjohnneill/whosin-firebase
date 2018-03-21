import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {Link} from 'react-router';
import {changeImageAddress} from './desktopproject.jsx';
import {Spiral, CalendarIcon, Place, Clock, World, Tick} from './icons.jsx';
import fire from '../fire';

let db = fire.firestore()

export default class EmbeddedProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loading: true}
  }

  componentDidMount(props) {
    var projectId = this.props.params && this.props.params._id ? this.props.params._id : this.props.projectId

    if (this.props.project) {
      let project = this.props.project
      if (typeof project['Start Time'] === 'string') {
        project['Start Time'] = new Date(project['Start Time'])
        project['End Time'] = new Date(project['End Time'])
      }
      this.setState({project: project, loading: false})
      if (project.Charity) {
        db.collection("Charity").doc(project.Charity.toString()).get().then((charityDoc) => {
            var charity = charityDoc.data() ? charityDoc.data() : {}
            charity._id = charityDoc.id
            this.setState({ project: project, charity: charity, loading: false})
          })
          .catch(error => console.log('Error', error))
      }
    } else {
      db.collection("Project").doc(projectId).get().then((doc) => {
        var project = doc.data()
        project._id = doc.id
        this.setState({ project: project, loading: false})
        if (project.Charity) {
          db.collection("Charity").doc(project.Charity.toString()).get().then((charityDoc) => {
              var charity = charityDoc.data() ? charityDoc.data() : {}
              charity._id = charityDoc.id
              this.setState({ charity: charity})
            })
            .catch(error => console.log('Error', error))
        }
      })
      .catch(error => console.log('Error', error));
    }


  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      let project = nextProps.project
      if (typeof project['Start Time'] === 'string') {
        project['Start Time'] = new Date(project['Start Time'])
        project['End Time'] = new Date(project['End Time'])
      }
      this.setState({project: nextProps.project, loading: false})

      if (project.Charity) {
        db.collection("Charity").doc(project.Charity.toString()).get().then((charityDoc) => {
            var charity = charityDoc.data() ? charityDoc.data() : {}
            charity._id = charityDoc.id
            this.setState({ project: project, charity: charity, loading: false})
          })
          .catch(error => console.log('Error', error))
        }
    }
  }

  render() {
    return (
      <div>
        {this.state.loading ?
          <div/>
          :
          <div onClick={() => localStorage.setItem('project', JSON.stringify(this.state.project))} style={{backgroundColor: 'white', borderRadius: 8, overflow: 'hidden', border: '1px solid #DDDDDD', paddingBottom: 24}}>
          <Link to={`/projects/p/${this.state.project._id}`} target="_parent">
            <img src={changeImageAddress(this.state.project['Featured Image'], '500xauto')}
              style={{width: '100%', height: '170px', objectFit: 'cover'}}
              />
            <div style={{paddingLeft: 24, paddingRight: 24}}>
                  <div style={{fontSize: '32px', fontWeight: 'bold', textAlign: 'left',
                     margin: 0, marginTop: 10}}>
                    {this.state.project.Name}
                  </div>
                  {this.state.charity ?
                  <div className='charity-link-content'
                     style={{display: 'flex', marginTop: 6, alignItems: 'center'}}>
                    <div style={{marginRight: 10}} className='charity-icon'>
                      {this.state.charity['Featured Image'] ?
                        <img src={changeImageAddress(this.state.charity['Featured Image'], '50xauto')}
                          style={{height: 25, width: 25, borderRadius: '50%', objectFit: 'cover'}}/>
                        :
                        <World style={{height: 25, width: 25}} color={'#484848'}/>
                        }
                    </div>
                    <p className='charity-name' style={{margin: 0, fontSize: '14px'}}>
                        {this.state.charity.Name}
                    </p>
                  </div>
                  :
                  null}

                <p style={{fontSize: '18px', fontWeight: 'light', textAlign: 'left'}}>
                  {this.state.project.Summary}
                </p>

                {this.state.project['Start Time'] ?
                <div style={{display: 'flex',
                   paddingTop: 10, textAlign: 'left'}}
                  className='datetime-container'>
                  <div className='date-container' style={{alignItems: 'center', display: 'flex'}}>
                    <div className='date-icon'>
                      <CalendarIcon color={'black'} style={{height: 20, width: 20, marginRight: 10}}/>
                    </div>
                    <div style={{fontSize: '12px'}}>
                      {this.state.project['Start Time'].toLocaleString('en-gb',
                        {weekday: 'long', month: 'long', day: 'numeric'})}
                    </div>
                  </div>
                  <div className='time-container' style={{alignItems: 'center', display: 'flex', marginLeft: 24}}>
                    <div className='time-icon'>
                      <Clock color={'black'} style={{height: 20, width: 20, marginRight: 10}}/>
                    </div>
                    <div style={{fontSize: '12px'}} >
                      {this.state.project['Start Time'].toLocaleString('en-gb',
                        {hour: '2-digit', minute: '2-digit'})} -
                        {this.state.project['End Time'].toLocaleString('en-gb',
                          {hour: '2-digit', minute: '2-digit'})}
                    </div>
                  </div>
                </div>
                : null}
                <div>
                  {this.state.project.Location ?
                    <div className='location-container'
                      style={{alignItems: 'center', display: 'flex', marginTop: 6}}>
                      <div className='location-icon'>
                        <Place color={'black'} style={{height: 20, width: 20, marginRight: 10}}/>
                      </div>
                      <div style={{textAlign: 'left', fontSize: '12px'}}>
                        {this.state.project.Location}
                      </div>
                    </div>
                    : null
                  }
                </div>

                {(this.props.location && this.props.location.query.noLogo) || this.props.noLogo ? null :
                <div style={{display: 'flex'}}>
                  <div style={{flex: 2, paddingLeft: 24, paddingTop: 24, paddingBottom: 24, display: 'flex', alignItems: 'center'}}>
                    <RaisedButton
                      label='See More'
                      primary={true}
                      labelStyle={{paddingLeft: 8, paddingRight: 8,
                         color: 'white', fontFamily: 'Permanent Marker', fontSize: '18px', letterSpacing: '1px'}}
                      />
                  </div>

                    <div style={{flex: 2, fontFamily: 'Permanent Marker', color: '#E55749', fontSize: '24px', paddingTop: 24, paddingRight: 24}}>
                      Who's In?
                    </div>

                </div>
                }
              </div>
            </Link>
        </div>

          }
      </div>
    )
  }
}
