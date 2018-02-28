import React  from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {Link, browserHistory} from 'react-router';

export default class CharityProjectList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {loading: true, projects: []}
  }

  componentDidMount(props) {
    fetch('https://api.worktools.io/api/Project/?api_token=05a797cd-8b31-4abe-b63b-adbf0952e2c7&Charity='
             + this.props.charityId )
      .then(response => response.json())
      .then(data => this.setState({projects: data, loading: false}))
      .catch(error => this.setState({error, loading: false}))
  }

  handleClick (project, e) {
    e.preventDefault()
    browserHistory.push('/pages/projects/en/' + project.id)
  }

  render() {
    return (
      <div>
        {this.state.loading ?
          <div/>
        :
          <div>
            {this.state.projects.map((project) => (
              <div style={{padding: '12px'}}>
                  <Card onTouchTap={this.handleClick.bind(this, project)}>
                    <CardHeader
                      style={{display: 'flex', justifyContent: 'left'}}
                      title={project['Account Owner']}
                      subtitle="Subtitle"
                      avatar=""
                    />
                    <CardMedia>
                      <img src={project['Featured Image']} alt="" />
                    </CardMedia>
                    <CardTitle style={{textAlign:'left'}} title={project.Name}  />
                    <CardText>
                      {project.Summary}
                    </CardText>
                  </Card>

              </div>
            ))}
          </div>
        }
      </div>
    )
  }
}
