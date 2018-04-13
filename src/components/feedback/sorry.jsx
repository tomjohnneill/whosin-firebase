import React from 'react'
import MediaQuery from 'react-responsive';
import {CharitySubscribe} from '../charityprofile.jsx';
import Divider from 'material-ui/Divider';
import Masonry from 'react-masonry-css';
import EmbeddedProject from '../embeddedproject.jsx';
import Loading from '../loading.jsx';
import Subheader from 'material-ui/Subheader';
import {changeImageAddress} from '../desktopproject.jsx';
import fire from '../../fire';
let db = fire.firestore()
var algoliasearch = require('algoliasearch/lite')

export default class Sorry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div style={{display: 'flex', alignItems: 'center', minHeight: 800, flexDirection: 'column'}}>
        <MediaQuery minDeviceWidth={700}>
          <img
            style={{height: 450, width: '100%', boxSizing: 'border-box',
              objectPosition: '50% 30%',
              objectFit: 'cover', position: 'relative'}}
            src={changeImageAddress('https://d3kkowhate9mma.cloudfront.net/important/matthew-henry-58760-unsplash.jpg', '1500xauto')}/>
        </MediaQuery>
        <MediaQuery maxDeviceWidth={700}>
          <img
            style={{height: 350, width: '100%', boxSizing: 'border-box',
              objectPosition: '50% 30%',
              objectFit: 'cover', position: 'relative'}}
            src={changeImageAddress('https://d3kkowhate9mma.cloudfront.net/important/matthew-henry-58760-unsplash.jpg', '1500xauto')}/>
        </MediaQuery>
        <div style={{maxWidth: 900, width: '100%', boxSizing: 'border-box', padding: 16}}>

          <div className='desktop-header' style={{paddingBottom: 30, paddingTop: 30}}>
            Sorry it wasn't great.
          </div>
          <div style={{paddingBottom: 16}}>
            We're pretty damn sure next time will be better.
            <a target='_blank' rel='noopener' style={{color: '#65A1e7'}}
               href='https://en.wikipedia.org/wiki/Gambler%27s_fallacy'> Right...?</a>
          </div>

            <MediaQuery minDeviceWidth={700}>
              <h1 className='desktop-header' style={{marginTop: 16}}>
                Find another project</h1>
              {this.state.loading ?
                <Loading/>
                :
                this.state.projects ?

                <Masonry
                  breakpointCols={2}
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

                      <div style={{textAlign: 'left', paddingBottom: '64px'}}>
                        <Subheader style={{fontSize: '25px', letterSpacing: '-0.6px', lineHeight: '30px', color: '#484848',
                        fontWeight: 700, marginTop: '48px', marginBottom: '24px', paddingLeft: '0px'}}>
                          Find another project
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

                    </div>

            </MediaQuery>
        </div>
      </div>
    )
  }
}
