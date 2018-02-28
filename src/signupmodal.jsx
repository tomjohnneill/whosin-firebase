import React , {PropTypes} from 'react';
import {grey200, grey500, grey100, amber500, grey300, lightBlue50} from 'material-ui/styles/colors'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import MediaQuery from 'react-responsive';
import Dialog from 'material-ui/Dialog';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import Subheader from 'material-ui/Subheader';


export default  class SignupModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {login: true, loading: false}
  }

  handleSwitchType = (e) => {
    e.preventDefault()
    var login = this.state.login
    this.setState({login: !login})
  }

  handleFacebookJoin = (e) => {

  }

  handleEmailLogin = (e) => {

}

handleEmailSignUp = (e) => {
  this.setState({loading: false})
}

handlePassword = (e, newValue) => {
  this.setState({password: newValue})
  }

handleEmail = (e, newValue) => {
  this.setState({email: newValue})

}

handleName = (e, newValue) => {
  this.setState({name: newValue})

}

  render() {


    return (
      <div>
        <Dialog
          open={this.props.open ? true : false}
          modal={false}
          onRequestClose={this.props.changeOpen}
          contentStyle={{width: '90%', maxWidth: '300px'}}
          >
          {this.state.loading  ?
          <div style={{width: '100%', height: '100%', position: 'absolute', top: '0px',left: '0px',zIndex: '20', boxSizing: 'border-box', backgroundColor: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <CircularProgress/>
          </div>
          : null }
          <div style={{fontSize: '25px', letterSpacing: '-0.6px', lineHeight: '30px', color: '#484848',
          fontWeight: 700, textAlign: 'center'}}>
            {this.state.login ? "Log into Who's In" : "Sign up to Who's In"}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '16px', textAlign: 'center'}} >
            <div style={{width: '100%'}}>
              <div style={{height: '12px'}}/>

          <RaisedButton

            icon={<FontIcon color='white' style={{marginRight: '16px'}} className="fa fa-facebook-official fa-2x" />}
              secondary={true} fullWidth={true} label={this.state.login ? "Log In" : "Sign Up"}
              onTouchTap={this.handleFacebookJoin}
              labelStyle={{height: '36px',
                   letterSpacing: '0.6px', fontWeight: 'bold'}}  />
                   <div style={{fontSize: '8pt', textAlign: 'center', color:grey500, marginTop: '8px'}}>

                      This does not allow us to post to Facebook without your permission
                    </div>
<div style={{height: '12px'}}/>
           <div style={{width: '100%'}}>-- or --
             </div>


             {this.state.login ? null :
               <div>
            <div style={{height: '12px'}}/>
              <TextField underlineShow={false}
                inputStyle={{border:"1px solid lightgrey", borderRadius: "3px",
                  boxShadow: "1px 1px 1px 0px lightgrey", textIndent: '5px'
                }}
                hintText={'Full Name'}
                hintStyle={{textIndent: '5px'}}
                type='name'
                id = 'fullname'
                value={this.state.name}
                onChange={this.handleName}
                fullWidth={true}/>
              </div>

            }

              <div style={{height: '12px'}}/>
               <TextField underlineShow={false}
                 inputStyle={{border:"1px solid lightgrey", borderRadius: "3px",
                   boxShadow: "1px 1px 1px 0px lightgrey", textIndent: '5px'
                 }}
                 hintText={'Email'}
                 hintStyle={{textIndent: '5px'}}
                 type='email'
                 id='email'
                 value={this.state.email}
                 onChange={this.handleEmail}
                 fullWidth={true}/>

             <div style={{height: '12px'}}/>
               <TextField fullWidth={true}
                 underlineShow={false}
                 inputStyle={{border:"1px solid lightgrey", borderRadius: "3px",
                   boxShadow: "1px 1px 1px 0px lightgrey", textIndent: '5px'
                 }}
                 hintStyle={{textIndent: '5px'}}
                 type='password'
                 id='password'
                 value={this.state.password}
                 onChange={this.handlePassword}
                 hintText={'Password'}
                 />

             <div style={{height: '12px'}}/>

               <RaisedButton
                 labelStyle={{height: '36px',
                      letterSpacing: '0.6px', fontWeight: 'bold'}}
                onTouchTap = {this.state.login ? this.handleEmailLogin : this.handleEmailSignUp}
                 primary={true} fullWidth={true} label={this.state.login ? "Log In" : "Sign Up"}  />
             </div>

           </div>
           <div style={{textAlign: 'center', width: '100%'}}>
             Or <b style={{width: 'auto', color: '#0068B2'}} onTouchTap={this.handleSwitchType}>{!this.state.login ? "Log In" : "Sign up"}</b>
           </div>
        </Dialog>
      </div>
    )
  }
}
