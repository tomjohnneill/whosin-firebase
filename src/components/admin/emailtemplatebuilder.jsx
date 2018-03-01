import React from 'react';
import EmailEditor from 'react-email-editor';
import Snackbar from 'material-ui/Snackbar';
import fire from '../../fire';
import TextField from 'material-ui/TextField';

let db = fire.firestore()

export default class EmailTemplateBuilder extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      autoHideDuration: 4000,
      message: 'Event added to your calendar',
      open: false,
      mergeTags: []
    };
  }

  componentDidMount (props) {
    var dateObj = new Date(Date.now() + 86400000 /2)
    console.log(dateObj)
      db.collection("Project").where("Start Time", "<", dateObj).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc.data())
        })
      })
  }

    exportHtml = () => {
      this.setState({open: true})

        this.editor.exportHtml(data => {
          const { design, html } = data
          console.log('exportHtml', html)
          console.log(design)
          console.log(this.state.name)
          console.log(this.state.mergeTags)
          db.collection("emailTemplates").add({
            html: html,
            design: JSON.stringify(design),
            mergeTags: this.state.mergeTags,
            name: this.state.name
          })
          .then(() => this.setState({name: null}) )
      })

  }

      handleRequestClose = () => {
      this.setState({
        open: false,
      });
    };

    handleAddTag = (e, nv) => {
      this.setState({newTag: e.target.value})
    }

    handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        var tags = this.state.mergeTags
        tags.push(this.state.newTag)
        this.setState({mergeTags: tags, newTag: null})
        e.target.value = null
      }
    }

    handleNameChange = (e, nv) => {
      this.setState({name: e.target.value})
    }

  render() {
    return(
      <div>
        <h1>react-email-editor Demo</h1>

        <div>
          <button onClick={this.exportHtml}>Export HTML</button>
        </div>
        <TextField onChange={this.handleNameChange} value={this.state.name} onKeyPress={this.handleNamePress}/>
        <EmailEditor
          ref={editor => this.editor = editor}
        />

      <div style={{display: 'flex', width: '1000px'}}>
        <div style={{flex: 1}}>
          {this.state.mergeTags.map((tag) => (
            <div>
              {`{{ ${tag} }}`}
            </div>
          ))}
        </div>
        <div style={{flex: 1}}>
          <h2>Merge tags:</h2>
          <TextField onChange={this.handleAddTag} onKeyPress={this.handleKeyPress}/>
        </div>
      </div>

        <Snackbar
          open={this.state.open}
          message={this.state.message}
          action="undo"
          autoHideDuration={this.state.autoHideDuration}
          onActionClick={this.handleActionClick}
          onRequestClose={this.handleRequestClose}
        />
      </div>
    )
  }
}
