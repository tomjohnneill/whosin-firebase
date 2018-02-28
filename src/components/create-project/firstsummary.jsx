import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {  browserHistory } from 'react-router';
import {Tick} from '../icons.jsx';

const styles = {
  textfield: {
    height: '40px',
    fontsize: '20px'
  },
  header : {
    margin: '0px',
    padding: '6px',
    fontWeight: 700,
    color: '#6B6B6B'
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

export default class FirstSummary extends React.Component{
  constructor(props) {
    super(props);
  }

  handleNext = (e) => {
    e.preventDefault()
    browserHistory.push('/create-project/organisation')
  }


    handlePrevious = (e) => {
      e.preventDefault()
      browserHistory.push('/create-project/3')
    }

  render() {
    return (
      <div style={{display: 'flex', paddingLeft: '100px', paddingTop: '50px', paddingRight: '100px'}}>
        <div style={{width: '500px', display: 'flex'
          , justifyContent: 'center'}} className='basics-container'>
          <div className='form' style={{textAlign: 'left', width: '100%'}}>
            <p style={{marginTop: '0px',fontFamily: 'Permanent Marker', fontSize: '32px', textAlign: 'left'}}>
              Just one more step</p>
            <div style={{width: '100%', paddingBottom: '16px',
              paddingRight: '50px', boxSizing: 'border-box', display: 'flex'}}>
              <div style={{flex: 1}}>
                <p style={styles.header}>Step 1</p>
                <div style={{paddingLeft: '16px', paddingTop: '16px'}}>
                  The Basics, The Story, The Photo
                </div>
              </div>
              <div style={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Tick color={'#3B9E74'} style={{height: '50px'}}/>
              </div>
            </div>
            <hr/>
            <div style={{width: '100%',  paddingBottom: '32px',
              paddingRight: '50px', boxSizing: 'border-box'}}>
              <p style={styles.header}>
                Step 2
              </p>
              <div style={{paddingLeft: '16px', paddingTop: '16px'}}>
                Use our smart algorithm to fill your organisation details for you.
              </div>
            </div>
            <RaisedButton label='Continue' backgroundColor='#E55749'
              onTouchTap={this.handleNext}
              labelStyle={{ color: 'white', fontFamily: 'Permanent Marker', fontSize: '18px', letterSpacing: '1px'}}/>
            <div style={{width: '16px', display: 'inline-block'}}/>
            <RaisedButton label='Previous' backgroundColor='#C5C8C7'
                onTouchTap={this.handlePrevious}
                labelStyle={{ color: 'white', fontFamily: 'Permanent Marker', fontSize: '18px', letterSpacing: '1px'}}/>
          </div>
        </div>
        <div style={{flex: 1, paddingLeft: '50px', boxSizing: 'border-box'}} className='basics-image'>
          <img src={'http://www.cityam.com/assets/uploads/main-image/cam_standard_article_main_image/further-protests-against-president-trumps-travel-ban-take-place-across-the-uk-633783390-58ab04e6f1432.jpg'}
            style={{width: '100%', height: '70vh', objectFit: 'cover', borderRadius: '10px'}}/>
        </div>
      </div>
    )
  }
}
