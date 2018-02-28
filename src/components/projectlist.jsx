import React , {PropTypes} from 'react';
import {grey200, grey500, grey100, amber500} from 'material-ui/styles/colors'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';
import Divider from 'material-ui/Divider';
import {Tabs, Tab} from 'material-ui/Tabs';
import Dialog from 'material-ui/Dialog';
import {Link, browserHistory} from 'react-router';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import DocumentTitle from 'react-document-title';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import {GridList, GridTile} from 'material-ui/GridList';
import MediaQuery from 'react-responsive';
import fire from '../fire';

let db = fire.firestore()

export function changeImageAddress(file, size) {
  var str = file, replacement = '/' + size + '/';
  str = str.replace(/\/([^\/]*)$/,replacement+'$1');
  return(str + '?pass=this')
}

const Feature = (props) => (
  <div style={{flex: 1, display: 'flex', height: '245px', paddingLeft: '25px'
    ,paddingTop: '75px'
    , paddingRight: '25px'}}>
    <div style={{flex: 5, position: 'relative'}}>
      <div style={{fontSize: '24px', paddingBottom: '30px', paddingRight: '50px', lineHeight: 1.2}}>
        {props.project.Name}
      </div>
      <div style={{fontSize: '14px', textOverflow: 'ellipsis', display: '-webkit-box', boxSizing: 'border-box'
        , WebkitBoxOrient: 'vertical', WebkitLineClamp: 5, lineHeight: 1.2, maxHeight: 85, overflow: 'hidden',
        paddingRight: '50px'}}>
        {props.project.Description}
      </div>
      <div style={{position: 'absolute', bottom: '0px', fontSize: '14px', color: '#4A90E2'}}>
        <FlatButton labelStyle={{color: '#4A90E2'}}
          label='See More' onTouchTap={(e) => {browserHistory.push('/projects/' + props.project.Name + '/' + props.project.id)}}/>
      </div>
    </div>
    <div style={{flex: 3}}>
      <img style={{width: '100%', height: '100%', objectFit: 'cover'}}
        src={props.project['Featured Image']}/>
    </div>
  </div>
)

export default class ProjectList extends React.Component{
  constructor(props) {
    super(props);
    this.state = { loading: true}
  }

  componentDidMount() {
      this.setState({ loading: true });

      //Get IP address

      fetch('https://ident.me/.json')
      .then(response => response.json())

      // Get location from ip address

      .then(function(data) {
        var ip = data
        console.log(data)
        return fetch('https://freegeoip.net/json/' + data.address)
      })
      .then(response => response.json())
      .then(data => {
        if (localStorage.getItem('worktoolsToken')) {
          var token = localStorage.getItem('worktoolsToken')
          var userId = localStorage.getItem('worktoolsID')


          var body = {
            'Location': data.city + ', ' + data.country_name
          };
              fetch(`https://api.worktools.io/api/User/${userId}/?api_token=${token}`, {
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                method: 'PATCH',
                body: JSON.stringify(body)
              })
            }
        } )

        db.collection("Project").get().then((querySnapshot) => {
          var data = []
          querySnapshot.forEach((doc) => {
            console.log(doc.data())
            var elem = doc.data()
            elem['_id'] = doc.id
            data.push(elem)
          });
          this.setState({projects: data, loading: false})
        });


    }

    handleTap = (id, slug, e) => {

      console.log(id)
      console.log(slug)
      console.log(e)

      browserHistory.push('/projects/' + slug + '/' + id)

    }

