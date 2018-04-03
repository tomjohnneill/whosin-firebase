import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {changeImageAddress} from '../desktopproject.jsx';
import {  browserHistory } from 'react-router';



export default class ReviewOverview extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <div style={{width: '100%', boxSizing: 'border-box', padding: 24, maxWidth: '600px',
        display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <h2>
            You've been left a review!
          </h2>
          <div style={{borderRadius: '50%', border: 'solid 5px #F76B1C', width: '200px', height: '200px', overflow: 'hidden'}}>
            <img src={changeImageAddress('https://d3kkowhate9mma.cloudfront.net/e5ad2d71-5fed-41b8-a1bb-c6583fc77afa', '500xauto')}
              style={{objectFit: 'cover', height: '200px', width: '200px'}}/>
          </div>
          <div style={{marginTop: 16, fontSize: '20px', fontWeight: 700, color: '#3B9E74'}}>

          </div>

          <h2>
            Write one back to see it
          </h2>
          <div style={{display: 'flex'}}>
            <div style={{flex: 1, padding: 16}}>
              <div
                onTouchTap={() => browserHistory.push(window.location.pathname + '/short')}
                style={{marginBottom: 16, padding: 16, boxSizing: 'border-box', cursor: 'pointer',  borderRadius: '4px', width: '100%', color: 'white',
                   transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms', boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
                  backgroundColor: '#E55749',letterSpacing: '0.6px', fontWeight: 'bold', textTransform: 'uppercase'}}
                >
                Leave one back
              </div>



            </div>

          </div>
        </div>

      </div>
    )
  }
}
