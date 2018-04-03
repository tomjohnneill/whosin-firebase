import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {changeImageAddress} from './desktopproject.jsx';
import LinearProgress from 'material-ui/LinearProgress';
import { Link } from 'react-router';
import EmbeddedProject from './embeddedproject.jsx';
import {browserHistory} from 'react-router';
import MediaQuery from 'react-responsive';
import {GridList, GridTile} from 'material-ui/GridList';
import Subheader from 'material-ui/Subheader';
import {grey200, grey500, grey100, amber500} from 'material-ui/styles/colors'
import {List, ListItem} from 'material-ui/List';
import Search from 'material-ui/svg-icons/action/search';
import Divider from 'material-ui/Divider';
import Masonry from 'react-masonry-css';
import Loading from './loading.jsx';

import fire from '../fire';

let db = fire.firestore()

var algoliasearch = require('algoliasearch/lite')

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
    const client = algoliasearch('52RYQZ0NQK', 'b10f7cdebfc189fc6f889dbd0d3ffec2');
    if (process.env.REACT_APP_ENVIRONMENT === "staging" || process.env.NODE_ENV === 'development') {
      var index = client.initIndex('staging_projects');
    } else {
      var index = client.initIndex('projects');
    }
    var query = ''
    index
        .search({
            query: query,
            filters: 'Approved:true'
        })
        .then(responses => {
            // Response from Algolia:
            // https://www.algolia.com/doc/api-reference/api-methods/search/#response-format
            this.setState({projects: responses.hits, loading: false});
        });




  }

  handleSearch = (e, input) => {
    const client = algoliasearch('52RYQZ0NQK', 'b10f7cdebfc189fc6f889dbd0d3ffec2');
    const index = client.initIndex('projects');
    var query = e.target.value
    index
        .search({
            query: query,
            filters: 'Approved:true'
        })
        .then(responses => {
            // Response from Algolia:
            // https://www.algolia.com/doc/api-reference/api-methods/search/#response-format
            this.setState({projects: responses.hits});
        });
  }

  render() {
    if (this.state.projects) {
      console.log(this.state.projects)
    }
    return (
      <div>
        <MediaQuery minDeviceWidth={700}>
          <div style={{position: 'sticky', top: '50px', display: 'flex', alignItems: 'center',
             paddingLeft: 100, zIndex: 10, paddingRight: 100
            , background: 'linear-gradient(0deg, #ffffff, #f7f7f7)', paddingTop: 6,
            paddingBottom: 6, borderBottom: '1px solid #DDDDDD'}}>

            <Search style={{marginRight: 6}}/>
            <TextField hintText={'Search'} onChange={this.handleSearch}/>
          </div>

        </MediaQuery>
        <MediaQuery maxDeviceWidth={700}>
          <div style={{position: 'sticky', top: '50px', display: 'flex', alignItems: 'center', paddingLeft: 16, zIndex: 10, paddingRight: 10
            , background: 'linear-gradient(0deg, #ffffff, #f7f7f7)', paddingTop: 6, paddingBottom: 6, borderBottom: '1px solid #DDDDDD'}}>

            <Search style={{marginRight: 6}}/>
            <TextField hintText={'Search'} onChange={this.handleSearch}/>
          </div>
        </MediaQuery>
        <div>
          <MediaQuery minDeviceWidth={700}>
            <h1 className='desktop-header' style={{paddingLeft: '100px', marginTop: 16}}>
              All Projects</h1>
            {this.state.loading ?
              <Loading/>
              :
              this.state.projects ?

              <Masonry
                breakpointCols={3}
                style={{paddingRight: 100, paddingLeft: 100}}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column">
                {this.state.projects.map((project) => (
                  <div style={{padding: 20, minWidth: 280, boxSizing: 'border-box', width: '100%', position: 'relative'}}>
                    <EmbeddedProject style={{position: 'relative'}} noLogo={true} project={project}/>
                  </div>
                ))}
              </Masonry>

              :
              null
            }
          </MediaQuery>
          <MediaQuery maxDeviceWidth={700}>

                    <div style={{textAlign: 'left', paddingLeft: '18px', paddingRight: '18px', paddingBottom: '64px'}}>
                      <Subheader style={{fontSize: '25px', letterSpacing: '-0.6px', lineHeight: '30px', color: '#484848',
                      fontWeight: 700, marginTop: '48px', marginBottom: '24px', paddingLeft: '0px'}}>
                        All Projects
                      </Subheader>
                      {this.state.loading ?
                        <Loading/>
                        :
                        this.state.projects ?
                        <div style={{display: 'flex', flexWrap: 'wrap',
                        textAlign: 'left'}}>
                          {this.state.projects.map((project) => (
                            <div style={{paddingTop: 10, paddingBottom: 10, width: '100%', boxSizing: 'border-box'}}>
                              <EmbeddedProject noLogo={true}
                                project={project}
                              />
                            </div>
                          ))}
                        </div>
                             : null
                }
                  <Divider/>
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center'}}>
                    <Subheader style={{fontSize: '25px', letterSpacing: '1px', lineHeight: '30px', color: '#484848',
                    fontWeight: 700, paddingTop: '16px', marginBottom: '16px', paddingLeft: '0px'}}>
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
                         label='Start a project' onTouchTap={() => browserHistory.push('/create-project/0')}/>
                    </div>
                  </div>
                  </div>

          </MediaQuery>
        </div>
      </div>
    )
  }
}
