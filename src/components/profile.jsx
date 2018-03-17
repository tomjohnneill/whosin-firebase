import React , {PropTypes} from 'react';
import Dropzone from 'react-dropzone';
import Place from 'material-ui/svg-icons/maps/place';
import {grey200, grey500, grey100, amber500, grey300, lightBlue50} from 'material-ui/styles/colors'
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import SwipeableViews from 'react-swipeable-views';
import {Link, browserHistory} from 'react-router';
import {Spiral, Tick, AvatarIcon, Muscle, Star, ReviewIcon, World} from './icons.jsx'
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import MediaQuery from 'react-responsive';
import Loading from './loading.jsx';
import fire from '../fire';

let db = fire.firestore()

export function changeImageAddress(file, size) {
  var str = file, replacement = '/' + size + '/';
  str = str.replace(/\/([^\/]*)$/,replacement+'$1');
  return(str + '?pass=this')
}

const styles = {
  contactDetails : {
    fontSize: '18px',
    fontWeight: 'lighter',
    padding: '6px',
    textAlign: 'left'
  },
  mobileContactDetails : {
    fontSize: '18px',
    fontWeight: 'lighter',
    padding: '6px',
    maxWidth: 250,
    width: '100%',
    textAlign: 'left'
  },
  profileHeader : {
    fontSize: '30px',
    fontWeight: 200,
    textAlign: 'left'
  },
  summaryContainer: {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'left',
    paddingLeft: 35,
    paddingTop: 6,
    paddingBottom: 6
  },
  summaryIcon: {
    height: 40,
    width: 40,
    marginRight: 16
  },
  summarySummary: {
    fontWeight: 200,
    fontSize: '18px'
  },
  mobileSummaryContainer: {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'left',
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 6,
    paddingBottom: 6
  },
  mobileSummaryIcon: {
    height: 40,
    width: 40,
    marginRight: 16
  },
  mobileSummarySummary: {
    fontWeight: 200,
    fontSize: '18px'
  }
}


export class PhotoUpload extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
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
                var body = {
                  'Picture': imageUrl
                }
                db.collection("User").doc(this.props.userId).update(body)
                this.props.changeImage(imageUrl)
            }
        }.bind(this)

        xhr.open('PUT', data , true);
        xhr.setRequestHeader('Content-Type', file[0].type);
        xhr.send(file[0]);
      }.bind(this))

      .catch(error => this.setState({ error }));

  }

  render() {
    console.log(this.props)


    return (
      <div>
        <Dropzone key={'photos'} onDrop={this.upload.bind(this)}  style={{}}>
              {({ isDragActive, isDragReject }) => {
                let styles = {
                  width: 'auto',
                  height: 100,
                  textAlign: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid rgb(133, 137, 135)',
                  borderRadius: 6,
                  color: grey500,
                  padding: 16,
                  boxSizing: 'border-box',
                  width: 250,
                  marginBottom: 16

                }

                const acceptedStyles = {
                  ...styles,
                  borderStyle: 'solid',
                  borderColor: '#6c6',
                  backgroundColor: '#eee'
                }

                const rejectStyles = {
                  ...styles,
                  borderStyle: 'solid',
                  borderColor: '#c66',
                  backgroundColor: '#eee'
                }

                if (isDragActive) {
                  return (
                    <div style={acceptedStyles}>
                      File will be accepted
                    </div>
                  )
                }
                if (isDragReject) {
                  return (
                    <div style={rejectStyles}>
                      File will be rejected
                    </div>
                  )
                }
                // Default case
                return (
                  <div style={styles}>
                    Drag and drop (or click) to upload
                  </div>
                )
              }}
            </Dropzone>
      </div>
    )
  }
}

