import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {changeImageAddress} from './desktopproject.jsx';
import LinearProgress from 'material-ui/LinearProgress';
import { Link } from 'react-router';
import MediaQuery from 'react-responsive';
import fire from '../fire';

let db = fire.firestore()



const styles = {
  button : {
    fontFamily: 'Permanent Marker',
    fontSize: '20px',
    lineHeight: '36px'
  }
}

export default class AllProjects extends React.Component {
  constructor(props) {
    super(props)
    this.state = {loading: true}
  }

  componentDidMount(props) {
    db.collection("Project").get().then((querySnapshot) => {
      var data = []
      querySnapshot.forEach((doc) => {
        console.log(doc.data())
        var elem = doc.data()
        elem['_id'] = doc.id
        data.push(elem)
      });
      this.setState({projects: data, loading: false})
    });


  }

  render() {
    return (
      <div>
        <MediaQuery minDeviceWidth={700}>
          <div style={{position: 'sticky', top: '0px', display: 'flex', paddingLeft: 100, zIndex: 10, paddingRight: 100
            , background: 'linear-gradient(0deg, #ffffff, #f7f7f7)', paddingTop: 20, paddingBottom: 20, borderBottom: '1px solid #DDDDDD'}}>
            <RaisedButton style={{marginRight: '20px', height: '36px'}} label='Dates' secondary={true} labelStyle={styles.button}/>
            <RaisedButton  style={{marginRight: '20px', height: '36px'}} label='Type' secondary={true} labelStyle={styles.button}/>
            <TextField/>
          </div>
        </MediaQuery>
        <MediaQuery maxDeviceWidth={700}>
          <div style={{position: 'sticky', top: '0px', display: 'flex', paddingLeft: 16, zIndex: 10, paddingRight: 10
            , background: 'linear-gradient(0deg, #ffffff, #f7f7f7)', paddingTop: 20, paddingBottom: 20, borderBottom: '1px solid #DDDDDD'}}>
            <RaisedButton style={{marginRight: '20px', height: '36px'}} label='Dates' secondary={true} labelStyle={styles.button}/>
            <RaisedButton  style={{marginRight: '20px', height: '36px'}} label='Type' secondary={true} labelStyle={styles.button}/>
            <TextField/>
          </div>
        </MediaQuery>
        <div>
          <MediaQuery minDeviceWidth={700}>
            <h1 style={{fontFamily: 'Permanent Marker', textAlign: 'left', paddingLeft: '100px'}}>
              All Projects</h1>
            {this.state.loading ?
              <div>
                Loading...
              </div>
              :
              this.state.projects ?
              <div style={{display: 'flex', flexWrap: 'wrap', paddingLeft: '80px', paddingRight: '80px',
              textAlign: 'left'}}>
                {this.state.projects.map((project) => (
                  <Link to={`/projects/${project['Name']}/${project._id}`}>
                    <div style={{width: '230px', height: '250px', margin: 20}}>
                      <img src={changeImageAddress(project['Featured Image'], '250xauto')}
                        style={{width: '100%', height: '180px',objectFit: 'cover', borderRadius: '4px'}}/>
                      <span style={{display: 'inline-block',fontWeight: 100, textTransform: 'uppercase'}}>
                        {project.Location ? project.Location.replace(/(([^\s]+\s\s*){3})(.*)/,"$1…") : null}
                      </span>
                      <LinearProgress
                        min={0}
                        mode={'determinate'}
                        max={10}
                        value={Math.random()*10}
                        color={'#65A1e7'}
                        style={{marginTop: 6, marginBottom: 6}}
                        />
                      <span style={{fontWeight: 600, display: 'inline-block'}}>
                        {project.Name}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              :
              null
            }
          </MediaQuery>
          <MediaQuery maxDeviceWidth={700}>
            <h1 style={{fontFamily: 'Permanent Marker', textAlign: 'left', paddingLeft: '16px'}}>
              All Projects</h1>
            {this.state.loading ?
              <div>
                Loading...
              </div>
              :
              this.state.projects ?
              <div style={{display: 'flex', flexWrap: 'wrap', paddingLeft: '10px', paddingRight: '10px',
              textAlign: 'left'}}>
                {this.state.projects.map((project) => (
                  <Link to={`/projects/${project['Name']}/${project._id}`}>
                    <div style={{width: '130px', height: '150px', margin: 20}}>
                      <img src={changeImageAddress(project['Featured Image'], '250xauto')}
                        style={{width: '100%', height: '100px',objectFit: 'cover', borderRadius: '4px'}}/>
                      <span style={{display: 'inline-block',fontWeight: 100, textTransform: 'uppercase'}}>
                        {project.Location ? project.Location.replace(/(([^\s]+\s\s*){3})(.*)/,"$1…") : null}
                      </span>
                      <LinearProgress
                        min={0}
                        mode={'determinate'}
                        max={10}
                        value={Math.random()*10}
                        color={'#65A1e7'}
                        style={{marginTop: 6, marginBottom: 6}}
                        />
                      <span style={{fontWeight: 600, display: 'inline-block'}}>
                        {project.Name}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              :
              null
            }
          </MediaQuery>
        </div>
      </div>
    )
  }
}
