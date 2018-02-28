import React from 'react';
import {browserHistory} from 'react-router';

export default class LinkedInAuth extends React.Component{
  componentDidMount(props) {
    console.log(this.props.params)
    console.log(this.props.location.query)
    var query = this.props.location.query
    var id = query.id
    var redirect_uri = window.location.origin + window.location.pathname + '?id=' + id
    console.log(redirect_uri)
    console.log(window.location)

    var code = query.code
    fetch(`https://tm6lmbbsvi.execute-api.eu-west-2.amazonaws.com/prod/LinkedInAuthorize?redirect_uri=${redirect_uri}&id=${id}&code=${code}`)
    .then(response => response.json())
    .then(data => {localStorage.setItem('linkedInAccessToken', data.access_token),
    browserHistory.push('/projects/./' + data.id)})
  }

  render() {
    return (
      <div>
        Just heading to LinkedIn
      </div>
    )
  }

}
