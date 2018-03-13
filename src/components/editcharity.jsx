import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {Tabs, Tab} from 'material-ui/Tabs';
import Dropzone from 'react-dropzone';
import Checkbox from 'material-ui/Checkbox';
import SelectField from 'material-ui/SelectField';
import {Link, browserHistory} from 'react-router';
import Avatar from 'material-ui/Avatar';
import TextField from 'material-ui/TextField';
import {grey500} from 'material-ui/styles/colors';
import FontIcon from 'material-ui/FontIcon';
import {changeImageAddress} from './profile.jsx';
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


class CharityPhotoUpload extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  upload(file, rej) {
    console.log(this.state)
    console.log(file)
    console.log(rej)

    fetch('https://3ymyhum5sh.execute-api.eu-west-2.amazonaws.com/prod/getS3Url')
      .then(response => response.json())
      .then(function(data) {
        var stripped = data.substring(data.indexOf('amazonaws.com/') + 14, data.indexOf('?'))
        var imageUrl = 'https://d3kkowhate9mma.cloudfront.net/' + stripped


        console.log(changeImageAddress(imageUrl, '250xauto'))
        this.setState({imageUrl: imageUrl})
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                console.log(xhr.responseText);
                var body = {
                  'Featured Image': imageUrl
                }
                db.collection("Charity").doc(this.props.charityId).update(body)
                this.props.changeImage(imageUrl)
            }
        }.bind(this)

        xhr.open('PUT', data , true);
        xhr.setRequestHeader('Content-Type', file[0].type);
        xhr.send(file[0]);
      }.bind(this))

      .catch(error => this.setState({ error }));

  }

  render() {
    console.log(this.props)


    return (
      <div>
        <Dropzone key={'photos'} onDrop={this.upload.bind(this)}  style={{}}>
              {({ isDragActive, isDragReject }) => {
                let styles = {
                  width: 'auto',
                  height: 100,
                  textAlign: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid rgb(133, 137, 135)',
                  borderRadius: 6,
                  color: grey500,
                  padding: 16,
                  boxSizing: 'border-box',
                  width: 250,
                  marginBottom: 16

                }

                const acceptedStyles = {
                  ...styles,
                  borderStyle: 'solid',
                  borderColor: '#6c6',
                  backgroundColor: '#eee'
                }

                const rejectStyles = {
                  ...styles,
                  borderStyle: 'solid',
                  borderColor: '#c66',
                  backgroundColor: '#eee'
                }

                if (isDragActive) {
                  return (
                    <div style={acceptedStyles}>
                      File will be accepted
                    </div>
                  )
                }
                if (isDragReject) {
                  return (
                    <div style={rejectStyles}>
                      File will be rejected
                    </div>
                  )
                }
                // Default case
                return (
                  <div style={styles}>
                    Drag and drop (or click) to upload
                  </div>
                )
              }}
            </Dropzone>
      </div>
    )
  }
}

export default class EditCharity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loading: true}
  }

  componentDidMount(props) {
    db.collection("Charity").doc(this.props.params.charityId).get().then((doc) => {
      var data = doc.data()
      this.setState({charity: data, loading: false})
    })
  }

  handleTwoTabClick = (value) => {
    this.setState({selected: value})
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

  updateCheck(type) {
    var privacy = this.state.user.privacy
    var user = this.state.user
    privacy[type] = !privacy[type]
    user.privacy = privacy
    this.setState({user : user})
  }

  changeImage = (imageUrl) => {
    var charity = this.state.charity
    charity['Featured Image'] = imageUrl
    this.setState({charity: charity})
  }

  render() {
    return (
      <div>
        {this.state.loading ?
          null
          :
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 30}}>
            <div style={{width: '100%', maxWidth: '1000px', position: 'relative',
              backgroundColor: 'white'}}>
              <h2 style={{textAlign: 'left', position: 'relative'}}>Charity Profile</h2>
              <div style={{position: 'absolute', right: 0, top:20}}>
                <RaisedButton
                  label='Back to Profile'
                  labelStyle={{fontWeight: 700, textTransform: 'none'}}
                  secondary={true} onClick={() => browserHistory.push(window.location.pathname.replace('/edit', ''))}/>
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
                        {this.state.charity['Featured Image']?
                        <img style={{height: '200px', width: 'auto', objectFit: 'cover', borderRadius: '4px'}}
                          src={this.state.charity ? this.state.charity['Featured Image'] : null}/>
                        :
                        !this.state.publicProfile ?
                        <CharityPhotoUpload changeImage={this.changeImage} charityId={this.props.params.charityId}/>
                        :
                        <div style={{height: '200px', width: '200px', backgroundColor: '#DDDDDD'}}/>
                        }
                        </div>

                      </div>

                      <span style={styles.title}>Name</span>
                      <div style={{display: 'flex', alignItems: 'center'}}>
                        <TextField fullWidth={true}
                          inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                            paddingLeft: '12px',  boxSizing: 'border-box'}}
                          underlineShow={false}
                          hintText={'Full Name'}
                          value={this.state.charity.Name}
                          hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                          key='min'
                          onChange={this.handleSetName}
                          style={styles.textfield}/>

                      </div>

                      <span style={styles.title}>Email</span>
                      <div style={{display: 'flex', alignItems: 'center'}}>
                        <TextField fullWidth={true}
                          inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                            paddingLeft: '12px',  boxSizing: 'border-box'}}
                          underlineShow={false}
                          hintText={'Minimum'}
                          value={this.state.charity.Email}
                          hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                          key='min'
                          onChange={this.handleSetEmail}
                          style={styles.textfield}/>

                      </div>

                      <span style={styles.title}>Location</span>
                      <div style={{display: 'flex', alignItems: 'center', marginBottom: 30}}>
                        <TextField fullWidth={true}
                          inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                            paddingLeft: '12px',  boxSizing: 'border-box'}}
                          underlineShow={false}
                          hintText={'Minimum'}
                          value={this.state.charity.Location}
                          hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                          key='min'
                          onChange={this.handleSetLocation}
                          style={styles.textfield}/>

                      </div>

                      <RaisedButton style={{marginBottom: 30}} label='Save Changes'
                        labelStyle={{fontWeight: 700, textTransform: 'none'}}
                        primary={true}
                        onClick={this.handleSaveChanges}
                        />
                    </div>
                  </Tab>


                </Tabs>
            </div>
          </div>
        }
      </div>
    )
  }
}
