import React , {PropTypes} from 'react';
import Dropzone from 'react-dropzone';
import Place from 'material-ui/svg-icons/maps/place';
import {grey200, grey500, grey100, amber500, grey300, lightBlue50, grey700} from 'material-ui/styles/colors'
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import {Tabs, Tab} from 'material-ui/Tabs';
import FlatButton from 'material-ui/FlatButton';
import {Spiral} from './icons.jsx';
import SwipeableViews from 'react-swipeable-views';
import RaisedButton from 'material-ui/RaisedButton';
import MediaQuery from 'react-responsive';
import EmbeddedProject from './embeddedproject.jsx';
import {Link, browserHistory} from 'react-router';
import Loading from './loading.jsx';
import CharityProjectList from './charityprojectlist.jsx';
import fire from '../fire';

let db = fire.firestore()

const styles = {
  selectedTab: {
    height: '60px',
    backgroundColor: 'white',
    color: '#FF9800',
    textTransform: 'none',
    fontSize: '16px',
    letterSpacing: '0.4px',
    lineHeight: '16px',
    paddingLeft: '20px',
    paddingRight: '20px',
    fontWeight: 600
  },
  tab: {
    height: '60px',
    backgroundColor: 'white',
    color: '#484848',
    textTransform: 'none',

    fontSize: '16px',
    letterSpacing: '0.4px',
    lineHeight: '16px',
    paddingLeft: '20px',
    paddingRight: '20px',

  },
  secondHeader: {
    fontWeight: 200,
    fontSize: '48px',
    marginTop: 25,
    marginBottom: 25
  },
  secondBody: {
    fontWeight: 200,
    fontSize: '20px'
  },
  projectBox: {
    margin: 15,
    maxWidth: 350
  },
  mobileProjectBox: {
    marginTop: 15,
    marginBottom: 15
  },
  mobileSecondHeader: {
    fontWeight: 200,
    fontSize: '30px',
    marginTop: 25,
    marginBottom: 25
  },
  mobileSecondBody: {
    fontWeight: 200,
    fontSize: '15px'
  },
}

export function changeImageAddress(file, size) {
  var str = file, replacement = '/' + size + '/';
  str = str.replace(/\/([^\/]*)$/,replacement+'$1');
  return(str + '?pass=this')
}

class About extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{display: 'flex', padding: 24}}>
        <div style={{flex: 2, marginRight: 32}}>
          <h2>{this.props.charity.Name}</h2>
          {this.props.charity.Summary}
        </div>
        <div style={{flex: 1, textAlign: 'right'}}>
          <h2>
            Contact Us
          </h2>
          <div>
            {this.props.charity.Email}<br/>
            {this.props.charity.Phone}<br/>
            {this.props.charity.Postcode}<br/>
            {this.props.charity.Website}
          </div>
        </div>
      </div>
    )
  }
}

class CharityReviews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {reviews: []}
  }

  componentDidMount(props) {
    var data = []
    db.collection("ProjectReviews").where("Charity", "==", this.props.charityId).get().then((engSnapshot) => {
      console.log(engSnapshot)
      console.log(engSnapshot.size)
      engSnapshot.forEach((engDoc) => {
        console.log(engDoc.data())
        var elem = engDoc.data()
        elem['_id'] = engDoc.id
        data.push(elem)
      })
    })
    this.setState({reviews: data, loading: false})

  }

  render() {
    return (
      <div style={{display: 'flex', flexWrap: 'wrap', paddingLeft: '80px', paddingRight: '80px', paddingTop: '30px'}}>

        {this.state.reviews.length === 0 ?
          <div style={{margin: 20, borderRadius: 4, fontWeight: 700, height: '250px', width: '100%', display: 'flex', backgroundColor: 'rgb(247, 247, 247)', justifyContent: 'center' ,alignItems: 'center'}}>
            <div>
              This organisation does not yet have any reviews
            </div>
          </div>
          :
          this.state.reviews.map((review) => (
          <Link to={`/profile/${review.User}`}>
            <div style={{height: '200px', width: '150px', display: 'flex', alignItems: 'center', flexDirection: 'column',
            textAlign: 'center'}}>
              <img src={review['Volunteer Picture']} style={{borderRadius: '50%',
                height: '100px', width: '100px'}}/>
              <div style={{width: '100%', marginTop: 16}}>
                <b>{review.Name}</b><br/>
                {review['Project Name']}
              </div>
            </div>
          </Link>
        ))}
      </div>
    )
  }
}

