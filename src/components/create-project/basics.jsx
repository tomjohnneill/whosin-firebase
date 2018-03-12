import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {  browserHistory } from 'react-router';
import AutoComplete from 'material-ui/AutoComplete';
import scriptLoader from 'react-async-script-loader';
import DatePicker from 'material-ui/DatePicker';
import MediaQuery from 'react-responsive';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Chip from 'material-ui/Chip';

const styles = {
  textfield: {
    height: '40px',
    fontsize: '20px'
  },
  header : {
    margin: '0px',
    padding: '6px',
    fontWeight: 500
  },
  chip: {
        margin: 4,
        cursor: 'pointer'
      },
  selectedChip: {
    margin: 4
  },
      wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
      },
}

var categories = ['Environment', 'Refugees', 'Equality', 'Poverty', 'Education', 'Healthcare',
                    'Disabilities', 'Young People', 'Old People', 'Isolation', 'Animals', 'Outdoor',
                    'Mental Health']

export class Form extends React.Component {
  constructor(props) {
    super(props);
    var basics = JSON.parse(localStorage.getItem('basics'))
    this.state = {
      searchText: '', places: [], loading: true,
      min: basics? basics.min : null,
      max: basics ? basics.max : null,
      deadline: basics? parseISOString(basics.deadline): null,
      tags: basics && basics? basics.tags: [],
      allTags: categories
    }
  }


  handleNext = (e) => {
    e.preventDefault()
    var basics = {min: this.state.min, max: this.state.max, deadline: this.state.deadline, tags: this.state.tags}
    var basicString = JSON.stringify(basics)
    localStorage.setItem('basics', basicString)
    browserHistory.push('/create-project/2')
  }

  handleSetMin = (e) => {
    this.setState({min: e.target.value})
  }

  handleSetMax = (e) => {
    this.setState({max: e.target.value})
  }

  handleSetDeadline = (e, date) => {
    this.setState({deadline: date})
  }

  handleRequestDelete = (key) => {
    const chipToDelete = this.state.tags.indexOf(key);
    var newTags = this.state.tags
    newTags.splice(chipToDelete, 1);

    var allTags = this.state.allTags
    allTags.push(key)
    console.log(allTags)
    this.setState({tags: newTags, allTags: allTags});

  };

  handleAddTag = (key) => {
    const chipToDelete = this.state.allTags.indexOf(key);
    var newAllTags = this.state.allTags
    newAllTags.splice(chipToDelete, 1);
    this.setState({allTags: newAllTags});

    var tags = this.state.tags
    tags.push(key)
    this.setState({tags: tags})


  }

  handleChangeType = (event, index, value) => this.setState({type: value});

  render() {

    return (
      <div className='form' style={{textAlign: 'left', width: '100%'}}>
        <p style={{marginTop: '0px',fontFamily: 'Permanent Marker', fontSize: '32px', textAlign: 'left'}}>
          Let's start with the basics</p>

        <div style={{width: '100%', paddingBottom: '16px', boxSizing: 'border-box'}}>
          <p style={styles.header}>
            How many people are you looking for?
          </p>
          <div style={{display: 'flex'}}>
          <div style={{flex: 1, paddingRight: '6px'}}>
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
          <div style={{flex: 1, paddingLeft: '6px'}}>
            <TextField fullWidth={true}
              inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                paddingLeft: '12px',  boxSizing: 'border-box'}}
              underlineShow={false}
              hintText={'Maximum'}
              hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
              key='max'
              value={this.state.max}
              onChange={this.handleSetMax}
              style={styles.textfield}/>
          </div>
          </div>
        </div>
        <div style={{width: '100%',  paddingBottom: '32px',
           boxSizing: 'border-box'}}>
          <p style={styles.header}>
            When is the deadline for sign ups?
          </p>
          <DatePicker
             style={{borderRadius: '6px', border: '1px solid #858987',paddingLeft: '12px',
                 boxSizing: 'border-box'}}
               underlineShow={false}
               value={this.state.deadline}
               onChange={this.handleSetDeadline}
               hintStyle={{  bottom: '8px'}}
               hintText="Deadline" textFieldStyle={styles.textfield}/>

        </div>
        <div style={{width: '100%',  paddingBottom: '32px',
           boxSizing: 'border-box'}}>
          <p style={styles.header}>
            Which categories best describe your project?
          </p>

          <div style={styles.wrapper}>
            {this.state.tags.map((tag) => (
              <Chip
                key={tag}
                style={styles.selectedChip}
                backgroundColor={'#65A1e7'}
                onRequestDelete={() => this.handleRequestDelete(tag)}
              >
                {tag}
              </Chip>
            ))}
          </div>


          <div style={styles.wrapper}>
            {this.state.allTags.map((tag) => (
              <Chip
                key={tag}
                style={styles.chip}
                onTouchTap={() => this.handleAddTag(tag)}
              >
                {tag}
              </Chip>
            ))}
          </div>

        </div>
        <RaisedButton label='NEXT' backgroundColor='#E55749'
          onClick={this.handleNext}
          disabled={!this.state.deadline || !this.state.min }
          labelStyle={{ color: 'white', fontFamily: 'Permanent Marker', fontSize: '18px', letterSpacing: '1px'}}/>
      </div>
    )
  }
}


function parseISOString(s) {
  var b = s.split(/\D+/);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}

export default class Basics extends React.Component{
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <MediaQuery minDeviceWidth={700}>
          <div style={{display: 'flex', paddingLeft: '100px', paddingTop: '50px', paddingRight: '100px'}}>
            <div style={{maxWidth: '500px', display: 'flex'
              , justifyContent: 'center'}} className='basics-container'>
              <div style={{paddingRight: '50px'}}>
                <Form />
              </div>
            </div>

              <div style={{flex: 1, paddingLeft: '50px', boxSizing: 'border-box'}} className='basics-image'>
                <img src='http://dru-cdn.zipcar.com/sites/default/files/6__milwaukeefarm_4.jpg'
                  style={{width: '100%', height: '70vh', objectFit: 'cover', borderRadius: '10px'}}/>
              </div>

          </div>
        </MediaQuery>
        <MediaQuery maxDeviceWidth={700}>
          <div style={{padding: '16px'}}>
            <Form />
          </div>
        </MediaQuery>
      </div>
    )
  }
}
