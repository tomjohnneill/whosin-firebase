import React , {PropTypes} from 'react';
import Dropzone from 'react-dropzone';
import Place from 'material-ui/svg-icons/maps/place';
import {grey200, grey500, grey100, amber500, grey300, lightBlue50} from 'material-ui/styles/colors'
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import SwipeableViews from 'react-swipeable-views';
import {Link, browserHistory} from 'react-router';
import {Spiral, Tick, AvatarIcon} from './icons.jsx'
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
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
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <div style={{display: 'flex' , paddingLeft: '10px', paddingTop: '60px',
               width: '100%', paddingRight: '10px', maxWidth: '1400px'
                ,boxSizing: 'border-box', flexWrap: 'wrap', justifyContent: 'center'}}>
              <div style={{marginBottom: '50px'}}>
                {this.state.user.public && this.state.user.public.Picture ?
                <img style={{height: '200px', width: '200px', objectFit: 'cover', borderRadius: '4px'}}
                  src={this.state.user.public && this.state.user.public.Picture ? this.state.user.public.Picture : null}/>
                :
                !this.state.publicProfile ?
                <PhotoUpload changeImage={this.changeImage} userId={this.state.userId}/>
                :
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center',
                  height: '200px', width: '200px', backgroundColor: '#DDDDDD', borderRadius: 6}}>
                  <AvatarIcon style={{height: '150px', width: '150px'}} color={'#484848'}/>
                </div>
                }
                <div style={styles.contactDetails}>
                  Email address
                  <Tick style={{height: '24.8px', float: 'right'}}/>
                </div>
                <div style={styles.contactDetails}>
                  Phone Number
                  <Tick style={{height: '24.8px', float: 'right'}}/>
                </div>

                <div style={{paddingTop: '10px', paddingBottom: '10px', borderBottom: 'solid 1px #DDDDDD',
                  borderTop: 'solid 1px #DDDDDD', marginTop: '30px', paddingLeft: '6px', textAlign: 'left',
                fontSize: '18px'}}>
                  Connected Accounts
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px'}}>
                    <FontIcon color={this.state.user.Facebook ? '#3b5998' : '#DDDDDD'}
                      className='fab fa-facebook fa-2x' style={{borderRadius: '50%',padding: '3px', height: '35px', width: '35px'}}/>
                    <FontIcon color={this.state.user.Linkedin ? '#0077b5' : '#DDDDDD'}
                      className='fab fa-linkedin fa-2x' style={{borderRadius: '50%',padding: '3px', height: '35px', width: '35px'}}/>
                    <FontIcon color={this.state.user.Twitter ? '#1DA1F2' : '#DDDDDD'}
                      className='fab fa-twitter fa-2x' style={{borderRadius: '50%',padding: '3px', height: '35px', width: '35px'}}/>
                    <FontIcon color={this.state.user.Messenger ? '#0084ff' : '#DDDDDD'}
                      className='fab fa-facebook-messenger fa-2x' style={{padding: '3px', height: '35px', width: '35px'}}/>
                  </div>
                </div>
              </div>
              <div style={{maxWidth: '50px', width: '5%'}}/>
              <div style={{minWidth: '350px', width: '30%', marginBottom: '50px'}}>
                <div style={{display: 'flex'}}>
                  <div style={{width: '50%', textAlign: 'left', fontFamily: 'Permanent Marker', fontSize: '24px'}}>
                    Hey, I'm {this.state.user.public ? this.state.user.public.Name.replace(/ .*/,'') : 'not telling you my name'}
                  </div>
                  <div style={{width: '50%', textAlign: 'right', fontFamily: 'Permanent Marker', color: '#FF9800', fontSize: '24px'}}>
                    6 Reviews
                  </div>
                </div>
                <div style={{textAlign: 'left', marginTop: '6px'}}>
                  {this.state.user.public ? this.state.user.public.Location : null} - Joined in 2018
                </div>
                <div style={{display: 'flex', alignItems: 'left', marginTop: 16, marginBottom: '50px'}}>
                  {this.state.publicProfile ? null :
                  <RaisedButton
                    secondary={true}
                    label='Edit Profile' labelStyle={{padding: '10px',fontFamily: 'Permanent Marker',
                      fontSize: '20px'}}
                      onTouchTap={() => browserHistory.push('/profile/edit')}
                      icon={<FontIcon className="fas fa-pencil-alt" style={{color: 'white'}}/>}
                       />
                   }

                </div>
                <RecentlySupported userId={this.state.userId}/>

              </div>
              <div style={{maxWidth: '50px', width: '5%'}}/>
              <div style={{minWidth: '350px', width: '40%'}}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  Verified user <Tick color={'#3B9E74'} style={{height: '50px' , marginLeft: '10px'}}/>

                </div>
                <div style={{backgroundColor: '#DDDDDD', height: '40vh', width: '100%', marginTop: '105px'}}>
                  Other interesting titbits
                </div>
              </div>
            </div>

          </div>
        }
      </div>
    )
  }
}
