import React , {PropTypes} from 'react';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import MediaQuery from 'react-responsive';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import Subheader from 'material-ui/Subheader';
import Slider from 'material-ui/Slider';
import Share from './share.jsx'
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import {blue500, yellow600, orange600, red600, blueGrey600} from 'material-ui/styles/colors';
import {grey200, grey500, grey100, amber500, blue200} from 'material-ui/styles/colors';
import CheckboxIcon from 'material-ui/svg-icons/toggle/check-box';
import RadioButtonIcon from 'material-ui/svg-icons/toggle/radio-button-checked';
import TextIcon from 'material-ui/svg-icons/content/text-format';
import Photo from 'material-ui/svg-icons/image/photo';
import People from 'material-ui/svg-icons/social/people';
import LocationOn from 'material-ui/svg-icons/communication/location-on';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import FontIcon from 'material-ui/FontIcon';

const styles = {
  option : {
    fontFamily: 'Permanent Marker',
    fontSize: '18px'
  }
}

export default  class ConditionalModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {login: true, loading: false, slider: 50, type: null}
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

  handleFriendsClick = (e) => {
    e.preventDefault()
    this.setState({type: 'friends'})
  }

  render() {
    console.log(window.navigator)

    return (
      <div>
        <Dialog
          open={this.props.open ? true : false}
          modal={false}
          onRequestClose={this.props.changeOpen}
          contentStyle={{width: '90%', maxWidth: '450px'}}
          >
          {this.state.loading  ?
          <div style={{width: '100%', height: '100%', position: 'absolute', top: '0px',left: '0px',zIndex: '20', boxSizing: 'border-box', backgroundColor: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <CircularProgress/>
          </div>
          : null }

          <div style={{ display: 'flex', justifyContent: 'center', padding: '16px', textAlign: 'center'}} >
            <div style={{width: '100%'}}>
              <div style={{height: '12px'}}/>



             {this.state.type === 'friends' ?
               <div>
                 <Subheader style={{fontFamily: 'Permanent Marker', fontSize: '24px', textAlign: 'left', padding: 0}}>
                   Go on then, ask them:
                 </Subheader>
                 <Share
                   Name={this.props.project.Name}
                   smsbody={encodeURIComponent("I'm thinking of going to this event, can you come with me? ") + window.location.href}
                   emailbody={`Hi%20there%2C%0A%0AI%20just%20agreed%20to%20go%20to%20this%20event%3A%20%22${this.props.project.Name}%22%2C%20but%20don%27t%20really%20want%20to%20go%20to%20it%20by%20myself.%20%0A%0AIf%20you%20come%20with%20me%2C%20we%20could%20both%20do%20something%20good.%20You%20can%20read%20a%20bit%20more%20about%20it%20here%3A%0A%0A${window.location.href}%0A%0AThanks!%0A%0A` + "name"}
                   />
               </div>

                :

              this.state.type === 'half' ?

              <div>
                Half
              </div>

              :


              <div>

                <List style={{fontWeight: 200, textAlign: 'left', textTransform: 'lowercase'}}>
                  <Subheader style={{fontFamily: 'Permanent Marker', fontSize: '24px'}}>I'll do it if...</Subheader>
                  <ListItem
                    leftAvatar={<Avatar icon={<People/>} backgroundColor={blue500} />}
                    onTouchTap={this.handleFriendsClick}
                    primaryText="2 of my Friends Come"

                  />
                  <ListItem
                    leftAvatar={<Avatar icon={<FontIcon className='fas fa-bullseye' />} backgroundColor={yellow600} />}
                    onTouchTap={this.handleMultipleChoiceClick}
                    primaryText="25 people sign up"

                  />

                </List>


          </div>

            }
             </div>

           </div>

        </Dialog>
      </div>
    )
  }
}