class Supporters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {supporters: []}
  }

  componentDidMount(props) {
    var data = []
    db.collection("Engagement").where("Charity Number", "==", this.props.charityId).get().then((engSnapshot) => {
      console.log(engSnapshot)
      console.log(engSnapshot.size)
      engSnapshot.forEach((engDoc) => {
        console.log(engDoc.data())
        var elem = engDoc.data()
        elem['_id'] = engDoc.id
        data.push(elem)
      })
    })
    this.setState({supporters: data, loading: false})

  }

  render() {
    return (
      <div style={{display: 'flex', flexWrap: 'wrap', paddingLeft: '80px', paddingRight: '80px', paddingTop: '30px'}}>

        {this.state.supporters.length === 0 ?
          <div style={{margin: 20, borderRadius: 4, fontWeight: 700, height: '250px', width: '100%', display: 'flex', backgroundColor: 'rgb(247, 247, 247)', justifyContent: 'center' ,alignItems: 'center'}}>
            <div>
              This organisation does not yet have any supporters
            </div>
          </div>
          :
          this.state.supporters.map((supporter) => (
          <Link to={`/profile/${supporter.User}`}>
            <div style={{height: '200px', width: '150px', display: 'flex', alignItems: 'center', flexDirection: 'column',
            textAlign: 'center'}}>
              <img src={supporter['Volunteer Picture']} style={{borderRadius: '50%',
                height: '100px', width: '100px'}}/>
              <div style={{width: '100%', marginTop: 16}}>
                <b>{supporter.Name}</b><br/>
                {supporter['Project Name']}
              </div>
            </div>
          </Link>
        ))}
      </div>
    )
  }
}

export class CharityProjects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loading: true}
  }

  componentDidMount(props) {
    db.collection("Project").where("Charity", "==", this.props.charityId)
    .get().then((querySnapshot) => {
      var data = []
      querySnapshot.forEach((doc) => {
        console.log(doc.data())
        var elem = doc.data()
        elem['_id'] = doc.id
        data.push(elem)
      });
      console.log(data)
      this.setState({loading: false, projects: data})
    })
  }

  render() {
    console.log(this.state.loading)
    return (
      <div className='project-boxes-container' style={{display: 'flex', flexWrap: 'wrap'}}>
        {
          this.state.loading ?
            null :
            this.state.projects ?
              this.state.projects.map((project) => (
                <div className='project-box' style={styles.projectBox}>
                  <EmbeddedProject noLogo={true} project={project}/>
                </div>
              ))
             :
            <div style={{height: 200, width: '100%', display: 'flex', alignItems: 'center'}}>
              No projects just yet
            </div>
        }
      </div>
    )
  }
}

export class RecentCharityReviews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount(props) {
    db.collection("ProjectReviews").where("Charity", "==", this.props.charityId).orderBy("created", "desc")
    .limit(3).get().then((querySnapshot) => {
      var data = []
      querySnapshot.forEach((doc) => {
        console.log(doc.data())
        var elem = doc.data()
        elem['_id'] = doc.id
        data.push(elem)
      });
      this.setState({reviews: data})
      for (let i = 0; i < data.length; i++) {
        db.collection("User").doc(data[i].User).collection("public").doc(data[i].User).get().then((userDoc) => {
          data[i]['User Picture'] = userDoc.data().Picture
        })
      }
    })
  }

  render() {
    return (
      <div>
        {
          this.state.reviews ? this.state.reviews.map((review) => {
            <Link to={`/projects/${review['Project Name']}/${review.Project}`}>
              <div key={review._id} style={{display: 'flex', alignItems: 'center', paddingTop: 10, paddingBottom: 10}}>
                <img className='user-picture' style={{borderRadius: '50%', padding: 10, height: 70, width: 70, boxSizing: 'border-box'}}
                  src={review['User Picture']}/>
                <div className='review-body' style={{fontSize:'20px', fontWeight: 200}}>
                  {review.publicReview}
                </div>
              </div>
            </Link>
          })
          :
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: 60, backgroundColor: 'rgb(247,247,247)'}}>
            No reviews just yet
          </div>
        }
      </div>
    )
  }
}

