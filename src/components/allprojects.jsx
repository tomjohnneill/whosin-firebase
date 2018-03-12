import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {changeImageAddress} from './desktopproject.jsx';
import LinearProgress from 'material-ui/LinearProgress';
import { Link } from 'react-router';
import MediaQuery from 'react-responsive';
import {GridList, GridTile} from 'material-ui/GridList';
import Subheader from 'material-ui/Subheader';
import {grey200, grey500, grey100, amber500} from 'material-ui/styles/colors'
import {List, ListItem} from 'material-ui/List';
import Search from 'material-ui/svg-icons/action/search';
import Divider from 'material-ui/Divider';

import fire from '../fire';

let db = fire.firestore()

var placeholderTiles = [0,1,2,3,4,5,6,7]



const styles = {
  button : {
    fontFamily: 'Permanent Marker',
    fontSize: '20px',
    lineHeight: '36px'
  }
}

export default class AllProjects extends React.Component {
  constructor(props) {
    super(props)
    console.log(this.props)
    this.state = {loading: true}
  }

  componentDidMount(props) {


    db.collection("Project").get().then((querySnapshot) => {
      var data = []
      querySnapshot.forEach((doc) => {

        var elem = doc.data()
        elem['_id'] = doc.id
        data.push(elem)
      });
      this.setState({projects: data, loading: false})
    });


  }

  handleSearch = (e, input) => {
    const client = window.algoliasearch('52RYQZ0NQK', 'b10f7cdebfc189fc6f889dbd0d3ffec2');
    const index = client.initIndex('projects');
    var query = e.target.value
    index
        .search({
            query
        })
        .then(responses => {
            // Response from Algolia:
            // https://www.algolia.com/doc/api-reference/api-methods/search/#response-format
            this.setState({projects: responses.hits});
        });
  }

  render() {

    return (
      <div>
        <MediaQuery minDeviceWidth={700}>
          <div style={{position: 'sticky', top: '0px', display: 'flex', alignItems: 'center', paddingLeft: 100, zIndex: 10, paddingRight: 100
            , background: 'linear-gradient(0deg, #ffffff, #f7f7f7)', paddingTop: 20, paddingBottom: 20, borderBottom: '1px solid #DDDDDD'}}>

            <Search style={{marginRight: 6}}/>
            <TextField hintText={'Search'} onChange={this.handleSearch}/>
          </div>

        </MediaQuery>
        <MediaQuery maxDeviceWidth={700}>
          <div style={{position: 'sticky', top: '0px', display: 'flex', alignItems: 'center', paddingLeft: 16, zIndex: 10, paddingRight: 10
            , background: 'linear-gradient(0deg, #ffffff, #f7f7f7)', paddingTop: 20, paddingBottom: 20, borderBottom: '1px solid #DDDDDD'}}>

            <Search style={{marginRight: 6}}/>
            <TextField hintText={'Search'} onChange={this.handleSearch}/>
          </div>
        </MediaQuery>
        <div>
          <MediaQuery minDeviceWidth={700}>
            <h1 style={{fontFamily: 'Permanent Marker', textAlign: 'left', paddingLeft: '100px'}}>
              All Projects</h1>
            {this.state.loading ?
              <div>
                Loading...
              </div>
              :
              this.state.projects ?
              <div style={{display: 'flex', flexWrap: 'wrap', paddingLeft: '80px', paddingRight: '80px',
              textAlign: 'left'}}>
                {this.state.projects.map((project) => (
                  <Link to={`/projects/${project['Name']}/${project._id}`}>
                    <div style={{width: '230px', height: '280px', margin: 20}}>
                      <img src={changeImageAddress(project['Featured Image'], '250xauto')}
                        style={{width: '100%', height: '180px',objectFit: 'cover', borderRadius: '4px'}}/>
                      <span style={{display: 'inline-block',fontWeight: 100, color: grey500, fontSize: '12px', textTransform: 'uppercase'}}>
                        {project.Location ? project.Location.replace(/(([^\s]+\s\s*){3})(.*)/,"$1…") : 'Online'}
                      </span>
                      <div style={{color: '#484848',
                      fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', width: '100%', marginTop: '6px'}}>
                        <b style={{color: '#FF9800'}}>{project['People Pledged']}</b> people,  <b style={{color: '#FF9800'}}>10</b> days to go...
                      </div>
                      <LinearProgress
                        min={0}
                        mode={'determinate'}
                        max={project['Target People']}
                        value={project['People Pledged']}
                        color={amber500}
                        style={{marginTop: 6, marginBottom: 6}}
                        />
                      <span style={{fontWeight: 700, display: 'inline-block'}}>
                        {project.Name}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              :
              null
            }
          </MediaQuery>
          <MediaQuery maxDeviceWidth={700}>

                    <div style={{textAlign: 'left', paddingLeft: '18px', paddingRight: '18px', paddingBottom: '64px'}}>
                      <Subheader style={{fontSize: '25px', letterSpacing: '-0.6px', lineHeight: '30px', color: '#484848',
                      fontWeight: 700, marginTop: '48px', marginBottom: '24px', paddingLeft: '0px', fontFamily: 'Open Sans'}}>
                        All Projects
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
                    <div  style={{cursor: 'pointer', height: '100%', width: 'auto', display: 'flex', alignItems: 'center', flexDirection: 'column'}}>


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
      </div>
    )
  }
}
