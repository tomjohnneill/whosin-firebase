import React from 'react'
import MediaQuery from 'react-responsive';
import {World} from './icons.jsx';
import {grey200, grey500, red500, red100, orange500, orange100, yellow500,
  yellow100, limeA200, limeA700, green300} from 'material-ui/styles/colors'

const styles = {
  title: {
    fontSize: '64px',
    fontWeight: 700,
    fontFamily: 'Permanent Marker',
    textAlign: 'center'
  },
  summary: {
    fontWeight: 300,
    fontSize: '28px',
    color: 'rgb(103, 116, 124)',
    maxWidth: '60%',
    textAlign: 'center'
  },
  header: {
    fontFamily: 'Permanent Marker',
    textAlign: 'left'
  },
  inkbar: {
    height: 6,
    marginTop: 10,
    width: '100px',
    backgroundColor: 'rgba(250,250,250,0.5)'
  },
  para: {
    marginTop: 16,
    fontWeight: 300,
    fontSize: '18px'
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
        justifyContent: 'center', alignItems: 'center', textAlign: 'left'}}>
        <div style={{maxWidth: '1000px', width: '100%', height: '60vh', padding: 24, boxSizing: 'border-box' }}>
          <div style={{display: 'flex', width: '100%', flexDirection: 'column', alignItems: 'center'}}>
            <div style={styles.title}>
              Who's In?
            </div>
            <div style={styles.summary}>
                Tackling issues you care about has never been easier.
            </div>
          </div>

        </div>
        <img style={{width: '100%', height: 'calc(100vh - 150px)', objectFit: 'cover'}}
          src='https://d3kkowhate9mma.cloudfront.net/e5ad2d71-5fed-41b8-a1bb-c6583fc77afa'/>

        <div style={{maxWidth: '1000px', width: '100%', display: 'flex'}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'left', padding: 24}}>
            <h2 style={styles.header}>
              The story
            </h2>
            <div style={styles.inkbar}/>

            <div style={styles.para}>
               More people than ever care about the big issues that society faces.
            </div>


            <div style={styles.para}>
                But while it's easier than ever to broadcast
               our feelings on social media, it's just as difficult as before to know what we can do to make
               a difference.
            </div>

            <div style={{marginTop: 20, fontWeight: 700, fontSize: '18px'}}>
              Our mission is to make 'making a difference' much easier.
            </div>
          </div>
          <img style={{width: '40%', height: '400px', objectFit: 'cover'}}
            src='https://d3kkowhate9mma.cloudfront.net/e5ad2d71-5fed-41b8-a1bb-c6583fc77afa'/>
        </div>

        <div style={{display: 'flex', justifyContent: 'center',
          backgroundColor: '#E55749', width: '100%', height: '90vh', color: 'white'}}>
          <div style={styles.inside}>
            <div style={styles.step}>
              Organisers create projects
            </div>

            <div style={styles.inkbar}/>
              <div style={{height: '40vh', width: '400px', backgroundColor: 'white', color: 'black'}}>
                Picture of a project
              </div>
          </div>
        </div>

        <div style={{display: 'flex', justifyContent: 'center',
          backgroundColor: '#65A1e7', width: '100%', height: '90vh', color: 'white'}}>
          <div style={styles.inside}>
            <div style={styles.step}>
              Projects aim to reach their targets
            </div>
            <div style={styles.inkbar}/>
              <div style={{height: '40vh', width: '400px', backgroundColor: 'white', color: 'black'}}>
                Picture of a project
              </div>
          </div>
        </div>


        <div style={{display: 'flex', justifyContent: 'center',
          backgroundColor: 'white', width: '100%', height: '90vh'}}>
          <div style={styles.inside}>
            <div style={styles.step}>
              Search for what you're interested in
            </div>
            <div style={styles.inkbar}/>
              <div style={{height: '40vh', width: '400px', backgroundColor: 'white', color: 'black'}}>
                Picture of searching
              </div>
          </div>
        </div>


        <div style={{display: 'flex', justifyContent: 'center',
          backgroundColor: '#FF9800', width: '100%', height: '90vh', color: 'white'}}>
          <div style={styles.inside}>
            <div style={styles.step}>
              Don't be lonely
            </div>
            <div style={styles.inkbar}/>
              <div style={{height: '40vh', width: '400px', backgroundColor: 'white', color: 'black'}}>
                Picture of inviting friends
              </div>
          </div>
        </div>


        <div style={{display: 'flex', justifyContent: 'center',
          backgroundColor: '#65A1e7', width: '100%', height: '90vh', color: 'white'}}>
          <div style={styles.inside}>
            <div style={styles.step}>
              Build a reputation
            </div>
            <div style={styles.inkbar}/>
              <div style={{height: '40vh', width: '400px', backgroundColor: 'white', color: 'black'}}>
                Picture of reviews and reviewing
              </div>
          </div>
        </div>

        <div style={{display: 'flex', justifyContent: 'center',
          backgroundColor: '#E55749', width: '100%', height: '40vh', color: 'white'}}>
          <div style={styles.inside}>
            <div style={styles.step}>
              Get started
            </div>
            <div style={styles.inkbar}/>
          </div>
        </div>

      </div>
    )
  }
}
