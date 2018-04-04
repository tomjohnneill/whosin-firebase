import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import MediaQuery from 'react-responsive';
import DocumentTitle from 'react-document-title';
import {  browserHistory } from 'react-router';
import {orange500} from 'material-ui/styles/colors';
import UploadPhoto from './uploadphoto.jsx';
import fire from '../../fire';

let db = fire.firestore()

const styles = {
  textfield: {
    height: '40px',
    fontsize: '20px'
  },
  header : {
    margin: '0px',
    padding: '6px',
    fontWeight: 500
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

class StoryForm extends React.Component {
  constructor(props) {
    super(props);
    var story = localStorage.getItem('story')
    var summary = localStorage.getItem('summary')
    this.state = {
      story: story ? story : null,
      summary: summary ? summary : null,
      title: null
    }
  }


  handlePrevious = (e) => {
    e.preventDefault()
    browserHistory.push('/create-project/2')
  }

  handleSetTitle = (e) => {
    this.setState({title: e.target.value})
    console.log(e.target.value.length)
    if (e.target.value.length > 40) {
      this.setState({titleLengthError: true})
    } else {
      this.setState({titleLengthError: false})
    }
  }

  handleSetStory = (e) => {
    localStorage.setItem('story', e.target.value)
    this.setState({story: e.target.value})
  }

  handleSetSummary = (e) => {
    localStorage.setItem('summary', e.target.value)
    this.setState({summary: e.target.value})
    if (e.target.value.length > 200) {
      this.setState({summaryLengthError: true})
    } else {
      this.setState({summaryLengthError: false})
    }
  }

  handleNext = (e) => {
    e.preventDefault()
    var worktoolsToken = localStorage.getItem('worktoolsToken')
    var basics = JSON.parse(localStorage.getItem('basics'))
    var story = {
      story: this.state.story,
      summary: this.state.summary,
      title: this.state.title
    }
    var coverPhoto = localStorage.getItem('coverPhoto')
    var times = JSON.parse(localStorage.getItem('times'))
    var startTime = times ? new Date(times['Start Time']) : null
    var endTime = times ? new Date(times['End Time']) : null
    var body = {
      "Creator": fire.auth().currentUser.uid,
      'Name': story.title,
      'Description': story.story,
      'Summary': story.summary,
      'Target People': basics.min,
      'Maximum People': basics.max,
      'Featured Image': coverPhoto,
      'Deadline': new Date(basics.deadline),
      'Location': times && times.address ? times.address : null,
      'Start Time': startTime,
      'Remote': times && times.Remote ? times.Remote : false,
      'End Time': endTime,
      'Tags': basics.tags,
      "Geopoint": times && times.location ? times.location : null,
      "created": new Date()
    }
    if (localStorage.getItem('charity')) {
      var charity = JSON.parse(localStorage.getItem('charity'))
      body.Charity = charity._id
      body['Charity Name'] = charity.Name
    }
    console.log(body)
    console.log(JSON.stringify(body))
    db.collection("Project").add(body)
    .then(newProject => {
      console.log(newProject)
      localStorage.removeItem('basics')
      localStorage.removeItem('story')
      localStorage.removeItem('times')
      localStorage.removeItem('coverPhoto')
      localStorage.removeItem('charity')
      localStorage.removeItem('editProject')
      browserHistory.push('/projects/p/' + newProject.id + '/completed')
    })
    .catch(error => {this.setState({error: error}); console.log(error)})


    }

  render() {
    return (
      <div className='form' style={{textAlign: 'left', width: '100%'}}>
        <DocumentTitle title='Create Project'/>
          <p className='desktop-header'>
            Tell your story</p>
        <div style={{width: '100%', paddingBottom: '16px', boxSizing: 'border-box'}}>
          <p style={styles.header}>What is the title of your project?</p>
          <TextField fullWidth={true}
            inputStyle={{borderRadius: '6px', border: '1px solid #858987',
              paddingLeft: '12px',  boxSizing: 'border-box'}}
            underlineShow={false}
            errorStyle={{marginTop: 6, color: orange500, textAlign: 'center'}}
            errorText={this.state.titleLengthError ? 'Your title is a bit long, could you make it shorter?' : null}
            hintText={'Project Title'}
            hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
            key='location'
            value={this.state.title}
            onChange={this.handleSetTitle}
            style={styles.textfield}/>
        </div>


        <div style={{width: '100%', paddingBottom: '16px', boxSizing: 'border-box'}}>
          <p style={styles.header}>Project Summary</p>
          <TextField fullWidth={true}
            inputStyle={{borderRadius: '6px', border: '1px solid #858987',
              paddingLeft: '12px',  boxSizing: 'border-box'}}
            underlineShow={false}
            hintText={'A tagline to use on social media etc.'}
            hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
            key='location'
            errorStyle={{color: orange500, marginTop: 6}}
            errorText={this.state.summaryLengthError ? 'Your summary is a bit long, could you make it shorter?' : null}
            value={this.state.summary}
            onChange={this.handleSetSummary}
            style={styles.textfield}/>
        </div>

        <div style={{width: '100%',  paddingBottom: '32px', boxSizing: 'border-box'}}>
          <p style={styles.header}>
            Project Description
          </p>
          <TextField fullWidth={true}
            inputStyle={{borderRadius: '6px', border: '1px solid #858987',
              paddingLeft: '12px',  boxSizing: 'border-box'}}
            underlineShow={false}
            hintText={'Use your project description to share more about what you’re trying to do. It’s up to you to make the case for your project.'}
            multiLine={true}

            value={this.state.story}
            onChange={this.handleSetStory}
            rows={5}
            hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
            key='date'/>
        </div>
        <RaisedButton label='Previous' backgroundColor='#C5C8C7'
            onTouchTap={this.handlePrevious}
            labelStyle={{ color: 'white', fontFamily: 'Permanent Marker', fontSize: '18px', letterSpacing: '1px'}}/>
        <div style={{width: '16px', display: 'inline-block'}}/>
        <RaisedButton label='Finish' backgroundColor='#E55749'
            onClick={this.handleNext}
            disabled={!this.state.story || !this.state.summary || !this.state.title || !localStorage.getItem('coverPhoto')}
            labelStyle={{ color: 'white', fontFamily: 'Permanent Marker', fontSize: '18px', letterSpacing: '1px'}}/>


          <div style={{height: '60px'}}/>
      </div>
    )
  }
}

export default class Story extends React.Component{


  render() {
    return (
      <div>
        <MediaQuery minDeviceWidth={700}>
          <div style={{display: 'flex', paddingLeft: '100px', paddingTop: '50px'}}>
            <div style={{width: '500px', display: 'flex'
              , justifyContent: 'center'}} className='basics-container'>
              <StoryForm edit={this.props.edit}/>
            </div>
            <div style={{flex: 1, boxSizing: 'border-box', paddingLeft: '100px'}} className='basics-image'>
              <UploadPhoto changeParentState={() => this.setState({pictureUploaded: true})}/>
              <div style={{ textAlign: 'left'}}>
                Don't have a photo to hand? We've collected some nice free ones
                <a  style={{color: '#65A1e7', fontWeight: 700 }}
                   href='https://unsplash.com/collections/1881196/volunteering' target='_blank' rel='noopener'> here.</a>
              </div>
            </div>
          </div>
        </MediaQuery>
        <MediaQuery maxDeviceWidth={700}>
          <div style={{flex: 1, boxSizing: 'border-box', padding: 16}} className='basics-image'>
            <UploadPhoto changeParentState={() => this.setState({pictureUploaded: true})}/>
          </div>
          <div style={{padding: '16px'}}>
            <StoryForm/>
          </div>
        </MediaQuery>
      </div>
    )
  }
}
