import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import MediaQuery from 'react-responsive';
import {  browserHistory } from 'react-router';
import {orange500} from 'material-ui/styles/colors';
import UploadPhoto from './uploadphoto.jsx';

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
    var story = JSON.parse(localStorage.getItem('story'))
    if (story) {
      this.state = {
        title: story.title,
        story: story.story,
        summary: story.summary
      }
    } else {
      this.state = {
        title: null,
        story: null,
        summary: null
      }
    }
  }

  handleNext = (e) => {
    e.preventDefault()

    var story = {title: this.state.title, story: this.state.story, summary: this.state.summary}
    var storyString = JSON.stringify(story)
    localStorage.setItem('story', storyString)
    browserHistory.push('/create-project/summary/1')
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
    this.setState({story: e.target.value})
  }

  handleSetSummary = (e) => {
    this.setState({summary: e.target.value})
    if (e.target.value.length > 200) {
      this.setState({summaryLengthError: true})
    } else {
      this.setState({summaryLengthError: false})
    }
  }

  render() {
    return (
      <div className='form' style={{textAlign: 'left', width: '100%'}}>
        <p style={{marginTop: '0px',fontFamily: 'Permanent Marker', fontSize: '32px', textAlign: 'left'}}>
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
        <RaisedButton label='NEXT' backgroundColor='#E55749'
          onClick={this.handleNext}
          disabled={!this.state.story || !this.state.summary || !this.state.title || !localStorage.getItem('coverPhoto')}
          labelStyle={{ color: 'white', fontFamily: 'Permanent Marker', fontSize: '18px', letterSpacing: '1px'}}/>
        <div style={{width: '16px', display: 'inline-block'}}/>
        <RaisedButton label='Previous' backgroundColor='#C5C8C7'
            onTouchTap={this.handlePrevious}
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
              <StoryForm/>
            </div>
            <div style={{flex: 1, boxSizing: 'border-box', paddingLeft: '100px'}} className='basics-image'>
              <UploadPhoto/>
            </div>
          </div>
        </MediaQuery>
        <MediaQuery maxDeviceWidth={700}>
          <div style={{padding: '16px'}}>
            <StoryForm/>
          </div>
        </MediaQuery>
      </div>
    )
  }
}
