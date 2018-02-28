import React from 'react';
import {lightBlue50} from 'material-ui/styles/colors'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import MediaQuery from 'react-responsive';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import Subheader from 'material-ui/Subheader';
import Slider from 'material-ui/Slider';
import Share from './share.jsx'



export default  class JoiningModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {login: true, loading: false, slider: 50}
  }

  handleSlider = (e, v) => {
    this.setState({slider: v})
  }

  handleSwitchType = (e) => {
    e.preventDefault()
    var login = this.state.login
    this.setState({login: !login})
  }

  handleFinalJoin = (e) => {
    e.preventDefault()
    this.props.changeOpen()

  }

  render() {
    console.log(window.navigator)

    return (
      <div>
        <Dialog
          open={this.props.open ? true : false}
          modal={false}
          onRequestClose={this.props.changeOpen}
          contentStyle={{width: '90%', maxWidth: '350px'}}
          >
          {this.state.loading  ?
          <div style={{width: '100%', height: '100%', position: 'absolute', top: '0px',left: '0px',zIndex: '20', boxSizing: 'border-box', backgroundColor: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <CircularProgress/>
          </div>
          : null }

          <div style={{ display: 'flex', justifyContent: 'center', padding: '16px', textAlign: 'center'}} >
            <div style={{width: '100%'}}>
              <div style={{height: '12px'}}/>



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

            <div>
              <b>How likely are you to come?</b>
            </div>

            <div style={{display: 'flex', marginBottom: '-20px', marginTop: '16px'}}>
              <div style={{flex: 1, marginLeft: '-20px', textAlign: 'left'}}>
                Probably not
              </div>
              <div style={{flex: 1, marginRight: '-20px', textAlign: 'right'}}>
                Definitely
              </div>
            </div>
            <Slider
              min={0}
              max={100}
              value={this.state.slider}
              onChange={this.handleSlider}
              />

              <div>
                <b>Don't want to come alone?</b>
              </div>


              <div style={{height: '12px'}}/>



             <div style={{height: '12px'}}/>

              <Share
                Name={this.props.Name}
                smsbody={encodeURIComponent("I'm thinking of going to this event, can you come with me? ") + window.location.href}
                emailbody={`Hi%20there%2C%0A%0AI%20just%20agreed%20to%20go%20to%20this%20event%3A%20%22${this.props.Name}%22%2C%20but%20don%27t%20really%20want%20to%20go%20to%20it%20by%20myself.%20%0A%0AIf%20you%20come%20with%20me%2C%20we%20could%20both%20do%20something%20good.%20You%20can%20read%20a%20bit%20more%20about%20it%20here%3A%0A%0A${window.location.href}%0A%0AThanks!%0A%0A` + "name"}

                />

            <RaisedButton style={{marginTop: '24px'}}
              primary={true}
              label='Join' onTouchTap={this.handleFinalJoin}/>
             </div>

           </div>

        </Dialog>
      </div>
    )
  }
}