export default class CharityProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {user: {}, loading: true, slideIndex: 0, left: '10%', selected: 'projects'}
  }

  handleClick(index, e) {
    e.preventDefault()
    this.setState({slideIndex: index})
  }

  componentDidMount(props) {
    db.collection("Charity").doc(this.props.params.charityId).get().then((doc) => {
      var charity = doc.data()
      charity['_id'] = doc.id
      this.setState({charity: charity, loading: false})
    })





  }

  handleChange = (value) => {
    this.setState({
      slideIndex: value,
    });
  };

  handleListClick(engagement, e) {
    browserHistory.push('/pages/projects/' + 'eng' + '/' + engagement.Project)
  }

  handleTwoTabClick = (value) => {
    var lookup = ['projects','supporters']
    this.setState({
      value: value,
      slideIndex: lookup.indexOf(value),
      left: lookup.indexOf(value) * 50 + 10 + '%'
    });
  }

  upload(file, rej) {
    console.log(this.state)
    console.log(file)
    console.log(rej)

    fetch('https://3ymyhum5sh.execute-api.eu-west-2.amazonaws.com/prod/getS3Url')
      .then(response => response.json())
      .then(function(data) {
        var stripped = data.substring(data.indexOf('amazonaws.com/') + 14, data.indexOf('?'))
        var imageUrl = 'https://d3kkowhate9mma.cloudfront.net/' + stripped


        console.log(changeImageAddress(imageUrl, '250xauto'))
        this.setState({imageUrl: imageUrl})
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                console.log(xhr.responseText);
            }
        }

        xhr.open('PUT', data , true);
        xhr.setRequestHeader('Content-Type', file[0].type);
        xhr.send(file[0]);
      }.bind(this))

      .catch(error => this.setState({ error }));

  }

  changeAnchorEl = (e) => {
    console.log('handleMultipleChoiceClick')
    e.preventDefault()
    console.log(e)
    var rect = e.target.getBoundingClientRect()
    console.log(rect)
    this.setState({inkBarLeft: (rect.width-100)/2  + rect.x - (window.document.body.clientWidth - 1000) /2,
    })
  }

  handleTwoTabClick = (value) => {
    this.setState({selected: value})
  }

  render() {
    console.log(this.state)
    return (
      <div >
        {this.state.loading ?
          <Loading/>
          :
          <div>
            <MediaQuery minDeviceWidth={700}>
              <div className='container' style={{paddingLeft: 100, paddingRight: 100, paddingTop: 32,
                  textAlign: 'left', boxSizing: 'border-box'}}>
                <div className='charity-header-container' style={{display: 'flex', alignItems: 'center'}}>
                  <img className='charity-logo-in-header'
                    src={this.state.charity['Featured Image']}
                    style={{borderRadius: '50%', height: 222, width: 222}}/>
                  <div className='charity-title-container' style={{paddingLeft: 50}}>
                    <div className='charity-title' style={{fontWeight: 'bold', fontSize: '54px'}}>
                      {this.state.charity.Name}
                    </div>
                    <div className='soc-media-container' style={{display: 'flex'}}>
                      <div className='fb-icon'>

                      </div>
                      <div className='fb-username'>
                        {this.state.charity.facebook}
                      </div>
                      <div className='twitter-icon'>

                      </div>
                      <div className='twitter-username'>
                        {this.state.charity.twitter}
                      </div>
                    </div>
                  </div>
                </div>

                <div className='about-review-container' style={{display: 'flex', width: '100%'}}>
                  <div className='about-container' style={{flex: 1, marginRight: 100}}>
                    <h2 className='about-header' style={styles.secondHeader}>
                      About
                    </h2>
                    <div className='about-body' style={styles.secondBody}>
                      {this.state.charity.Summary}
                    </div>
                  </div>
                  <div className='review-container' style={{flex: 1}}>
                    <h2 className='review-header' style={styles.secondHeader}>
                      Reviews
                    </h2>
                    <RecentCharityReviews charityId={this.state.charity._id} />
                  </div>
                </div>

                <div style={{height: 40}}/>
                <h2 className='project-header' style={styles.secondHeader}>
                  Projects
                </h2>

                <CharityProjects charityId={this.state.charity._id}/>

              </div>
            </MediaQuery>

            <MediaQuery maxDeviceWidth={700}>
              <div className='container' style={{paddingLeft: 24, paddingRight: 24,
                  textAlign: 'left', boxSizing: 'border-box'}}>
                <div className='charity-header-container'
                    style={{display: 'flex', flexDirection: 'column',alignItems: 'center'}}>
                  <img className='charity-logo-in-header'
                    src={this.state.charity['Featured Image']}
                    style={{borderRadius: '50%', height: 222, width: 222}}/>
                  <div className='charity-title-container'>
                    <div className='charity-title' style={{fontWeight: 'bold', fontSize: '45px', textAlign: 'center'}}>
                      {this.state.charity.Name}
                    </div>
                  </div>
                  <div className='soc-media-container' style={{display: 'flex'}}>
                    <div className='fb-icon'>

                    </div>
                    <div className='fb-username'>
                      {this.state.charity.facebook}
                    </div>
                    <div className='twitter-icon'>

                    </div>
                    <div className='twitter-username'>
                      {this.state.charity.twitter}
                    </div>
                  </div>
                </div>



                <div className='about-review-container' style={{display: 'flex', width: '100%'}}>
                  <div className='about-container' style={{flex: 1}}>
                    <h2 className='about-header' style={styles.mobileSecondHeader}>
                      About
                    </h2>
                    <div className='about-body' style={styles.mobileSecondBody}>
                      {this.state.charity.Summary}
                    </div>
                  </div>
                </div>

                <div>
                  <div className='review-container' style={{flex: 1}}>
                    <h2 className='review-header' style={styles.mobileSecondHeader}>
                      Reviews
                    </h2>
                    <RecentCharityReviews charityId={this.state.charity._id} />
                  </div>
                </div>

                <div style={{height: 40}}/>
                <h2 className='project-header' style={styles.mobileSecondHeader}>
                  Projects
                </h2>

                <CharityProjects charityId={this.state.charity._id}/>
              </div>
            </MediaQuery>
          </div>
        }
      </div>
    )
  }
}
