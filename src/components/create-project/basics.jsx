import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {  browserHistory } from 'react-router';
import AutoComplete from 'material-ui/AutoComplete';
import scriptLoader from 'react-async-script-loader';
import PlacesAutocomplete from 'react-places-autocomplete';
import DatePicker from 'material-ui/DatePicker';
import MediaQuery from 'react-responsive';

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

const defaultStyles = {
  root: {
    position: 'relative',
    paddingBottom: '0px',
    fontSize: '16px',
    fontFamily: 'Open Sans'
  },
  input: {
    display: 'inline-block',
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    boxSizing: 'border-box',
    borderRadius: '6px',
    border: '1px solid rgb(133, 137, 135)',
    fontFamily: 'Open Sans'
  },
  autocompleteContainer: {
    position: 'absolute',
    top: '100%',
    backgroundColor: 'white',
    border: '1px solid #555555',
    width: '100%',
    zIndex: '5',
    fontFamily: 'Open Sans'
  },
  autocompleteItem: {
    backgroundColor: '#ffffff',
    padding: '10px',
    color: '#555555',
    cursor: 'pointer',
  },
  autocompleteItemActive: {
    backgroundColor: '#fafafa'
  },
}

const options = {
  location: window.google ?
    new window.google.maps.LatLng(51.5, 0.12)
  :null,
  radius: 10000,
}



export class Form extends React.Component {
  constructor(props) {
    super(props);
    var basics = JSON.parse(localStorage.getItem('basics'))
    this.state = {
      searchText: '', places: [], loading: true,
      address: basics ? basics.address : '',
      min: basics? basics.min : null,
      max: basics ? basics.max : null,
      deadline: basics? parseISOString(basics.deadline): null
    }
  }


  debounce = function(func, wait, immediate) {
  	var timeout;
  	return function() {
  		var context = this, args = arguments;
  		var later = function() {
  			timeout = null;
  			if (!immediate) func.apply(context, args);
  		};
  		var callNow = immediate && !timeout;
  		clearTimeout(timeout);
  		timeout = setTimeout(later, wait);
  		if (callNow) func.apply(context, args);
  	};
  };

  onChange = (address) => this.setState({ address })

  handleUpdateInput = (searchText) => {
    this.setState({
        searchText: searchText,
      });
    fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/xml?input=${encodeURIComponent(this.state.searchText)}&types=establishment&location=51.5074,0.1278&radius=10000&key=AIzaSyAw-u3Xed8r9dRXJI47oW8eDuDN8VpikJE` )
    .then(response => response.json())
    .then(function(data) {
      console.log(data)
      var places = data.predictions.map(a => a.description)
      this.setState({rawPlaces: data.predictions})

      this.setState({places: places})
    }.bind(this))
    .catch(error => this.setState({error: error}))
  };

  handleNext = (e) => {
    e.preventDefault()
    var basics = {address: this.state.address, min: this.state.min, max: this.state.max, deadline: this.state.deadline}
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

  render() {
    const inputProps = {
    value: this.state.address,
    onChange: this.onChange,
    placeholder: 'Location'
    }

    return (
      <div className='form' style={{textAlign: 'left', width: '100%'}}>
        <p style={{marginTop: '0px',fontFamily: 'Permanent Marker', fontSize: '32px', textAlign: 'left'}}>
          Let's start with the basics</p>
        <div style={{width: '100%', paddingBottom: '16px', boxSizing: 'border-box'}}>
          <p style={styles.header}>
            Where is this happenning?
          </p>
          <PlacesAutocomplete value={this.state.address}
            styles={defaultStyles} options={options} inputProps={inputProps} />

        </div>
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
        <RaisedButton label='NEXT' backgroundColor='#E55749'
          onClick={this.handleNext}
          disabled={!this.state.deadline || !this.state.min || !this.state.address}
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