class RecentlySupported extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount(props) {
    db.collection("Engagement").where("User", "==", this.props.userId).orderBy("created", "desc")
    .limit(10).get().then((querySnapshot) => {
      var data = []
      querySnapshot.forEach((doc) => {
        console.log(doc.data())
        var elem = doc.data()
        elem['_id'] = doc.id
        data.push(elem)
      });
      this.setState({projects: data})
    })
  }

  render() {
    return (
      <div>
        <div style={{borderBottom: 'solid 1px #DDDDDD'}}>
          <div style={{width: '50%', textAlign: 'left', display: 'inline-block'}}>
            Recently Supported
          </div>
          <div style={{width: '50%', textAlign: 'right', display: 'inline-block'}}>
            Turn up rate: <b style={{fontFamily: 'Permanent Marker'}}>100%</b>
          </div>
        </div>
        {
          this.state.projects ?
          this.state.projects.map((project) => (
            <Link to={'/projects/' + project['Project Name'] +'/' + project.Project}>
              <div style={{display: 'flex', paddingLeft: '18px', textAlign: 'left',
                paddingBottom: '20px', borderBottom: '1px solid #DDDDDD', paddingTop: '20px'}}>

                <div style={{width: '250px'}}>
                  <Spiral style={{height: '58px'}}/>
                <div>

                  <b>{project['Project Name']}</b><br/>
                {project.created.toLocaleString('en-GB', { timeZone: 'UTC' , weekday: 'long', day: 'numeric', month: 'long'})}
                </div>
                </div>
                <div style={{flex: 1}}>
                  <img style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: 2}}
                    src={project['Project Photo']}/>
                </div>
              </div>
            </Link>
          )) :
          null
        }
      </div>
    )
  }
}

