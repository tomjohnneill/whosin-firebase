import React from 'react';
import RaisedButton from 'material-ui/RaisedButton'

const styles = {
  number : {
    flex: 1, fontSize: '84px', textAlign: 'center', fontWeight: 'bold', lineHeight: '69px'
  },
  picture : {
    height: '100%', width: '100%', objectFit: 'cover'
  },
  para: {
    fontSize: '19px', lineHeight: '24px', fontWeight: 300, marginBottom: '16px'
  },
  text: {
    flex: 6
  },
  reason : {
    fontSize: '19px', lineHeight: '24px'
  },
  reasonHeader: {
    fontSize: '28px', lineHeight: '32px', paddingBottom: '10px', margin: 0
  }
}

export function changeImageAddress(file, size) {
  if (file && file.includes('https://d3kkowhate9mma.cloudfront.net')) {
    var str = file, replacement = '/' + size + '/';
    str = str.replace(/\/([^\/]*)$/,replacement+'$1');
    return(str + '?pass=this')
  } else {
    return (file)
  }
}

export default class Why extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <div style={{height: '80vh', width: '100%', position: 'relative'}}>
          <div style={{width: '100%', height: '100%', position: 'relative'}}>
            <img src='https://d3kkowhate9mma.cloudfront.net/8a39e19b-4eda-4269-924e-4d9605968c94'
               style={{position: 'relative', width: '100%', height: '100%', objectFit: 'cover'}}/>
          </div>
          <div style={{position: 'absolute', zIndex: 3, left: '10%', top: '60%'}}>
            <b>Hello there </b>
          </div>
          <div style={{position: 'absolute', zIndex: 3, width: '100%', bottom: '0px',
            backgroundImage: 'linear-gradient(-180deg, rgba(247,247,247,0.00) 0%, rgba(247,247,247,0.67) 60%, rgba(247,247,247,0.88) 80%, rgba(247,247,247,1.00) 100%)'
            , height: '200px'}}>

          </div>
          <div style={{position: 'absolute', zIndex: 3, left: '60%', top: '10%',
             padding: '40px', background: 'linear-gradient(to bottom, #ffffff, #F2F2F2)'}}>
            <h1 >Find more supporters</h1>
            How many volunteers could you find
          </div>
        </div>
        <div style={{width: '100%', height: 'auto',
            boxSizing: 'border-box',
           display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <div style={{display: 'flex', textAlign: 'left', maxWidth: '1050px', width: '100%', paddingTop: '48px', paddingBottom: '48px'}}>
            <span style={{flex: 1, marginRight: '24px'}}>
              <h2 style={styles.reasonHeader}>Why use Who's In?</h2>
                <span style={styles.reason}>
                  Whatever the project, Who's In? makes it simple to find new supporters and reach volunteers looking to help out with a cause like yours.
                </span>
            </span>
            <span style={{flex: 1, marginRight: '24px'}}>
              <h2 style={styles.reasonHeader}>You're in control</h2>
                <span style={styles.reason}>
                  With Who's In?, you're in control of when and where you run your project, how many people you need, and what the maximum number of people you can deal with.
                </span>
            </span>
            <span style={{flex: 1}}>
              <h2 style={styles.reasonHeader}>We'll help you out</h2>
              <span style={styles.reason}>
                We offer tools for contacting volunteers, conducting surveys, creating compelling impact summaries and demographic statistics for donors.
              </span>
            </span>
          </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'left'}}>
          <div style={{maxWidth: '1050px'}}>
            <h1 style={{marginBottom: '60px', marginTop: '60px'}}>How to start a project</h1>
            <div style={{display: 'flex', marginBottom: '70px'}}>
              <span style={styles.number}>
                1
              </span>
              <div style={styles.text}>
                <h2>Create your project page</h2>
                <div style={styles.para}>
                  It's free and easy to create a project page. Describe your project, tell people why you're doing it, and let them know when and where it's going to be.
                </div>
                <div style={styles.para}>
                  If you're a charity, we can even pull your details straight from the Charity Commission (so please use your charity email address).
                </div>
              </div>
              <div style={{flex: 6, marginLeft: '30px'}}>
                <img src='https://d3kkowhate9mma.cloudfront.net/64faaa69-5742-429d-9906-e6a8ea445b46'
                  style={styles.picture} />
              </div>
            </div>
            <div style={{display: 'flex', marginBottom: '70px'}}>
              <div style={{flex: 6, marginRight: '30px'}}>
                <img src='https://d3kkowhate9mma.cloudfront.net/64faaa69-5742-429d-9906-e6a8ea445b46'
                  style={styles.picture} />
              </div>
              <span style={styles.number}>
                2
              </span>
              <div style={styles.text}>
                <h2>Let us know what you want from volunteers</h2>
                <div style={styles.para}>
                  If you need to know anything about your volunteers, from demographic information to whether they have a DBS check, simply add that question to your project page.
                </div>
                <div style={styles.para}>
                  Let us know if you are looking for a certain skillset, or particular demographic for your funding, and we will show your project to the right potential volunteers.
                </div>
              </div>
            </div>
            <div style={{display: 'flex', marginBottom: '70px'}}>
              <span style={styles.number}>
                3
              </span>
              <div style={styles.text}>
                <h2>Get and give feedback</h2>
                <div style={styles.para}>
                  When your project is finished, we'll collect feedback from your volunteers, and compile it into one page, together with your summary of the event.
                </div>
                <div style={styles.para}>
                  Leave some feedback for your volunteers, it's a great way to share information across charities, and the best way to continue your volunteer's journey into a supporter.
                </div>
              </div>
              <div style={{flex: 6, marginLeft: '30px'}}>
                <img src='https://d3kkowhate9mma.cloudfront.net/64faaa69-5742-429d-9906-e6a8ea445b46'
                  style={styles.picture} />
              </div>
            </div>
          </div>
        </div>

        <div style={{backgroundImage: 'linear-gradient(0deg, rgba(229,248,242,1.00) 0%, rgba(242,247,235,1.00) 100%)'}}>
          <h1>Key worry factor</h1>
          <div>
            Set a minimum feasible number of volunteers
          </div>
          <div>
            Review your volunteers before they sign up
          </div>
          <div>
            Encourage people to bring their friends
          </div>

          <div>
            <img style={{height: '40vh', width: '100%'}}/>
          </div>
        </div>

        <div style={{position: 'relative'}}>
          <img src={changeImageAddress('https://d3kkowhate9mma.cloudfront.net/Why/night+walk.jpg', '1400xauto')}
            style={{width: '100%', height: 'auto', position: 'relative'}}/>
          <div style={{position: 'absolute', top: '30%', left: '20%', zIndex: 2,
          display: 'flex', alignItems: 'left', flexDirection: 'column'}}>
            <div style={{fontSize: '44px', lineHeight: '56px', marginBottom: '40px',
              fontWeight: 700, textAlign: 'left', maxWidth: '280px', color: 'white'}}>
              Start creating <br/> your project
            </div>
            <RaisedButton   labelStyle={{letterSpacing: '1.5px', fontWeight: 'bold',
              fontFamily: 'Permanent Marker', fontSize: '20px'}} label='Get Started' primary={true}/>
          </div>
        </div>
      </div>
    )
  }
}
