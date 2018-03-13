import React from 'react';
import Dropzone from 'react-dropzone';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import {Link, browserHistory} from 'react-router';
import {Spiral, Tick} from './icons.jsx';
import {grey500} from 'material-ui/styles/colors';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import {Tabs, Tab} from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
import {PhotoUpload} from './profile.jsx';
import Snackbar from 'material-ui/Snackbar';
import FirebaseAuth from './auth/firebaseauth.jsx';
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
    fontFamily: 'Open Sans',
    backgroundColor: 'white',
    color: '#484848',
    textTransform: 'none',

    fontSize: '16px',
    letterSpacing: '0.4px',
    lineHeight: '16px',
    paddingLeft: '20px',
    paddingRight: '20px',

  },
  textField: {
    height: '36px'
  },
  title : {
    fontWeight: 700, marginBottom: 6, marginTop: 16, display: 'flex'
  }
}

export default class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loading: true, selected: 'projects'}
  }

  changeAnchorEl = (e) => {
    console.log('handleMultipleChoiceClick')
    e.preventDefault()
    console.log(e)
    var rect = e.target.getBoundingClientRect()
    console.log(rect)
    this.setState({inkBarLeft: (rect.width-100)/2  + rect.x - (window.document.body.clientWidth - 1000) /2,
    })
  }

  handleTwoTabClick = (value) => {
    this.setState({selected: value})
  }

  handleSetName = (e, nv) => {
    console.log(e.target.value)
    var user = this.state.user
    user['Name'] = e.target.value
    this.setState({user: user})
  }

  handleSetEmail = (e, nv) => {
    console.log(e.target.value)
    var user = this.state.user
    user['Email'] = e.target.value
    this.setState({user: user})
  }

  handleSetLocation = (e, nv) => {
    console.log(e.target.value)
    var user = this.state.user
    user['Location'] = e.target.value
    this.setState({user: user})
  }

  componentDidMount(props) {
    fire.auth().onAuthStateChanged((user) => {
          var userId
          var publicProfile = true
          if (this.props.params._id) {
            userId = this.props.params._id
            if (user.uid === this.props.params._id) {
              publicProfile = false
            }
          } else if (user) {
            userId = user.uid
            publicProfile = false
          } else {
            userId = null
          }
          this.setState({userId: userId, publicProfile: publicProfile})
          console.log(this.state)

          db.collection("User").doc(userId).get().then((doc) => {
            var user = doc.data()
            user._id = doc.id
            if (!user.privacy) {
              user.privacy = {
                "Email": false,
                "Picture": false,
                "Name" : true,
                "Location": true
              }
            }
            this.setState({user: user, loading: false, engagements: [], reviews: []})
          });
        })
    }


    changeImage = (imageUrl) => {
      var user = this.state.user
      user['Picture'] = imageUrl
      this.setState({user: user})
    }

  updateCheck(type) {
    var privacy = this.state.user.privacy
    var user = this.state.user
    privacy[type] = !privacy[type]
    user.privacy = privacy
    this.setState({user : user})
  }

  handleSaveChanges = (e) => {
    e.preventDefault()
    db.collection("User").doc(fire.auth().currentUser.uid).update(
      this.state.user
    ).then((docRef) => {
      this.setState({open: true})
    })
  }

  handleRequestClose = () => {
    this.setState({open: false})
  }

  render() {
    console.log(this.state)
    return (
      <div>
        {this.state.loading ?
          null
          :
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 30}}>
            <div style={{width: '100%', maxWidth: '1000px', position: 'relative',
              backgroundColor: 'white'}}>
              <h2 style={{textAlign: 'left', position: 'relative'}}>Your Profile</h2>
              <div style={{position: 'absolute', right: 0, top:20}}>
                <RaisedButton
                  label='Back to Profile'
                  labelStyle={{fontWeight: 700, textTransform: 'none'}}
                  secondary={true} onClick={() => browserHistory.push('/profile')}/>
              </div>
              <Tabs
                  tabItemContainerStyle={{height: '60px', backgroundColor: 'white', borderBottom: '1px solid #DDDDDD'}}
                  value={this.props.params.tab}
                  onChange={this.handleTwoTabClick}
                  inkBarStyle={{zIndex: 2, backgroundColor: '#FF9800',
                  left:this.state.inkBarLeft, width: '100px'}}
                >
                  <Tab label="Public Profile"
                    style={{width: 'auto', fontSize: '16px'}}
                      onTouchTap={this.changeAnchorEl}
                        buttonStyle={this.state.selected === 'projects' ? styles.selectedTab : styles.tab}
                     value="projects">
                    <div style={{width: '50%', minWidth: '300px', padding: 16}}>
                      <span style={styles.title}>Picture</span>

                      <div style={{display: 'flex', alignItems: 'center'}}>
                        <div style={{width: '100%'}}>
                        {this.state.user.Picture ?
                        <img style={{height: '200px', width: '200px', objectFit: 'cover', borderRadius: '4px'}}
                          src={this.state.user.Picture ? this.state.user.Picture : null}/>
                        :
                        !this.state.publicProfile ?
                        <PhotoUpload changeImage={this.changeImage} userId={this.state.userId}/>
                        :
                        <div style={{height: '200px', width: '200px', backgroundColor: '#DDDDDD'}}/>
                        }
                        </div>
                        <Checkbox
                          style={{marginLeft: '10px', width: '20%'}}
                          checked={this.state.user.privacy.Picture}
                          onCheck={this.updateCheck.bind(this, 'Picture')}
                          label="Public"
                          />
                      </div>

                      <span style={styles.title}>Name</span>
                      <div style={{display: 'flex', alignItems: 'center'}}>
                        <TextField fullWidth={true}
                          inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                            paddingLeft: '12px',  boxSizing: 'border-box'}}
                          underlineShow={false}
                          hintText={'Full Name'}
                          value={this.state.user.Name}
                          hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                          key='min'
                          onChange={this.handleSetName}
                          style={styles.textfield}/>
                        <Checkbox
                          style={{width: '20%', marginLeft: '10px'}}
                          checked={this.state.user.privacy.Name}
                          onCheck={this.updateCheck.bind(this, 'Name')}
                          label="Public"
                          />
                      </div>

                      <span style={styles.title}>Email</span>
                      <div style={{display: 'flex', alignItems: 'center'}}>
                        <TextField fullWidth={true}
                          inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                            paddingLeft: '12px',  boxSizing: 'border-box'}}
                          underlineShow={false}
                          hintText={'Minimum'}
                          value={this.state.user.Email}
                          hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                          key='min'
                          onChange={this.handleSetEmail}
                          style={styles.textfield}/>
                        <Checkbox
                          style={{width: '20%', marginLeft: '10px'}}
                          checked={this.state.user.privacy.Email}
                          onCheck={this.updateCheck.bind(this, 'Email')}
                          label="Public"
                          />
                      </div>

                      <span style={styles.title}>Location</span>
                      <div style={{display: 'flex', alignItems: 'center', marginBottom: 30}}>
                        <TextField fullWidth={true}
                          inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                            paddingLeft: '12px',  boxSizing: 'border-box'}}
                          underlineShow={false}
                          hintText={'Minimum'}
                          value={this.state.user.Location}
                          hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                          key='min'
                          onChange={this.handleSetLocation}
                          style={styles.textfield}/>
                        <Checkbox
                          style={{width: '20%', marginLeft: '10px'}}
                          checked={this.state.user.privacy.Location}
                          onCheck={this.updateCheck.bind(this, 'Location')}
                          label="Public"
                          />
                      </div>

                      <RaisedButton style={{marginBottom: 30}} label='Save Changes'
                        labelStyle={{fontWeight: 700, textTransform: 'none'}}
                        primary={true}
                        onClick={this.handleSaveChanges}
                        />
                    </div>
                  </Tab>

                  <Tab
                    style={{width: 'auto', fontSize: '16px'}}
                    onTouchTap={this.changeAnchorEl}
                    buttonStyle={this.state.selected === 'about' ? styles.selectedTab : styles.tab}
                     label="More Information"  value="about">
                     <div style={{width: '50%', minWidth: '300px', padding: 16}}>
                       <i style={{color: grey500}}>If you share this information with project organisers, it helps them apply for funding for their organisations. We will never show it publically.</i>
                       <span style={styles.title}>Name</span>
                         <SelectField
                          floatingLabelText="Frequency"
                          value={this.state.value}
                          onChange={this.handleChange}
                        >
                          <MenuItem value={1} primaryText="Never" />
                          <MenuItem value={2} primaryText="Every Night" />
                          <MenuItem value={3} primaryText="Weeknights" />
                          <MenuItem value={4} primaryText="Weekends" />
                          <MenuItem value={5} primaryText="Weekly" />
                        </SelectField>

                       <span style={styles.title}>Email</span>
                       <TextField fullWidth={true}
                         inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                           paddingLeft: '12px',  boxSizing: 'border-box'}}
                         underlineShow={false}
                         hintText={'Email'}
                         value={this.state.min}
                         hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                         key='min'
                         onChange={this.handleSetMin}
                         style={styles.textfield}/>

                       <span style={styles.title}>Name</span>
                       <TextField fullWidth={true}
                         inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                           paddingLeft: '12px',  boxSizing: 'border-box'}}
                         underlineShow={false}
                         hintText={'Minimum'}
                         value={this.state.min}
                         hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                         key='min'
                         onChange={this.handleSetMin}
                         style={styles.textfield}/>
                     </div>
                  </Tab>

                  <Tab
                    style={{width: 'auto', fontSize: '16px'}}
                    onTouchTap={this.changeAnchorEl}
                    buttonStyle={this.state.selected === 'supporters' ? styles.selectedTab : styles.tab}
                     label="Verification"  value="supporters">
                    <FirebaseAuth/>
                  </Tab>
                </Tabs>
            </div>
          </div>
        }
        <Snackbar
          open={this.state.open}
          message="Profile Updated"
          autoHideDuration={3000}
          onRequestClose={this.handleRequestClose}
        />
      </div>
    )
  }
}
