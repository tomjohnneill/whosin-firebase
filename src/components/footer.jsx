import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import fire from '../fire';

let db = fire.firestore()

const styles = {
  selectedTab: {
    height: '60px',
    backgroundColor: 'white',
    color: '#FF9800',
    textTransform: 'none',
    fontSize: '16px',
    letterSpacing: '0.4px',
    lineHeight: '16px',
    paddingLeft: '20px',
    paddingRight: '20px',
    fontWeight: 600
  },
  tab: {
    height: '60px',
    backgroundColor: 'white',
    color: '#484848',
    textTransform: 'none',

    fontSize: '16px',
    letterSpacing: '0.4px',
    lineHeight: '16px',
    paddingLeft: '20px',
    paddingRight: '20px',

  },
  mobileSelectedTab: {
    height: '60px',
    backgroundColor: 'white',
    color: '#FF9800',
    textTransform: 'none',
    fontSize: '16px',
    letterSpacing: '0.4px',
    lineHeight: '16px',
    paddingLeft: '10px',
    paddingRight: '10px',
    fontWeight: 600
  },
  mobileTab: {
    height: '60px',
    backgroundColor: 'white',
    color: '#484848',
    textTransform: 'none',

    fontSize: '16px',
    letterSpacing: '0.4px',
    lineHeight: '16px',
    paddingLeft: '10px',
    paddingRight: '10px',

  },
  textfield: {
    height: '40px',
    fontsize: '20px'
  },
  button: {
    fontFamily: 'Permanent Marker',
    fontSize: '18px'
  }
}

export default class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <div style={{height: '311px', backgroundColor: '#F9F9F9', paddingTop: '81px', marginTop: 50,
        paddingLeft: '100px', paddingRight: '100px', display: 'flex', justifyContent: 'center'}}>
        <div style={{flex: 3}}>
          <div style={{paddingBottom: '16px', textAlign: 'left'}}>
            Newsletter
          </div>
          <TextField fullWidth={true}
            onChange={(e, nv) => this.setState({emailSignup: e.target.value})}
            inputStyle={{borderRadius: '2px', border: '1px solid #858987',
              paddingLeft: '12px',  boxSizing: 'border-box'}}
            underlineShow={false}
            type='email'
            hintText={'Email Address'}
            hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
            key='email'
            style={styles.textfield}/>
          <div style={{width: '100%', display: 'flex', alignItems: 'left', paddingTop: '16px'}}>
            <RaisedButton label='Subscribe'
              onClick={() => db.collection("Newsletter").add({email: this.state.emailSignup})}
              backgroundColor='#E55749' labelStyle={{textTransform: 'none', color: 'white'}}/>
          </div>
        </div>
        <div style={{flex: 2}}>
          Address
        </div>
        <div style={{flex: 2}}>
          Contact us
          <br/>

        </div>
        <div style={{flex: 2}}>
          Find us on social media
        </div>
        <div style={{flex: 2}}>
          Terms
        </div>
      </div>
    )
  }
}