class RecentReviews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount(props) {
    db.collection("UserReview").where("User", "==", this.props.userId).orderBy("created", "desc")
    .limit(10).get().then((querySnapshot) => {
      var data = []
      querySnapshot.forEach((doc) => {
        console.log(doc.data())
        var elem = doc.data()
        elem['_id'] = doc.id
        data.push(elem)
      });

      this.setState({projects: data})
      for (let i = 0; i < data.length; i++) {
        db.collection("Charity").doc(data[i]['Charity Number']).get().then((charityDoc) => {
          var charityData = charityDoc.data()
          console.log(charityData)
          data[i]['Charity Picture'] = charityData['Featured Image']
          data[i]['Charity Name'] = charityData['Name']
          console.log(data)
          this.setState({projects: data})
        })
      }
      this.setState({projects: data})
    })
  }

  render() {
    return (
      <div>
        {
          this.state.projects ?
          <div>
            <div className='profile-header' style={styles.profileHeader}>
              Reviews ({this.state.projects.length})
            </div>
            {this.state.projects.map((project) => (
              <Link to={'/projects/' + project['Project Name'] +'/' + project.Project}>
                <div style={{display: 'flex', padding: 30, textAlign: 'left', borderBottom: '1px solid #DDDDDD'}}>
                  <div>
                    {project['Charity Picture'] ?
                    <img
                      src={project['Charity Picture']}
                      style={{borderRadius: '50%', height: 57, width: 57}} className='logo'/>
                      :
                    <World style={{height: 57, width: 57}} color={'#484848'}/>
                    }
                    <div className='charity-name' style={{paddingTop: 6, fontSize: '12px'}}>
                      {project['Charity Name']}
                    </div>
                  </div>

                  <div className='review-detail-container' style={{display: 'flex',
                    flexDirection: 'column', justifyContent: 'space-between',
                    paddingLeft: 40}}>
                    <div className='review-content' style={{fontSize: '15px', paddingBottom: 20}}>
                      {project['Review']}
                    </div>
                    <div className='review-project' style={{fontWeight:700, fontSize: '11px'}}>
                      For the project {project['Project Name']}, {project.created.toLocaleString('en-gb', {month: 'long', year: 'numeric'})}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
             :
          null
        }
      </div>
    )
  }
}

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {user: {}, loading: true, slideIndex: 0}
    console.log(this.props)
  }

  componentDidMount(props) {
    fire.auth().onAuthStateChanged((user) => {
          var userId
          var publicProfile = true
          if (this.props.params._id) {
            userId = this.props.params._id
            if (user && user.uid === this.props.params._id) {
              publicProfile = false
            }
          } else if (user) {
            userId = user.uid
            publicProfile = false
          } else {
            userId = null
          }
          this.setState({userId: userId, publicProfile: publicProfile})
          console.log(this.state)

            db.collection("User").doc(userId).collection("public").doc(userId).get().then((publicDoc) => {
              var publicData = publicDoc.data()
              user.public = publicData
              this.setState({user: user, loading: false, engagements: [], reviews: []})
            })
            .catch(error => console.log('Error', error))
        })


  }

  handleChange = (value) => {
    this.setState({
      slideIndex: value,
    });
  };

  handleListClick(engagement, e) {
    browserHistory.push('/projects/' + 'eng' + '/' + engagement.Project)
  }

  changeImage = (imageUrl) => {
    var user = this.state.user
    user['Picture'] = imageUrl
    user.public['Picture'] = imageUrl
    this.setState({user: user})
  }


  render() {
    console.log(this.state)

    return (
      <div className='block'>
        {this.state.loading ?
          <Loading/>
          :
          this.state.error ?
          <div>
            We're really sorry, something didn't quite work
          </div>
          :

          <div style={{display: 'flex'}}>
            <MediaQuery minDeviceWidth={700}>
              <div style={{display: 'flex' , paddingLeft: '200px', paddingTop: '60px',
                 width: '100%', paddingRight: '100px'
                  ,boxSizing: 'border-box'}}>
                <div style={{marginBottom: '50px'}}>
                  {this.state.user.public && this.state.user.public.Picture ?
                  <img style={{height: '250px', width: '250px', objectFit: 'cover', borderRadius: '4px'}}
                    src={this.state.user.public && this.state.user.public.Picture ? this.state.user.public.Picture : null}/>
                  :
                  !this.state.publicProfile ?
                  <PhotoUpload changeImage={this.changeImage} userId={this.state.userId}/>
                  :
                  <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center',
                    height: '250px', width: '250px', backgroundColor: '#DDDDDD', borderRadius: 6}}>
                    <AvatarIcon style={{height: '150px', width: '150px'}} color={'#484848'}/>
                  </div>
                  }
                  <div style={styles.contactDetails}>
                    Verified User
                    <Tick color={'#3B9E74'} style={{height: '24.8px', float: 'right'}}/>
                  </div>
                  <div style={styles.contactDetails}>
                    Email Address
                    <Tick style={{height: '24.8px', float: 'right'}}/>
                  </div>
                  <div style={styles.contactDetails}>
                    Phone Number
                    <Tick style={{height: '24.8px', float: 'right'}}/>
                  </div>

                  <div style={{paddingTop: '10px', paddingBottom: '10px',
                    borderTop: 'solid 1px #DDDDDD', marginTop: '30px', paddingLeft: '6px', textAlign: 'left',
                  fontSize: '18px'}}/>

                </div>
                <div style={{marginLeft: 50, width: 600, marginBottom: '50px'}}>
                  <div style={{float: 'right', alignItems: 'left'}}>
                    {this.state.publicProfile ? null :
                    <FlatButton
                      secondary={true}
                      label='Edit Profile' labelStyle={{textTransform: 'none', padding: '10px', fontSize: '16px'}}
                        onTouchTap={() => browserHistory.push('/profile/edit')}
                        icon={<FontIcon className="fas fa-pencil-alt" style={{color: '#65A1e7'}}/>}
                         />
                     }
                  </div>
                  <div style={{width: '100%'}}>


                  </div>
                  <div style={{textAlign: 'left', marginTop: '6px', fontWeight: 700}}>
                    {this.state.user.public ? this.state.user.public.Location : null} - Joined in 2018
                  </div>
                  <div style={{height: 30}}/>

                  <div className='profile-header' style={styles.profileHeader}>
                    Summary
                  </div>
                  <div className='all-three' style={{marginTop: 20, marginBottom: 20}}>
                    <div className='summary-container' style={styles.summaryContainer}>
                      <div className='summary-icon' style={styles.summaryIcon}>
                        <Muscle style={styles.summaryIcon} color={'#484848'}/>
                      </div>
                      <div className='summary-summary' style={styles.summarySummary}>
                        {this.state.user.public ? this.state.user.public.Name.replace(/ .*/,'') : 'Anon'} has joined {this.state.user.public.ProjectCount ? this.state.user.public.ProjectCount : 0} projects
                      </div>
                    </div>
                    <div className='summary-container' style={styles.summaryContainer}>
                      <div className='summary-icon' style={styles.summaryIcon}>
                        <ReviewIcon style={styles.summaryIcon} color={'#484848'}/>
                      </div>
                      <div className='summary-summary' style={styles.summarySummary}>
                        {this.state.user.public ? this.state.user.public.Name.replace(/ .*/,'') : 'Anon'} has been recommended
                          by {this.state.user.public.RecommendedCount ? this.state.user.public.RecommendedCount : 0} projects
                      </div>
                    </div>
                    <div className='summary-container' style={styles.summaryContainer}>
                      <div className='summary-icon' style={styles.summaryIcon}>
                        <Star style={styles.summaryIcon} color={'#484848'}/>
                      </div>
                      <div className='summary-summary' style={styles.summarySummary}>
                        100% turn up rate
                      </div>
                    </div>
                  </div>

                  <RecentReviews userId={this.state.userId}/>

                </div>

              </div>
            </MediaQuery>


            <MediaQuery maxDeviceWidth={700}>
              <div style={{padding: 24,
                 width: '100%', boxSizing: 'border-box'}}>
                <div style={{marginBottom: 20}}>
                  {this.state.user.public && this.state.user.public.Picture ?
                  <img style={{height: '250px', width: '250px', objectFit: 'cover', borderRadius: '4px'}}
                    src={this.state.user.public && this.state.user.public.Picture ? this.state.user.public.Picture : null}/>
                  :
                  !this.state.publicProfile ?
                  <PhotoUpload changeImage={this.changeImage} userId={this.state.userId}/>
                  :
                  <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center',
                    height: '250px', width: '250px', backgroundColor: '#DDDDDD', borderRadius: 6}}>
                    <AvatarIcon style={{height: '150px', width: '150px'}} color={'#484848'}/>
                  </div>
                  }
                  <div style={{width: '100%'}}>
                    <div style={{ textAlign: 'center', fontSize: '36px', fontWeight: 700, paddingTop: 15}}>
                      Hey, I'm {this.state.user.public ? this.state.user.public.Name.replace(/ .*/,'') : 'not telling you my name'}
                    </div>

                  </div>
                  <div style={{textAlign: 'center', marginTop: '6px', fontWeight: 700}}>
                    {this.state.user.public ? this.state.user.public.Location : null} - Joined in 2018
                  </div>
                  <div style={{marginTop: 16}}>
                    {this.state.publicProfile ? null :
                    <FlatButton
                      secondary={true}
                      label='Edit Profile' labelStyle={{textTransform: 'none', padding: '10px', fontSize: '16px'}}
                        onTouchTap={() => browserHistory.push('/profile/edit')}
                        icon={<FontIcon className="fas fa-pencil-alt" style={{color: '#65A1e7'}}/>}
                         />
                     }
                  </div>

                  <div style={{paddingTop: 20, display: 'flex', alignItems: 'center', width: '100%', flexDirection: 'column'}}>
                    <div style={styles.mobileContactDetails}>
                      Verified User
                      <Tick color={'#3B9E74'} style={{height: '24.8px', float: 'right'}}/>
                    </div>
                    <div style={styles.mobileContactDetails}>
                      Email Address
                      <Tick style={{height: '24.8px', float: 'right'}}/>
                    </div>
                    <div style={styles.mobileContactDetails}>
                      Phone Number
                      <Tick style={{height: '24.8px', float: 'right'}}/>
                    </div>
                  </div>

                  <div style={{paddingTop: '10px', paddingBottom: '10px',
                    borderTop: 'solid 1px #DDDDDD', marginTop: '30px', paddingLeft: '6px', textAlign: 'left',
                  fontSize: '18px'}}/>

                </div>
                <div>


                  <div className='profile-header' style={styles.profileHeader}>
                    Summary
                  </div>
                  <div className='all-three' style={{marginTop: 20, marginBottom: 20}}>
                    <div className='mobile-summary-container' style={styles.mobileSummaryContainer}>
                      <div className='mobile-summary-icon' style={styles.mobileSummaryIcon}>
                        <Muscle style={styles.mobileSummaryIcon} color={'#484848'}/>
                      </div>
                      <div className='mobile-summary-summary' style={styles.mobileSummarySummary}>
                        {this.state.user.public ? this.state.user.public.Name.replace(/ .*/,'') : 'Anon'} has joined {this.state.user.public.ProjectCount ? this.state.user.public.ProjectCount : 0} projects
                      </div>
                    </div>
                    <div className='mobile-summary-container' style={styles.mobileSummaryContainer}>
                      <div className='mobile-summary-icon' style={styles.mobileSummaryIcon}>
                        <ReviewIcon style={styles.mobileSummaryIcon} color={'#484848'}/>
                      </div>
                      <div className='mobile-summary-summary' style={styles.mobileSummarySummary}>
                        {this.state.user.public ? this.state.user.public.Name.replace(/ .*/,'') : 'Anon'} has been recommended
                          by {this.state.user.public.RecommendedCount ? this.state.user.public.RecommendedCount : 0} projects
                      </div>
                    </div>
                    <div className='mobile-summary-container' style={styles.mobileSummaryContainer}>
                      <div className='mobile-summary-icon' style={styles.mobileSummaryIcon}>
                        <Star style={styles.mobileSummaryIcon} color={'#484848'}/>
                      </div>
                      <div className='mobile-summary-summary' style={styles.mobileSummarySummary}>
                        100% turn up rate
                      </div>
                    </div>
                  </div>

                  <RecentReviews userId={this.state.userId}/>

                </div>

              </div>
            </MediaQuery>
          </div>
        }
      </div>
    )
  }
}
