import React from 'react';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';
import MediaQuery from 'react-responsive';
import TextField from 'material-ui/TextField';
import fire from '../../fire';

let db = fire.firestore()

export default class AdminView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loading: true}
  }

  componentDidMount(props) {
    db.collection("Engagement").where("Project", "==", this.props.params._id).get().then((querySnapshot) => {
      var data = []
      querySnapshot.forEach((doc) => {
        console.log(doc.data())
        var elem = doc.data()
        elem['_id'] = doc.id
        data.push(elem)
      });
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
    return (
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgb(247,247,247)'}}>
        <div style={{padding: 16, width: '100%', maxWidth: '900px'}}>
          <h2>Admin View</h2>
          {this.state.loading ?
            null :
          this.state.engagements && this.state.engagements.length > 0
           ? this.state.engagements.map((eng) => (
            <List style={{textAlign: 'left', backgroundColor: 'white'}}>
              <ListItem
                style={{backgroundColor: eng['Cancelled'] ? 'rgb(248,248,248)' : 'white',
                        color: eng['Cancelled'] ? 'rgba(0, 0, 0, 0.4)' : 'inherit'}}
                leftAvatar={<Avatar
                  style={{opacity:  eng['Cancelled'] ? 0.5 : 1}}
                   src={eng['Volunteer Picture']} />}
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
          <div style={{margin: 20, borderRadius: 4, fontWeight: 700, height: '250px', width: '100%', display: 'flex', backgroundColor: 'rgb(247, 247, 247)', justifyContent: 'center' ,alignItems: 'center'}}>
            <div>
              You don't have any supporters just yet
            </div>
          </div>
        }
          <div style={{position: 'fixed', bottom: 0, height: 150 , textAlign: 'center', width: '100%', maxWidth: 900,
            display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
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
