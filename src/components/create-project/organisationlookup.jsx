import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {  browserHistory } from 'react-router';
import AutoComplete from 'material-ui/AutoComplete';
import CircularProgress from 'material-ui/CircularProgress';
import Search from 'material-ui/svg-icons/action/search';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import fire from '../../fire';

let db = fire.firestore()



const styles = {
  textfield: {
    height: '40px',
    fontsize: '20px',
    boxSizing: 'border-box'
  },
  whiteTextfield : {
    backgroundColor: 'rgb(255,255,255)',
    height: '40px',

  },
  unfilledTextField: {
    backgroundColor: 'rgba(101, 161, 231, 0.15)',
    height: '40px',
    borderRadius: 6
  },
  header : {
    margin: '0px',
    padding: '6px',
    fontWeight: 700
  }
}

function parseISOString(s) {
  var b = s.split(/\D+/);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
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


export default class OrganisationLookup extends React.Component{
  constructor(props) {
    super(props);
    this.state = {searchText: '', charities: [], loading: false, stage: 0}
  }

  loadPlacesApi() {

  }

  componentDidMount(props) {
    this.loadPlacesApi()
  }

  handleClose = () => {
    this.setState({error: null});
  };

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

  fetchCharities = () => {
    console.log('fetching')
    fetch('https://charitybase.uk/api/v0.2.0/charities?search=' + encodeURIComponent(this.state.searchText))
    .then(response => response.json())
    .then(function(data) {
      var charities = data.charities.map(a => a.name)
      this.setState({rawCharities: data.charities})
      this.setState({charities: []})
      this.setState({charities: charities})
    }.bind(this))
    .catch(error => this.setState({error}))
  }

  handleUpdateInput = (searchText) => {


    this.setState({
      searchText: searchText,
    });

    this.debounce(this.fetchCharities(), 500)


    };

  handleNewRequest = (string, v) => {
    console.log(string)
    console.log(this.state.rawCharities)
    var newArray = this.state.rawCharities.filter(function (el) {
      return el.name === string
      });
    console.log(newArray)
    this.setState({loading: true})
    fetch(`https://charitybase.uk/api/v0.2.0/charities?search=${string}&fields=beta.activities,favicon,mainCharity,charityNumber,contact&limit=1`)
    .then(response => response.json())
    .then(data => {this.setState({details: data.charities ? data.charities[0] : {}});
      var charity = data.charities[0]
      this.setState({
        activities: charity.beta ? charity.beta.activities : null,
        email: charity.mainCharity ? charity.mainCharity.email : null,
        website: charity.mainCharity ? charity.mainCharity.website : null,
        phone: charity.contact ? charity.contact.phone : null,
        address: charity.contact ? charity.contact.address.toString() : null,
        postcode: charity.contact ? charity.contact.postcode : null,
        charityNumber: charity.charityNumber,
        logo: charity.favicon,
        loading: false
      })
    }
  )
    };

  changeCharityInfo (id, e, nv) {
    console.log(id)
    console.log(nv)
    console.log(e)
    this.setState({[id]: nv})
  }


  handleNext = (e) => {
    e.preventDefault()
    var worktoolsToken = localStorage.getItem('worktoolsToken')
    var basics = JSON.parse(localStorage.getItem('basics'))
    var story = JSON.parse(localStorage.getItem('story'))
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
      'Location': times ? times.address : null,
      'Start Time': startTime,
      'End Time': endTime,
      'Tags': basics.tags,
      "Geopoint": times ? times.location : null,
      "created": new Date()
    }
    console.log(body)
    console.log(JSON.stringify(body))


    var charityBody = {
      'Name': this.state.searchText ,
      'Summary': this.state.activities ? this.state.activities : null,
      'Description': this.state.activities ? this.state.activities : null ,
      'Website': this.state.website ? this.state.website : null ,
      'Email': this.state.email ? this.state.email : null,
      'Address': this.state.address ? this.state.address: null,
      'Logo': this.state.logo ? this.state.logo : null,
      'Phone': this.state.phone ? this.state.phone : null,
      'Postcode': this.state.postcode ? this.state.postcode : null,
      'Charity Number': this.state.charityNumber ? this.state.charityNumber : null,
      'Facebook': this.state.facebook ? this.state.facebook : null,
      'Instagram': this.state.instagram ? this.state.instagram : null,
      'Twitter': this.state.twitter ? this.state.twitter: null,
      "Owner": fire.auth().currentUser.uid
    }
    if (this.state.charityNumber) {
      db.collection("Charity").doc(this.state.charityNumber.toString()).set(charityBody, {merge: true})
      .then(docRef => {
        body.Charity = this.state.charityNumber.toString()
        body['Charity Name'] = this.state.searchText
        db.collection("Project").add(body)
        .then(newProject => {
          console.log(newProject)
          browserHistory.push('/projects/p/' + newProject.id + '/completed')
        })
          })
      .catch(error => {this.setState({error: error}); console.log(error)})

    } else {
      db.collection("Charity").add(charityBody)
      .then(docRef => {
        body.Charity = docRef.id
        body['Charity Name'] = this.state.searchText
        if (localStorage.getItem('editProject')) {
          db.collection("Project").doc(localStorage.getItem('editProject')).update(body)
          .then(newProject => {
            console.log(newProject)
            browserHistory.push('/projects/p/' + newProject.id + '/completed')
          })
        } else {
          db.collection("Project").add(body)
          .then(newProject => {
            console.log(newProject)
            browserHistory.push('/projects/p/' + newProject.id + '/completed')
          })
        }

          })
      .catch(error => {this.setState({error: error}); console.log(error)})
    }

    /*
    localStorage.removeItem('basics')
    localStorage.removeItem('story')
    localStorage.removeItem('times')
    localStorage.removeItem('coverPhoto')
    localStorage.removeItem('editProject')
    */
  }

  handleFill = (e) => {
    console.log(this.state.details)
    e.preventDefault()
    if (!this.state.details) {
      this.setState({loading: true})
    }
    this.setState({stage: 1})
  }

  render() {
    console.log(this.state)
    return (
      <div style={{display: 'flex', paddingLeft: '100px', paddingTop: '50px', paddingRight: '100px'}}>
        <div style={{width: '500px', display: 'flex'
          , justifyContent: 'center'}} className='basics-container'>
          <div className='form' style={{textAlign: 'center', paddingLeft: '50px', paddingRight: '50px'}}>
            <p style={{marginTop: '0px',fontFamily: 'Permanent Marker', fontSize: '32px'}}>
              Add your details</p>
            <div style={{width: '100%', paddingBottom: '16px', boxSizing: 'border-box'}}>
              <p style={{margin: '0px', paddingRight: '24px', paddingLeft: '24px', paddingBottom: '16px'}}>
              First, type your organisation's name, then we'll see if we can find your details for you.
              </p>
              <AutoComplete
                fullWidth={true}
                inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                  paddingLeft: '12px',  boxSizing: 'border-box', height: '40px'}}
                hintText="Type your organisation name or charity number"
                searchText={this.state.searchText}
                underlineShow={false}
                hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                onUpdateInput={this.handleUpdateInput}
                onNewRequest={this.handleNewRequest}
                dataSource={this.state.charities}
                openOnFocus={true}
                textFieldStyle={{height: '40px'}}
                style={styles.textfield}
                filter={(searchText, key) => true}
              />
            </div>
            <div >
              {this.state.stage === 1 && !this.state.loading ?
                <div>
                <div style={{height: '40px'}}/>
              <RaisedButton label='Save and Continue' primary={true}
                onTouchTap={this.handleNext}
                fullWidth={true}
                labelStyle={{ color: 'white', fontFamily: 'Permanent Marker', fontSize: '18px', letterSpacing: '1px'}}
                />

              </div>
              :
              <div>
                <RaisedButton label='Smart Fill' backgroundColor='#E55749'
                  onTouchTap={this.handleFill}
                  fullWidth={true}
                  disabled={!this.state.searchText}
                  labelStyle={{ color: 'white', fontFamily: 'Permanent Marker', fontSize: '18px', letterSpacing: '1px'}}/>
                <FlatButton style={{marginTop: '16px'}} label='Fill in by hand' labelStyle={{color: '#4A90E2', textTransform: 'none'}}
                  onTouchTap={(e) => {this.setState({stage: 1, loading: false, details: {}})}}
                  fullWidth={true}/>
              </div>
            }
            </div>
          </div>
        </div>
        <div style={{flex: 1, width: '100%', marginLeft: '50px', boxSizing: 'border-box', minHeight: '70vh'}} className='basics-image'>
          {this.state.stage === 0 ?
            <div style={{backgroundColor: '#F5F5F5',display: 'flex', alignItems: 'center', flexDirection: 'column', height: '70vh', justifyContent: 'center'}} >

                <Search style={{height: '100px', width: '100px'}} color='rgb(0,0,0)'/>
                <p style={{width: '100%', marginTop: '16px'}}>
                  We'll try and find your details for you
                </p>
            </div>
            :
            this.state.loading ?
            <div style={{minHeight: '70vh', display: 'flex', flexDirection: 'column',
               justifyContent: 'center', alignItems: 'center', backgroundColor:'#F5F5F5' }}>
              <CircularProgress size={80} thickness={5} />
              <div style={{paddingTop: '16px'}}>
                We're just seeing if we can find your details
              </div>
            </div>
            :
            <div style={{marginTop: '-10px', paddingLeft: '50px', paddingRight: '50px', textAlign: 'left'}}>
              <div style={{padding: '10px', backgroundColor: '#F5F5F5', fontFamily: 'Permanent Marker', fontSize: '30px', marginBottom: '16px'}}>
                Check your details
              </div>

              <div style={{padding: '6px'}}>
                <p style={styles.header}>
                Display Name
                </p>
                <TextField fullWidth={true}
                  inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                    paddingLeft: '12px',  boxSizing: 'border-box'}}
                  underlineShow={false}
                  defaultValue={this.state.details.name}
                  hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                  key='name'
                  onChange={this.changeCharityInfo.bind(this, 'name')}
                  style={this.state.details.name ? styles.whiteTextfield : styles.unfilledTextField}/>
              </div>


              <div style={{display: 'flex'}}>
                <div style={{flex: '2', padding: '6px'}}>
                  <p style={styles.header}>
                  Contact
                </p>
                    <TextField fullWidth={true}
                      inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                        paddingLeft: '12px',  boxSizing: 'border-box'}}
                      underlineShow={false}
                      onChange={this.changeCharityInfo.bind(this, 'phone')}
                      defaultValue={this.state.phone}
                      hintText={'Phone'}
                      hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                      key='location3'
                      style={this.state.details.phone ? styles.whiteTextfield : styles.unfilledTextField}/>

                    <TextField fullWidth={true}
                      inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                        paddingLeft: '12px',  boxSizing: 'border-box'}}
                      underlineShow={false}
                      onChange={this.changeCharityInfo.bind(this, 'address')}
                      defaultValue={this.state.address}
                      hintText={'Address'}
                      hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                      key='location3'
                      style={this.state.address ? styles.whiteTextfield : styles.unfilledTextField}/>

                    <TextField fullWidth={true}
                      inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                        paddingLeft: '12px',  boxSizing: 'border-box'}}
                      underlineShow={false}
                      onChange={this.changeCharityInfo.bind(this, 'postcode')}
                      defaultValue={this.state.postcode}
                      hintText={'Postcode'}
                      hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                      key='location3'
                      style={this.state.postcode ? styles.whiteTextfield : styles.unfilledTextField}/>


                </div>

                <div style={{flex: 1, padding: '6px'}}>
                  <p style={styles.header}>
                  Charity Number
                  </p>
                  <TextField fullWidth={true}
                    inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                      paddingLeft: '12px',  boxSizing: 'border-box'}}
                    underlineShow={false}
                    defaultValue={this.state.charityNumber}
                    onChange={this.changeCharityInfo.bind(this, 'charityNumber')}
                    hintText={'Charity Number'}
                    hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                    key='location3'
                    style={styles.whiteTextfield}/>
                </div>
              </div>

              <div style={{padding: '6px'}}>
                <p style={styles.header}>
                Charity Description
                </p>
                <TextField fullWidth={true}
                  inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                    paddingLeft: '12px',  boxSizing: 'border-box'}}
                  underlineShow={false}
                  defaultValue={this.state.activities}
                  hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                  onChange={this.changeCharityInfo.bind(this, 'activities')}
                  key='activities'
                  rows={3}
                  multiLine={true}
                  style={this.state.activities ? styles.whiteTextfield : styles.unfilledTextField}/>
              </div>

              <div style={{display: 'flex'}}>
                <div style={{flex: 1, padding: '6px'}}>
                  <p style={styles.header}>
                  Email
                </p>
                <TextField fullWidth={true}
                  inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                    paddingLeft: '12px',  boxSizing: 'border-box'}}
                  underlineShow={false}
                  hintText={'Email'}
                  onChange={this.changeCharityInfo.bind(this, 'email')}
                  defaultValue={this.state.email}
                  hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                  key='location2'
                  style={this.state.email ? styles.whiteTextfield : styles.unfilledTextField}/>
                <p style={styles.header}>
                  Facebook
                </p>
                <TextField fullWidth={true}
                  inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                    paddingLeft: '12px',  boxSizing: 'border-box'}}
                  underlineShow={false}
                  hintText={'Facebook'}
                  defaultValue={this.state.facebook}
                  onChange={this.changeCharityInfo.bind(this, 'facebook')}
                  hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                  key='location2'
                  style={styles.whiteTextfield}/>
                <p style={styles.header}>
                  Instagram
                </p>
                <TextField fullWidth={true}
                  inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                    paddingLeft: '12px',  boxSizing: 'border-box'}}
                  underlineShow={false}
                  hintText={'@Username'}
                  defaultValue={this.state.instagram}
                  onChange={this.changeCharityInfo.bind(this, 'instagram')}
                  hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                  key='location2'
                  style={styles.whiteTextfield}/>
                </div>
                <div style={{flex: 1, padding: '6px', marginBottom: 60}}>
                  <p style={styles.header}>
                    Website
                  </p>
                <TextField fullWidth={true}
                  inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                    paddingLeft: '12px',  boxSizing: 'border-box'}}
                  underlineShow={false}
                  onChange={this.changeCharityInfo.bind(this, 'website')}
                  defaultValue={this.state.website}
                  hintText={'Website'}
                  hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                  key='location3'
                  style={styles.whiteTextfield}/>
                <p style={styles.header}>
                  Twitter
                </p>
                <TextField fullWidth={true}
                  inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                    paddingLeft: '12px',  boxSizing: 'border-box'}}
                  underlineShow={false}
                  hintText={'@Username'}
                  onChange={this.changeCharityInfo.bind(this, 'twitter')}
                  defaultValue={this.state.twitter}
                  hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                  key='location2'
                  style={styles.whiteTextfield}/>
                </div>
              </div>

              <Dialog
                modal={false}
                open={this.state.error ? true : false}
                onRequestClose={this.handleClose}>
                <b>Error:</b>
                <br/>
                {this.state.error ? this.state.error.toString() :null}
                <br/><br/>
                Try again, or contact us at help@whosin.io
              </Dialog>
            </div>
          }
        </div>
      </div>
    )
  }
}
