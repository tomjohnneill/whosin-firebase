import React from 'react';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';
import {changeImageAddress} from '../desktopproject.jsx';
import {Tabs, Tab} from 'material-ui/Tabs';
import MediaQuery from 'react-responsive';
import {  browserHistory } from 'react-router';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import {orange500} from 'material-ui/styles/colors';
import Chip from 'material-ui/Chip';
import UploadPhoto from '../create-project/uploadphoto.jsx';
import Snackbar from 'material-ui/Snackbar';
import Loading from '../loading.jsx';
import fire from '../../fire';

let db = fire.firestore()


const defaultStyles = {
  root: {
    position: 'relative',
    paddingBottom: '0px',
    fontSize: '16px'
  },
  input: {
    display: 'inline-block',
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    boxSizing: 'border-box',
    borderRadius: '6px',
    border: '1px solid rgb(133, 137, 135)'
  },
  autocompleteContainer: {
    position: 'absolute',
    top: '100%',
    backgroundColor: 'white',
    border: '1px solid #555555',
    width: '100%',
    zIndex: '5'
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

const styles = {
  selectedTab: {
    height: '60px',
    backgroundColor: 'white',
    color: '#E55749',
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
    backgroundColor: 'white',
    color: '#484848',
    textTransform: 'none',

    fontSize: '16px',
    letterSpacing: '0.4px',
    lineHeight: '16px',
    paddingLeft: '20px',
    paddingRight: '20px',

  },
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
  title : {
    fontWeight: 700, marginBottom: 6, marginTop: 16, display: 'flex'
  }
}

var categories = ['Environment', 'Refugees', 'Equality', 'Poverty', 'Education', 'Healthcare',
                    'Disabilities', 'Young People', 'Old People', 'Isolation', 'Animals', 'Outdoor',
                    'Mental Health']

export class EditProjectForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loading: true,allTags: categories, snackbar: false}
  }

  handleSet = (id, e, data) => {
    console.log(data)
    console.log(id)
    var project = this.state.project
    project[id] = data
    this.setState({project: project})
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

  componentDidMount(props) {
    db.collection("Project").doc(this.props.projectId).get().then((projectDoc) => {
      let project = projectDoc.data()
      project._id = projectDoc.id
      this.setState({tags: project.Tags, project: project, loading: false, address: project.Location})
    })
  }

  onChange = (address) => this.setState({ address})

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

  handleSaveChanges = () => {
    let project = this.state.project
    project.Location = this.state.address
    geocodeByAddress(this.state.address)
     .then(results => getLatLng(results[0]))
     .then(latLng => {
       project.Geopoint = latLng
       db.collection("Project").doc(this.props.projectId).update(project).
       then(data => this.setState({snackbar: true}))
     })
  }

  handleRequestClose = () => {
    this.setState({snackbar: false})
  }

  render() {
    console.log(this.state)
    const inputProps = {
        value: this.state.address,
        onChange: this.onChange,
        placeholder: 'Location'
      }
    return (
      <div>
        <Snackbar
          open={this.state.snackbar}
          message="Project Updated"
          autoHideDuration={3000}
          onRequestClose={this.handleRequestClose}
        />
        {this.state.loading ?
          <Loading/>
          :
          <div style={{width: '80%'}}>

            {/* Min and max */}
            <div style={{width: '100%', paddingBottom: '16px', boxSizing: 'border-box', paddingTop: 16}}>
              <UploadPhoto edit={true} imageUrl={this.state.project['Featured Image']}
                changeParentState={() => this.setState({pictureUploaded: true})}/>
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
                  value={this.state.project['Target People']}
                  hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                  key='min'
                  onChange={this.handleSet.bind(this, 'Target People')}
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
                  errorStyle={{marginTop: 6, color: orange500, textAlign: 'center'}}
                  errorText={this.state.max && this.state.max < this.state.min ? 'You just set max < min' : null}
                  value={this.state.project['Maximum People']}
                  onChange={this.handleSet.bind(this, 'Maximum People')}
                  style={styles.textfield}/>
              </div>
              </div>
            </div>

            {/* Deadline */}
            <div style={{width: '100%',  paddingBottom: 16,
               boxSizing: 'border-box'}}>
              <p style={styles.header}>
                When is the deadline for sign ups?
              </p>
              <DatePicker
                 style={{borderRadius: '6px', border: '1px solid #858987',paddingLeft: '12px',
                     boxSizing: 'border-box'}}
                   underlineShow={false}
                   value={this.state.project.Deadline}
                   onChange={this.handleSet.bind(this, 'Deadline')}
                   hintStyle={{  bottom: '8px'}}
                   hintText="Deadline" textFieldStyle={styles.textfield}/>
            </div>

            {/* Tags */}
            <div style={{width: '100%',  paddingBottom: 16,
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


            <div style={{width: '100%', paddingBottom: '16px', boxSizing: 'border-box'}}>
              <p style={styles.header}>
                Where is this happenning?
              </p>
              <PlacesAutocomplete value={this.state.project.Location}
                styles={defaultStyles} options={options} inputProps={inputProps} />

            </div>
          <div style={{width: '100%', paddingBottom: '16px', boxSizing: 'border-box'}}>
            <div style={{width: '100%',  paddingBottom: 16,
               boxSizing: 'border-box'}}>
               <div style={{width: '70%', display: 'inline-block'}}>
              <p style={styles.header}>
                When does your project start?
              </p>

              <DatePicker
                 style={{borderRadius: '6px', border: '1px solid #858987',paddingLeft: '12px',
                     boxSizing: 'border-box'}}
                   underlineShow={false}
                   value={this.state.project['Start Time']}
                   onChange={this.handleSet.bind(this, 'Start Time')}
                   hintStyle={{  bottom: '8px'}}
                   hintText="Date" textFieldStyle={styles.textfield}/>
              </div>


                <div style={{width: '25%', display: 'inline-block', marginLeft: '5%'}}>
                  <p style={styles.header}>
                    Start time?
                  </p>

                 <TimePicker
                  style={{borderRadius: '6px', border: '1px solid #858987',paddingLeft: '12px',
                      boxSizing: 'border-box'}}
                    underlineShow={false}
                    value={this.state.project['Start Time']}
                    minutesStep={5}

                    onChange={this.handleSet.bind(this, 'Start Time')}
                    hintStyle={{  bottom: '8px'}}
                    hintText="Time" textFieldStyle={styles.textfield}/>
                </div>
            </div>

            <div style={{width: '100%',  paddingBottom: 16,
               boxSizing: 'border-box'}}>
               <div style={{width: '70%', display: 'inline-block'}}>
              <p style={styles.header}>
                When does your project finish?
              </p>

              <DatePicker
                 style={{borderRadius: '6px', border: '1px solid #858987',paddingLeft: '12px',
                     boxSizing: 'border-box'}}
                   underlineShow={false}
                   value={this.state.project['End Time']}
                   onChange={this.handleSet.bind(this, 'End Time')}
                   hintStyle={{  bottom: '8px'}}
                   hintText="Date" textFieldStyle={styles.textfield}/>
              </div>


                <div style={{width: '25%', display: 'inline-block', marginLeft: '5%'}}>
                  <p style={styles.header}>
                    End time?
                  </p>

                 <TimePicker
                  style={{borderRadius: '6px', border: '1px solid #858987',paddingLeft: '12px',
                      boxSizing: 'border-box'}}
                    underlineShow={false}
                    minutesStep={5}
                    value={this.state.project['End Time']}

                    onChange={this.handleSet.bind(this, 'End Time')}
                    hintStyle={{  bottom: '8px'}}
                    hintText="Time" textFieldStyle={styles.textfield}/>
                </div>
            </div>

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
                value={this.state.project.Name}
                onChange={this.handleSet.bind(this, 'Name')}
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
                value={this.state.project.Summary}
                onChange={this.handleSet.bind(this, 'Summary')}
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

                value={this.state.project.Description}
                onChange={this.handleSet.bind(this, 'Description')}
                rows={5}
                hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                key='date'/>
            </div>


            <RaisedButton style={{marginBottom: 30}} label='Save Changes'
              labelStyle={{fontWeight: 700, textTransform: 'none'}}
              primary={true}
              onClick={this.handleSaveChanges}
              />
          </div>
          </div>
        }
      </div>
    )
  }
}

export default class AdminView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loading: true, selected: this.props.params.adminTab ? this.props.params.adminTab : 'admin'
      , inkBarLeft: 15}
  }

  changeAnchorEl = (e) => {
    console.log('handleMultipleChoiceClick')
    e.preventDefault()
    console.log(e)
    var rect = e.target.getBoundingClientRect()
    console.log(rect)
    this.setState({inkBarLeft: (rect.width-60)/2  + rect.x - (window.document.body.clientWidth - 900) /2,
    })
  }

  handleTwoTabClick = (value) => {
    browserHistory.push(`/projects/p/${this.props.params._id}/admin/${value}`)
    this.setState({selected: value})
  }

  componentDidMount(props) {
    db.collection("Engagement").where("Project", "==", this.props.params._id).get().then((querySnapshot) => {
      var data = []
      querySnapshot.forEach((doc) => {
        console.log(doc.data())
        var elem = doc.data()
        elem['_id'] = doc.id
        console.log('Engagement Id', doc.id)
        db.collection("Engagement").doc(doc.id).collection("Private")
          .doc(this.props.params._id).get().then((privateData) => {
          console.log(privateData.data())
          if (privateData.data()) {
              elem.Location = privateData.data().Location
              elem.Email = privateData.data().Email
              elem.Name = privateData.data().Name
            }
            data.push(elem)
            this.setState({engagements: data})
        })
        .catch(error => console.log('Error', error))

      });
      console.log(data)
      this.setState({engagements: data, loading: false})
    })
  }

  cancelPerson = (_id, check) => {
    var engagement = this.state.engagements.filter(eng => eng._id === _id)
    var index = this.state.engagements.indexOf(engagement[0])
    var all = this.state.engagements
    engagement[0]['Cancelled'] = !check
    all[index] = engagement[0]
    this.setState({engagements: all})
    db.collection("Engagement").doc(_id).update({Cancelled: !check})
  }

  addNote = (_id) => {
    var engagement = this.state.engagements.filter(eng => eng._id === _id)
    var index = this.state.engagements.indexOf(engagement[0])
    var all = this.state.engagements
    var notes = engagement[0]['Notes'] ? engagement[0]['Notes'] : []
    notes.push(this.state.note[_id])
    engagement[0]['Notes'] = notes
    all[index] = engagement[0]
    this.setState({engagements: all})
    db.collection("Engagement").doc(_id).update({Notes: notes})
  }

  handleNoteType = (_id, e) => {
    var notes = this.state.note ? this.state.note : {}
    notes[_id] = e.target.value
    this.setState({note: notes})
  }

  handleEmail = (e) => {
    e.preventDefault()
    console.log(this.state.engagements)
    let bccs = []
    for (let i = 0; i < this.state.engagements.length; i ++) {
      if (this.state.engagements[i].Email && this.state.engagements[i].Cancelled !== true) {
        bccs.push(this.state.engagements[i].Email)
      }
    }
    var bcc = encodeURIComponent(bccs.join(';'))
    console.log(bccs)
    console.log(bcc)
    window.location.href = 'mailto:?bcc=' + bcc
  }

  render() {
    console.log(this.state.engagements)
    return (
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{padding: 16, width: '100%', maxWidth: '900px', position: 'relative'}}>
          <h2 style={{position: 'relative'}}>Admin View</h2>
            <div style={{position: 'absolute', right: 0, top:20, padding: 16}}>
              <RaisedButton
                label='Back to Profile'
                labelStyle={{fontWeight: 700, textTransform: 'none'}}
                secondary={true} onClick={() => browserHistory.push(`/projects/p/${this.props.params._id}`)}/>
            </div>

            <Tabs
                tabItemContainerStyle={{height: '60px', backgroundColor: 'white', borderBottom: '1px solid #DDDDDD'}}
                value={this.state.selected}
                onChange={this.handleTwoTabClick}
                inkBarStyle={{zIndex: 2, backgroundColor: '#E55749',
                left:this.state.inkBarLeft, width: '60px'}}
              >
        <Tab label="Admin"
          style={{width: 'auto', fontSize: '16px'}}
            onTouchTap={this.changeAnchorEl}
              buttonStyle={this.state.selected === 'admin' ? styles.selectedTab : styles.tab}
           value="admin">

              {this.state.loading ?
                null :
                <div>
                  <h2 style={{fontWeight: 200, fontSize: '30px', textAlign: 'left'}}>
                    Attending ({this.state.engagements.length ? this.state.engagements.length : null})
                  </h2>

              {this.state.engagements && this.state.engagements.length > 0
               ? this.state.engagements.map((eng) => (
                <List style={{textAlign: 'left', backgroundColor: 'white'}}>
                  <ListItem
                    style={{
                      border: 'solid 1px #979797', borderRadius: 4, marginTop: 10,
                      backgroundColor: eng['Cancelled'] ? 'rgb(248,248,248)' : 'white',
                            color: eng['Cancelled'] ? 'rgba(0, 0, 0, 0.4)' : 'inherit'}}
                    leftAvatar={<Avatar
                      style={{opacity:  eng['Cancelled'] ? 0.5 : 1}}
                       src={changeImageAddress(eng['Volunteer Picture'], '30xauto')} />}
                    primaryText={eng.Name}
                    primaryTogglesNestedList={true}
                    secondaryText={eng.Location}
                    children={
                      <MediaQuery minDeviceWidth={700}>
                        <div style={{position: 'absolute', right: 80, top: 25,
                        color: eng['Cancelled'] ? 'rgba(0, 0, 0, 0.4)' : 'inherit'}}>
                          <Toggle
                            label="Attending"
                            onToggle={(e, check) => this.cancelPerson(eng._id, check)}
                            toggled={eng['Cancelled'] === true ? false : true}
                          />
                        </div>
                      </MediaQuery>
                    }
                    nestedItems={[
                        <ListItem key={1}
                          children={<div style={{width: '100%', height: '100%'}}>
                            <div style={{marginBottom: 6}}>
                              <b>Notes</b>
                            </div>
                            <div>
                              {eng.Notes ? eng.Notes.map((note) => (
                                <li>{note}</li>
                              )): null}
                            </div>
                            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                              <TextField onChange={(e, nv) => this.handleNoteType(eng._id, e)}/>
                              <RaisedButton style={{marginLeft: 16}} primary={true}
                                label='Add Note' onClick={() => this.addNote(eng._id)}/>
                            </div>

                          </div>}
                          />,
                      ]}
                  />
                </List>
              )) :
              <div style={{borderRadius: 4, fontWeight: 700, height: '250px', width: '100%', display: 'flex', backgroundColor: 'rgb(247, 247, 247)', justifyContent: 'center' ,alignItems: 'center'}}>
                <div>
                  You don't have any supporters just yet
                </div>
              </div>}
            </div>
            }

          </Tab>

          <Tab label="Edit Project"
            style={{width: 'auto', fontSize: '16px'}}
              onTouchTap={this.changeAnchorEl}
                buttonStyle={this.state.selected === 'editproject' ? styles.selectedTab : styles.tab}
             value="editproject">
             <EditProjectForm projectId={this.props.params._id}/>
          </Tab>

        </Tabs>

          <div style={{position: 'fixed', bottom: 0, height: 150 , textAlign: 'center', width: '100%', maxWidth: 900,
            display: this.state.selected === 'admin' ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
            <div>
              <b>Contact your supporters</b>
            </div>
            <RaisedButton primary={true} label='Send Email' onClick={this.handleEmail}/>
          </div>
        </div>
      </div>
    )
  }
}