    render () {
        var placeholderTiles = [0,1,2,3,4,5,6,7]
      return (
        <div>
          <MediaQuery minDeviceWidth={700}>
            <div style={{paddingBottom: '64px'}}>





              {this.state.loading ?
                <List>
                  <Subheader style={{fontSize: '25px', letterSpacing: '-0.6px', lineHeight: '30px', color: '#484848',
                  fontWeight: 700, marginTop: '48px', marginBottom: '24px', paddingLeft: '0px', fontFamily: 'Open Sans'}}>
                    Popular projects
                  </Subheader>



                  <GridList className = 'flexthis'
                    cols={4}
                    cellHeight={350}
                    padding={16}>
                    {placeholderTiles.map((id) => (
                      <GridTile
                        key={id}
                        children={
                          <div>
                            <div style={{cursor: 'pointer', height: '100%', width: 'auto'
                                , display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                              <div style={{width: '100%', height: '210px', maxWidth: '100%', backgroundColor: grey200}}/>
                              <div style={{height: '12px' , backgroundColor: '#dbdbdb', width: '100%', marginTop: '6px'}}/>
                              <LinearProgress style={{marginRight: '16px', marginLeft: '16px',
                                marginTop: '10px', marginBottom: '6px'}} color={amber500} mode="determinate"
                                   value={0} />
                               <div style={{height: '22px', width: '100%', backgroundColor: '#dbdbdb'
                                 , marginBottom: '0px'}}/>
                               <div style={{height: '22px', width: '100%', backgroundColor: '#dbdbdb'
                                 , marginTop: '3px', marginBottom: '6px'}}/>
                             </div>
                          </div>
                        }
                        />
                    ))

                  }
                  </GridList>
                </List>

                :

              <List>
                {this.state.projects ?
                <div style={{display: 'flex'}}>

                  <Feature project={this.state.projects[0]}/>
                  <Feature project={this.state.projects[0]}/>

                </div>
                : null}

            </List>}
          </div>


                </MediaQuery>
                <MediaQuery maxDeviceWidth={700}>
                  <div style={{paddingLeft: '18px', paddingRight: '18px', paddingBottom: '64px'}}>
                    <Subheader style={{fontSize: '25px', letterSpacing: '-0.6px', lineHeight: '30px', color: '#484848',
                    fontWeight: 700, marginTop: '48px', marginBottom: '24px', paddingLeft: '0px', fontFamily: 'Open Sans'}}>
                      Popular projects
                    </Subheader>
                    {this.state.loading ?
                      <List>
                        <GridList
                          className = 'flexthis'
                          cols={2}
                          cellHeight={220}
                          padding={12}>
                          {placeholderTiles.map((id) => (
                            <GridTile
                              key={id}
                              children={
                                <div>
                                  <div
                                    style={{cursor: 'pointer', height: '100%', width: 'auto'
                                      , display: 'flex', flexDirection: 'column'}}>
                                  <div style={{width: '100%', height: '110px', maxWidth: '100%', backgroundColor: grey200}}/>
                                  <div style={{height: '12px' , backgroundColor: '#dbdbdb', width: '100%', marginTop: '6px'}}/>
                                  <LinearProgress style={{marginTop: '10px', marginBottom: '6px'}} color={amber500} mode="determinate"
                                       value={0} />
                                     <div style={{height: '19px', width: '100%', backgroundColor: '#efefef'
                                       , marginBottom: '0px'}}/>
                                     <div style={{height: '19px', width: '60%', backgroundColor: '#efefef'
                                         , marginTop: '3px', marginBottom: '6px'}}/>
                                </div>
                                </div>
                              }
                              />
                          ))

                        }
                        </GridList>
                      </List>

                      :
                    <List>
                <GridList
                  cols={2}

            cellHeight={220}
            padding={12}>
            {this.state.projects ? this.state.projects.map((project) => (

              <GridTile
                key={project._id}

            children={
                <Link to={'/projects/' + project.Name + '/' + project._id}>
                  <div onTouchTap={(e) => this.handleTap(project._id, project.Name)} style={{cursor: 'pointer', height: '100%', width: 'auto', display: 'flex', alignItems: 'center', flexDirection: 'column'}}>


                  <img style={{width: '100%', height: '50%', maxWidth: '100%',
                    borderRadius: '2px', objectFit: 'cover', backgroundColor: grey200}}
                    src={project['Featured Image'] ? changeImageAddress(project['Featured Image'], 'autox150'): null} />

                  <div style={{color: '#484848',
                  fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', width: '100%', marginTop: '6px'}}>
                    <b style={{color: '#FF9800'}}>{project.projectCount}</b> people,  <b style={{color: '#FF9800'}}>10</b> days to go...
                  </div>

                  <LinearProgress style={{marginRight: '16px', marginLeft: '16px', marginTop: '10px', marginBottom: '6px'}} color={amber500} mode="determinate"
                       value={6} />
                  <div style={{color: '#484848',
                  fontWeight: 700, fontSize: '19px', lineHeight: '22px', maxHeight: '66px', letterSpacing: '-0.8px'
                  , overflow: 'hidden', fontFamily: 'Open Sans', textOverflow: 'ellipsis', width: '100%'}}>
                    {project.Name}
                  </div>

                  </div>
                </Link>
                }
            />

        )) : null}
              </GridList>
                </List>
              }
                <Divider/>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center'}}>
                  <Subheader style={{fontSize: '25px', letterSpacing: '1px', lineHeight: '30px', color: '#484848',
                  fontWeight: 700, paddingTop: '16px', marginBottom: '16px', paddingLeft: '0px', fontFamily: 'Open Sans'}}>
                    Get started today
                  </Subheader>
                  <div>
                    Start your own project and...
                  </div>
                  <div>
                    <RaisedButton
                      style={{height: '36px', marginTop: '16px', boxShadow: ''}} primary={true} overlayStyle={{height: '36px'}}
                      buttonStyle={{height: '36px'}}
                       labelStyle={{height: '36px', display: 'flex', alignItems: 'center',
                            letterSpacing: '0.6px', fontWeight: 'bold'}}
                       label='Start a project' onTouchTap={this.handleCreatePledge}/>
                  </div>
                </div>
                </div>
              </MediaQuery>
        </div>
      )
    }
}
