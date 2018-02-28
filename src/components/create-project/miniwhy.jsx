import React from 'react';
import {browserHistory} from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  card : {
    height: '400px', width: '275px',
    marginRight: '30px',

    borderRadius: 10,
    overflow: 'hidden',
    boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
    boxSizing: 'border-box'
  }
}

export default class MiniWhy extends React.Component {
  handleProject = () => {
    browserHistory.push('/create-project/1')
  }

  render() {
    return (
      <div style={{paddingLeft: '100px', textAlign: 'left'}}>
        <h1 style={{fontFamily: 'Permanent Marker', fontWeight: 'normal'}}>
          Welcome to the next step
        </h1>
        <div style={{display: 'flex', textAlign: 'left'}}>
          <span style={styles.card}>
            <img style={{height: 125, width: '100%', objectFit: 'cover', marginTop: '-1px'}}
              src='https://d3kkowhate9mma.cloudfront.net/8a39e19b-4eda-4269-924e-4d9605968c94'/>
            <div style={{paddingLeft: 40, paddingRight: 40, fontSize: '16px'}}>
              <h2 style={{fontWeight: 700, fontSize: '16px'}}>
                  Why use Who's In?
                </h2>
                Whatever the project, Who's In?
                makes it simple to find new supporters and reach volunteers
                looking to help out with a cause like yours.
            </div>
          </span>

          <span style={styles.card}>
            <img style={{height: 125, width: '100%', objectFit: 'cover'}}
              src='https://d3kkowhate9mma.cloudfront.net/8a39e19b-4eda-4269-924e-4d9605968c94'/>
            <div style={{paddingLeft: 40, paddingRight: 40, fontSize: '16px'}}>
            <h2 style={{fontWeight: 700, fontSize: '16px'}}>
              You're in control
            </h2>
            With Who's In?, you're in control of when and where you run your project,
             how many people you need, and what the maximum number of people you can deal with.
           </div>
          </span>

          <span style={styles.card}>
            <img style={{height: 125, width: '100%', objectFit: 'cover'}}
              src='https://d3kkowhate9mma.cloudfront.net/8a39e19b-4eda-4269-924e-4d9605968c94'/>
            <div style={{paddingLeft: 40, paddingRight: 40, fontSize: '16px'}}>
            <h2 style={{fontWeight: 700, fontSize: '16px'}}>
              We'll help you out
            </h2>
            We offer tools for contacting volunteers, conducting surveys,
            creating compelling impact summaries and demographic statistics for donors.
          </div>
          </span>
        </div>

        <RaisedButton label='Start a Project' onClick={this.handleProject}
            primary={true}
            buttonStyle={{borderRadius: '6px'}}
            style={{borderRadius: '6px', marginTop: 30}}
            labelStyle={{fontSize: '18px', fontWeight: 600, textTransform: 'none'}}
          />
      </div>
    )
  }
}
