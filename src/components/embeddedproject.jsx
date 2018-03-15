import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {Link} from 'react-router';
import {changeImageAddress} from './desktopproject.jsx';
import fire from '../fire';

let db = fire.firestore()

export default class EmbeddedProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loading: true}
  }

  componentDidMount(props) {
    db.collection("Project").doc(this.props.params._id).get().then((doc) => {
      var project = doc.data()
      project._id = doc.id
      console.log(project)
      this.setState({ project: project, loading: false})
    });
  }

  render() {
    return (
      <div>
        {this.state.loading ?
          <div/>
          :
          <Link to={`/projects/p/${this.props.params._id}`} target="_parent">
          <div style={{textAlign: 'left', border: '1px solid #DDDDDD', borderRadius: 2, backgroundColor: 'white',
                boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px'}}>
            <div style={{padding: 24}}>
              Organised by {this.state.project['Charity Name']} with {this.state.project['People Pledged']} supporters
            </div>
            <img src={changeImageAddress(this.state.project['Featured Image'], '500xauto')}
              style={{width: '100%', height: '165px', objectFit: 'cover'}}
              />
            <div style={{fontSize: '24px', fontWeight: 'bold', textAlign: 'left',
               margin: 0, flex: 1, paddingRight: 24, paddingLeft: 24, marginTop: 10}}>
              {this.state.project.Name}
            </div>
            <p style={{fontSize: '16px', fontWeight: 'light', textAlign: 'left', paddingLeft: 24, paddingRight: 24}}>
              {this.state.project.Summary}
            </p>
            <div style={{display: 'flex'}}>
              <div style={{flex: 2, paddingLeft: 24, paddingTop: 24, paddingBottom: 24, display: 'flex', alignItems: 'center'}}>
                <RaisedButton
                  label='See More'
                  primary={true}
                  labelStyle={{paddingLeft: 8, paddingRight: 8,
                     color: 'white', fontFamily: 'Permanent Marker', fontSize: '18px', letterSpacing: '1px'}}
                  />
              </div>

                <div style={{flex: 2, fontFamily: 'Permanent Marker', color: '#FF9800', fontSize: '24px', paddingTop: 24, paddingRight: 24}}>
                  Who's In?
                </div>

            </div>
          </div>
          </Link>
          }
      </div>
    )
  }
}
