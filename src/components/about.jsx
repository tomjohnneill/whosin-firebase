import React from 'react'
import MediaQuery from 'react-responsive';
import {World, Person2, Person3, Person1} from './icons.jsx';
import {grey200, grey500, red500, red100, orange500, orange100, yellow500,
  yellow100, limeA200, limeA700, green300} from 'material-ui/styles/colors';
import ShortReview from './feedback/shortreview.jsx';
import VolunteerStars from './feedback/volunteerstars.jsx';
import RaisedButton from 'material-ui/RaisedButton';
import {browserHistory} from 'react-router';

const styles = {
  title: {
    fontSize: '64px',
    fontWeight: 700,
    fontFamily: 'Permanent Marker',
    textAlign: 'left',
    color: 'white'
  },
  mobileTitle: {
    fontSize: '56px',
    fontWeight: 700,
    fontFamily: 'Permanent Marker',
    textAlign: 'left',
    color: 'white'
  },
  summary: {
    fontWeight: 700,
    fontSize: '40px',
    color: 'white',
    maxWidth: '80%',
    textAlign: 'left'
  },
  mobileSummary: {
    fontWeight: 700,
    fontSize: '36px',
    color: 'white',
    textAlign: 'left'
  },
  header: {
    fontFamily: 'Permanent Marker',
    textAlign: 'left',
    fontSize: '36px'
  },
  inkbar: {
    height: 6,
    marginTop: 10,
    width: '100px',
    backgroundColor: 'rgba(250,250,250,0.5)'
  },
  blackInkbar: {
    height: 6,
    marginTop: 10,
    width: '100px',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  redInkbar: {
    height: 6,
    marginTop: 10,
    width: '100px',
    backgroundColor: '#E55749'
  },
  para: {
    marginTop: 16,
    fontWeight: 300,
    fontSize: '24px'
  },
  inside: {
    width: '100%',
    boxSizing: 'border-box',
    padding: 24,
    maxWidth: '800px',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    flexDirection: 'column'
  },
  step: {
    fontSize: '40px',
    fontWeight: 700
  }
}

export default class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <div className='aboutContainer' style={{width: '100%', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', textAlign: 'left', backgroundColor: '#FF9800',
      overflowX: 'hidden'}}>

        <MediaQuery minDeviceWidth={700}>
          <div style={{maxWidth: '1000px', width: '100%', height: '60vh', padding: 24, marginTop: 40, boxSizing: 'border-box' }}>
            <div>
              <div style={styles.title}>
                Who's In?
              </div>
              <div style={styles.summary}>
                  Tackling issues you care about has never been easier.
              </div>
            </div>

          </div>
          <div style={{backgroundColor: 'white', width: '100%', height: '650px',
            display: 'flex', justifyContent: 'center'}}>
            <div style={{maxWidth: '600px', width: '100%', display: 'flex', justifyContent: 'center'}}>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'left', padding: 24}}>
                <h2 style={styles.header}>
                  The story
                </h2>
                <div style={styles.redInkbar}/>
                <div style={{height: 20}}/>
                <div style={styles.para}>
                   More people than ever care about the big issues that society faces.
                </div>


                <div style={styles.para}>
                    While it's easier than ever to broadcast
                   our feelings on social media, it's just as difficult as before to know what you can do.
                </div>

                <div style={{marginTop: 20, fontWeight: 700, fontSize: '24px'}}>
                  Our mission is to make 'making a difference' much easier.
                </div>

                <div style={styles.para}>
                    Here's how...
                </div>
              </div>

            </div>
          </div>
        </MediaQuery>

        <MediaQuery maxDeviceWidth={700}>
          <div style={{maxWidth: '1000px', width: '100%', height: '60vh', padding: 24, marginTop: 40, boxSizing: 'border-box' }}>
            <div>
              <div style={styles.mobileTitle}>
                Who's In?
              </div>
              <div style={styles.mobileSummary}>
                  Tackling issues you care about has never been easier.
              </div>
            </div>

          </div>
          <div style={{backgroundColor: 'white', width: '100%', height: 'auto',
            display: 'flex', justifyContent: 'center'}}>
            <div style={{maxWidth: '600px', width: '100%', display: 'flex', justifyContent: 'center'}}>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'left', padding: 24}}>
                <h2 style={styles.header}>
                  The story
                </h2>
                <div style={styles.redInkbar}/>
                <div style={{height: 20}}/>
                <div style={styles.para}>
                   More people than ever care about the big issues that society faces.
                </div>


                <div style={styles.para}>
                    While it's easier than ever to broadcast
                   our feelings on social media, it's just as difficult as before to know what you can do.
                </div>

                <div style={{marginTop: 20, fontWeight: 700, fontSize: '24px'}}>
                  Our mission is to make 'making a difference' much easier.
                </div>

                <div style={styles.para}>
                    Here's how...
                </div>

                <div style={{height: '60px'}}/>
              </div>

            </div>
          </div>
        </MediaQuery>

      <MediaQuery minDeviceWidth={700}>
        <div style={{display: 'flex', justifyContent: 'center',
          backgroundColor: '#E55749', width: '100%', height: '90vh', color: 'white'}}>
          <div style={styles.inside}>
            <div style={styles.step}>
              Organisers create projects
            </div>

            <div style={styles.inkbar}/>

              <div style={{height: 'auto', display: 'flex'}}>
                <div style={{margin: 20}}>
                <iframe
                  frameborder='0'
                  width="350"
                  height="500"
                  src="https://whosin.io/embed/Nik1eqwY1ijdbZseZaGN"></iframe>
                </div>

                <div style={{margin: 20}}>
                  <iframe
                    frameborder='0'
                    width="350"
                    height="500"
                    src="https://whosin.io/embed/7CLWqTZVGWjvJQ5YCvwG"></iframe>
                </div>
              </div>
          </div>
        </div>
      </MediaQuery>

      <MediaQuery maxDeviceWidth={700}>
        <div style={{display: 'flex', justifyContent: 'center',
          backgroundColor: '#E55749', width: '100%', height: 'auto', color: 'white'}}>
          <div style={styles.inside}>
            <div style={styles.step}>
              Organisers create projects
            </div>

            <div style={styles.inkbar}/>
              <div style={{height: 'auto'}}>
                <div style={{margin: 20}}>
                <iframe
                  frameborder='0'
                  width="320"
                  height="500"
                  src="https://whosin.io/embed/Nik1eqwY1ijdbZseZaGN"></iframe>
                </div>

                <div style={{margin: 20}}>
                  <iframe
                    frameborder='0'
                    width="320"
                    height="500"
                    src="https://whosin.io/embed/7CLWqTZVGWjvJQ5YCvwG"></iframe>
                </div>
              </div>
          </div>
        </div>
      </MediaQuery>

        <MediaQuery minDeviceWidth={700}>
          <div style={{display: 'flex', justifyContent: 'center',
            backgroundColor: '#65A1e7', width: '100%', height: '90vh', color: 'white'}}>
            <div style={styles.inside}>
              <div style={styles.step}>
                Projects aim to reach their targets
              </div>
              <div style={styles.inkbar}/>
                <img src='https://d3kkowhate9mma.cloudfront.net/750xauto/be4fde63-5991-417a-afd7-5ebde2056ae7'
                  style={{height: '50vh', width: 'auto', backgroundColor: 'white', color: 'black', marginTop: 36,
                  boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px', borderRadius: 6,
                padding: 10}}
                  />
            </div>
          </div>
        </MediaQuery>

        <MediaQuery maxDeviceWidth={700}>
          <div style={{display: 'flex', justifyContent: 'center',
            backgroundColor: '#65A1e7', width: '100%', height: '90vh', color: 'white'}}>
            <div style={styles.inside}>
              <div style={styles.step}>
                Projects aim to reach their targets
              </div>
              <div style={styles.inkbar}/>

            </div>
          </div>
        </MediaQuery>


        <div style={{display: 'flex', justifyContent: 'center',
          backgroundColor: 'white', width: '100%', height: '90vh'}}>
          <div style={styles.inside}>
            <div style={styles.step}>
              Find what you're interested in
            </div>
            <div style={styles.blackInkbar}/>
              <div style={{height: '40vh', width: '400px', backgroundColor: 'white', color: 'black'}}>
                Giphy capture of searching
              </div>
          </div>
        </div>


        <MediaQuery minDeviceWidth={700}>
          <div style={{display: 'flex', justifyContent: 'center',
            backgroundColor: '#FF9800', width: '100%', height: '90vh', color: 'white'}}>
            <div style={styles.inside}>
              <div style={styles.step}>
                Don't be lonely
              </div>
              <div style={styles.inkbar}/>
                <div style={{height: '40vh', width: '400px', backgroundColor: 'white', color: 'black',
                  padding: 24, margin: 40, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexDirection: 'column',
                  boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',}}>
                  <div style={{display: 'flex', width: '100%'}}>
                    <div style={{flex: 1}}>
                      <Person1 color={'#DDDDDD'} style={{height: 100, width: 100}}/>
                    </div>
                    <div style={{flex: 1}}>
                      <Person2 color={'#FF9800'} style={{height: 100, width: 100}}/>
                    </div>
                    <div style={{flex: 1}}>
                      <Person3 color={'#DDDDDD'} style={{height: 100, width: 100}}/>
                    </div>
                  </div>
                  <div style={{color: '#484848', padding: 24, fontSize: '24px', fontWeight: 700}}>

                    Sign up with a group of friends
                  </div>
                  <div style={{marginTop: 0, fontWeight: 200, color: grey500}}>
                    Don't come unless they come with you
                  </div>
                </div>
            </div>
          </div>
        </MediaQuery>

        <MediaQuery maxDeviceWidth={700}>
          <div style={{display: 'flex', justifyContent: 'center',
            backgroundColor: '#FF9800', width: '100%', height: '90vh', color: 'white'}}>
            <div style={styles.inside}>
              <div style={styles.step}>
                Don't be lonely
              </div>
              <div style={styles.inkbar}/>
                <div style={{height: '400px', width: '100%', backgroundColor: 'white', color: 'black',
                  boxSizing: 'border-box',
                  padding: 24, marginTop: 40, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexDirection: 'column',
                  boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',}}>
                  <div style={{display: 'flex', width: '100%'}}>
                    <div style={{flex: 1}}>
                      <Person1 color={'#DDDDDD'} style={{height: 80, width: 80}}/>
                    </div>
                    <div style={{flex: 1}}>
                      <Person2 color={'#FF9800'} style={{height: 80, width: 80}}/>
                    </div>
                    <div style={{flex: 1}}>
                      <Person3 color={'#DDDDDD'} style={{height: 80, width: 80}}/>
                    </div>
                  </div>
                  <div style={{color: '#484848', padding: 24, fontSize: '24px', fontWeight: 700}}>

                    Sign up with a group of friends
                  </div>
                  <div style={{marginTop: 0, fontWeight: 200, color: grey500}}>
                    Don't come unless they come with you
                  </div>
                </div>
            </div>
          </div>
        </MediaQuery>

        <MediaQuery minDeviceWidth={700}>
          <div style={{display: 'flex', justifyContent: 'center',
            backgroundColor: '#65A1e7', width: '100%', height: '100vh', color: 'white'}}>
            <div style={styles.inside}>
              <div style={styles.step}>
                Build a reputation
              </div>
              <div style={styles.inkbar}/>
              <div style={{display: 'flex'}}>
                <div style={{margin: 20, height: 510, overflow: 'hidden', width: '350px', backgroundColor: 'white', color: '#484848', borderRadius: 6,
                  boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px'}}>
                  <ShortReview params={{_id: 'B8AJNxBHBRhxHATpzvht'}}/>
                </div>

                <div style={{margin: 20, height: 580, overflow: 'hidden', width: '350px', backgroundColor: 'white', color: '#484848', borderRadius: 6,
                  boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px'}}>
                  <VolunteerStars params={{_id: 'B8AJNxBHBRhxHATpzvht', userId: '2wOtwTpKxjdCFOa0tNlLpOAYSsO2'}}/>
                </div>
              </div>

            </div>
          </div>
        </MediaQuery>
        <MediaQuery maxDeviceWidth={700}>
          <div style={{display: 'flex', justifyContent: 'center', paddingTop: 24, paddingBottom: 24,
            backgroundColor: '#65A1e7', width: '100%', height: 'auto', color: 'white'}}>
            <div style={styles.inside}>
              <div style={styles.step}>
                Build a reputation
              </div>
              <div style={styles.inkbar}/>
              <div style={{width: '100%'}}>
                <div style={{marginTop: 30, height: 510, overflow: 'hidden', width: '100%', backgroundColor: 'white', color: '#484848', borderRadius: 6,
                  boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px'}}>
                  <ShortReview params={{_id: 'B8AJNxBHBRhxHATpzvht'}}/>
                </div>

                <div style={{marginTop: 20, height: 580, overflow: 'hidden', width: '100%', backgroundColor: 'white', color: '#484848', borderRadius: 6,
                  boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px'}}>
                  <VolunteerStars params={{_id: 'B8AJNxBHBRhxHATpzvht', userId: '2wOtwTpKxjdCFOa0tNlLpOAYSsO2'}}/>
                </div>
              </div>

            </div>
          </div>
        </MediaQuery>

        <div style={{display: 'flex', justifyContent: 'center',
          backgroundColor: 'white', width: '100%', height: '40vh'}}>
          <div style={styles.inside}>
            <div style={styles.step}>
              Get started
            </div>
            <div style={styles.redInkbar}/>

          <div style={{padding: 50}}>
            <RaisedButton label="Let's Go"
              primary={true}
              onClick={() => browserHistory.push('/projects')}
              labelStyle={{letterSpacing: '1.5px', fontWeight: 'bold',
                fontFamily: 'Permanent Marker', fontSize: '24px'}}/>

          </div>
          </div>
        </div>

      </div>
    )
  }
}
