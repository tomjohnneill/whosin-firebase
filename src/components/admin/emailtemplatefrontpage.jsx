import React from 'react';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {browserHistory} from 'react-router';
import fire from '../../fire';

let db = fire.firestore()


export default class EmailTemplateFrontPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loading: true}
  }

  componentDidMount(props) {
    db.collection("emailTemplates").get().then((querySnapshot) => {
      var data = []
      querySnapshot.forEach((doc) => {

        var elem = doc.data()
        elem['_id'] = doc.id
        data.push(elem)
      });
      this.setState({emailTemplates: data, loading: false})
    })
  }

  handleGo = (id) => {
    browserHistory.push(`/admin/emailtemplate/${id}`)
  }

  render() {
    return (
      <div style={{display: 'flex', padding: 24}}>
        <div style={{flex: 1}} >
          <p className='desktop-header'>Existing templates
            </p>
          {
            this.state.emailTemplates ?
              <Menu>
                {this.state.emailTemplates.map((template) => (
                  <MenuItem primaryText={template.name}
                      onClick={() => this.handleGo(template._id)}
                      />
                ))}
              </Menu>
              :
              null
          }
          <RaisedButton label='Start a new template'
            onClick={this.handleNew} primary={true}
            />
        </div>
        <div style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>

        </div>
      </div>
    )
  }
}
