import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import {Plant, Spiral} from './icons.jsx';
import {grey500} from 'material-ui/styles/colors'
import MediaQuery from 'react-responsive';
import fire from '../fire';

let db = fire.firestore()

const styles = {
  number: {
    color: '#FF9800',
    fontSize: '20px',
  },
  bottomBit: {
    color: grey500,
    marginTop: '-5px',
    fontSize: '12px'
  },
  textfield: {
    height: '40px',
    fontsize: '20px'
  }
}

export default  class SignupModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {type: 'signup', loading: false, pwned: null}
  }

  handleName = (e,  newValue) => {
    this.setState({name: newValue})
  }


  handleEmail = (e, newValue) => {
    this.setState({email: newValue})
  }

  handlePassword = (e, newValue) => {
    this.setState({password: newValue})
  }

  handleCreateAccount = () => {
    fetch(`https://api.pwnedpasswords.com/pwnedpassword/${this.state.password}`)
    .then(response => {
      if (response.status === 200) {
        response.text().then(text => {
          console.log(text);
          this.setState({pwned: text})
        });

      } else {
        this.setState({pwned: null})
        fire.auth().onAuthStateChanged(user => {
          if (user) {
            db.collection('User').doc(user.uid).set(
              {
                Email: user.email,
                Name: this.state.name
              }
            )
            .then(data =>
              {
                if (this.props.onComplete) {
                  this.props.onComplete()
                }
              })
          } else {
            // No user is signed in.
          }
        });
        fire.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
          });


      }
    })


  }

  handleLogin = () => {
    fire.auth().onAuthStateChanged(user => {
      if (user) {
        if (this.props.onComplete) {
          this.props.onComplete()
        }
      } else {
        // No user is signed in.
      }
    });
    fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });
  }

  handleSwitchType = (e) => {
    e.preventDefault()
    if (this.state.type === 'login') {
      this.setState({type: 'signup'})
    } else {
      this.setState({type: 'login'})
    }
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.handleCreateAccount()
    }
  }

  handleLoginKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.handleLogin()
    }
  }

  render() {


    return (
      <div>
        <MediaQuery minDeviceWidth={700}>
          <Dialog
            open={this.props.open ? true : false}
            modal={false}

            onRequestClose={this.props.changeOpen}
            contentStyle={{width: '90%', maxWidth: '350px', overflowY: 'auto'}}
            >
            {this.state.loading  ?
            <div style={{width: '100%', height: '100%', position: 'absolute', top: '0px',left: '0px',zIndex: '20', boxSizing: 'border-box', backgroundColor: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <CircularProgress/>
            </div>
            : null }
            <div>
              {this.state.type === 'signup' ?
            <span
                style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>


                  <Plant style={{marginBottom: '16px', height: '80px'}}/>
                  <div style={{paddingBottom: '16px'}}>
                    Create your Account
                  </div>
                  <div style={{width: '100%',  paddingBottom: '16px',
                     boxSizing: 'border-box'}}>
                    <TextField fullWidth={true}
                      inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                        paddingLeft: '12px',  boxSizing: 'border-box'}}
                      underlineShow={false}
                      hintText={'Name'}
                      hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                      key='name'
                      onChange={this.handleName}
                      style={styles.textfield}/>
                  </div>
                  <div style={{width: '100%',paddingBottom: '16px',
                    boxSizing: 'border-box'}}>
                    <TextField fullWidth={true}
                      inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                        paddingLeft: '12px',  boxSizing: 'border-box'}}
                      underlineShow={false}
                      hintText={'Email'}
                      onChange={this.handleEmail}
                      hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                      key='email'
                      style={styles.textfield}/>
                  </div>
                  <div style={{width: '100%',  paddingBottom: '16px',
                     boxSizing: 'border-box'}}>
                    <TextField fullWidth={true}
                      inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                        paddingLeft: '12px',  boxSizing: 'border-box'}}
                      underlineShow={false}
                      onChange={this.handlePassword}
                      errorStyle={{marginTop: 6, textAlign: 'center'}}
                      errorText={this.state.pwned === null  ? null : `That password has been leaked ${this.state.pwned.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} times, try something else`}
                      onChange={this.handlePassword}
                      type='password'
                      hintText={'Password'}
                      onKeyPress={this.handleKeyPress}
                      hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                      key='password'
                      style={styles.textfield}/>
                  </div>
                  <div style={{width: '100%', boxSizing: 'border-box', backfaceVisibility: 'inherit'
                    ,borderRadius: '10px', paddingBottom: '20px'}}>
                    <RaisedButton fullWidth={true}
                      backgroundColor={this.state.email && this.state.password && this.state.name ?  '#E55749' : '#C5C8C7'}
                      buttonStyle={{borderRadius: '6px'}}
                      onClick={this.handleCreateAccount}

                      labelStyle={{textTransform: 'none',display: 'inline-flex', alignItems: 'center', height: '100%'}}
                      labelColor='white' label='Complete' style={{height: '50px'}}
                      />
                  </div>
                  <div>
                    Or switch to <b onTouchTap={this.handleSwitchType} style={{color: '#E55749'}}>Login</b>
                  </div>

            </span>

            :

            <span
                style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>


                  <Spiral style={{marginBottom: '16px', height: '80px'}}/>
                  <div style={{paddingBottom: '16px'}}>
                    Login
                  </div>


                  <div style={{width: '100%',paddingBottom: '16px',
                    boxSizing: 'border-box'}}>
                    <TextField fullWidth={true}
                      inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                        paddingLeft: '12px',  boxSizing: 'border-box'}}
                      underlineShow={false}
                      hintText={'Email'}
                      onChange={this.handleEmail}
                      hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                      key='email'
                      style={styles.textfield}/>
                  </div>
                  <div style={{width: '100%',  paddingBottom: '16px',
                     boxSizing: 'border-box'}}>
                    <TextField fullWidth={true}
                      inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                        paddingLeft: '12px',  boxSizing: 'border-box'}}
                      underlineShow={false}
                      onChange={this.handlePassword}
                      type='password'
                      hintText={'Password'}
                      onKeyPress={this.handleLoginKeyPress}
                      hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                      key='password'
                      style={styles.textfield}/>
                  </div>
                  <div style={{width: '100%', boxSizing: 'border-box', backfaceVisibility: 'inherit'
                    ,borderRadius: '10px', paddingBottom: '20px'}}>
                    <RaisedButton fullWidth={true}
                      backgroundColor={this.state.email && this.state.password  ?  '#E55749' : '#C5C8C7'}
                      buttonStyle={{borderRadius: '6px'}}
                      onTouchTap={this.handleLogin}
                      labelStyle={{textTransform: 'none',display: 'inline-flex', alignItems: 'center', height: '100%'}}
                      labelColor='white' label='Go' style={{height: '50px'}}
                      />
                  </div>
                  <div>
                    Or switch to <b onTouchTap={this.handleSwitchType} style={{cursor: 'pointer',color: '#E55749'}}>
                    {this.state.type === 'login' ? 'Sign up' : 'Login'}</b>
                  </div>

            </span>


          }

          </div>

          </Dialog>
        </MediaQuery>
        <MediaQuery maxDeviceWidth={700}>
          <div style={{backgroundColor: 'white', zIndex: 10, marginTop: 10, display: this.props.open ? 'inherit' : 'none', width: '100%', position: 'relative',
          boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px', borderRadius: 6, padding: 10, boxSizing: 'border-box'}}>
          {this.state.loading  ?
          <div style={{width: '100%', height: '100%', position: 'absolute', top: '0px',left: '0px',zIndex: '20', boxSizing: 'border-box', backgroundColor: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <CircularProgress/>
          </div>
          : null }
          <div>
            {this.state.type === 'signup' ?
          <span
              style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>


                <Plant style={{marginBottom: '16px', height: '80px'}}/>
                <div style={{paddingBottom: '16px'}}>
                  Create your Account
                </div>
                <div style={{width: '100%',  paddingBottom: '16px',
                   boxSizing: 'border-box'}}>
                  <TextField fullWidth={true}
                    inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                      paddingLeft: '12px',  boxSizing: 'border-box'}}
                    underlineShow={false}
                    hintText={'Name'}
                    hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                    key='name'
                    onChange={this.handleName}
                    style={styles.textfield}/>
                </div>
                <div style={{width: '100%',paddingBottom: '16px',
                  boxSizing: 'border-box'}}>
                  <TextField fullWidth={true}
                    inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                      paddingLeft: '12px',  boxSizing: 'border-box'}}
                    underlineShow={false}
                    hintText={'Email'}
                    onChange={this.handleEmail}
                    hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                    key='email'
                    style={styles.textfield}/>
                </div>
                <div style={{width: '100%',  paddingBottom: '16px',
                   boxSizing: 'border-box'}}>
                  <TextField fullWidth={true}
                    inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                      paddingLeft: '12px',  boxSizing: 'border-box'}}
                    underlineShow={false}
                    onChange={this.handlePassword}
                    errorStyle={{marginTop: 6, textAlign: 'center'}}
                    errorText={this.state.pwned === null  ? null : `That password has been leaked ${this.state.pwned.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} times, try something else`}
                    onChange={this.handlePassword}
                    type='password'
                    hintText={'Password'}
                    onKeyPress={this.handleKeyPress}
                    hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                    key='password'
                    style={styles.textfield}/>
                </div>
                <div style={{width: '100%', boxSizing: 'border-box', backfaceVisibility: 'inherit'
                  ,borderRadius: '10px', paddingBottom: '20px'}}>
                  <RaisedButton fullWidth={true}
                    backgroundColor={this.state.email && this.state.password && this.state.name ?  '#E55749' : '#C5C8C7'}
                    buttonStyle={{borderRadius: '6px'}}
                    onClick={this.handleCreateAccount}

                    labelStyle={{textTransform: 'none',display: 'inline-flex', alignItems: 'center', height: '100%'}}
                    labelColor='white' label='Complete' style={{height: '50px'}}
                    />
                </div>
                <div>
                  Or switch to <b onTouchTap={this.handleSwitchType} style={{color: '#E55749'}}>Login</b>
                </div>

          </span>

          :

          <span
              style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>


                <Spiral style={{marginBottom: '16px', height: '80px'}}/>
                <div style={{paddingBottom: '16px'}}>
                  Login
                </div>


                <div style={{width: '100%',paddingBottom: '16px',
                  boxSizing: 'border-box'}}>
                  <TextField fullWidth={true}
                    inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                      paddingLeft: '12px',  boxSizing: 'border-box'}}
                    underlineShow={false}
                    hintText={'Email'}
                    onChange={this.handleEmail}
                    hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                    key='email'
                    style={styles.textfield}/>
                </div>
                <div style={{width: '100%',  paddingBottom: '16px',
                   boxSizing: 'border-box'}}>
                  <TextField fullWidth={true}
                    inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                      paddingLeft: '12px',  boxSizing: 'border-box'}}
                    underlineShow={false}
                    onChange={this.handlePassword}
                    type='password'
                    hintText={'Password'}
                    onKeyPress={this.handleLoginKeyPress}
                    hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                    key='password'
                    style={styles.textfield}/>
                </div>
                <div style={{width: '100%', boxSizing: 'border-box', backfaceVisibility: 'inherit'
                  ,borderRadius: '10px', paddingBottom: '20px'}}>
                  <RaisedButton fullWidth={true}
                    backgroundColor={this.state.email && this.state.password  ?  '#E55749' : '#C5C8C7'}
                    buttonStyle={{borderRadius: '6px'}}
                    onTouchTap={this.handleLogin}
                    labelStyle={{textTransform: 'none',display: 'inline-flex', alignItems: 'center', height: '100%'}}
                    labelColor='white' label='Go' style={{height: '50px'}}
                    />
                </div>
                <div>
                  Or switch to <b onTouchTap={this.handleSwitchType} style={{cursor: 'pointer',color: '#E55749'}}>
                  {this.state.type === 'login' ? 'Sign up' : 'Login'}</b>
                </div>

          </span>


        }
      </div>
      </div>



        </MediaQuery>
      </div>
    )
  }
}
