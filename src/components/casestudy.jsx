import React from 'react';
import MediaQuery from 'react-responsive';
import fire from '../fire';
import Loading from './loading.jsx';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Avatar from 'material-ui/Avatar';
import {Spiral, CalendarIcon, Place, Clock, World, Tick} from './icons.jsx';
import {Link, browserHistory} from 'react-router';
import Divider from 'material-ui/Divider';
import {WhosIn} from './desktopproject.jsx';
import Social from 'material-ui/svg-icons/social/notifications';
import InstagramEmbed from 'react-instagram-embed'
import { TwitterTweetEmbed} from 'react-twitter-embed';
import Masonry from 'react-masonry-css';
import FontIcon from 'material-ui/FontIcon';
import {changeImageAddress} from './desktopproject.jsx';

let db = fire.firestore()

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service

  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return null;
    }
    return this.props.children;
  }
}

export default class CaseStudy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loading: true, socials: [], stats:
    {
      twitter: {},
      instagram: {}
    }}
  }

  getTweets = (hashtag) => {
    fetch(`https://us-central1-whos-in-firebase.cloudfunctions.net/getTwitterKey?hashtag=${encodeURIComponent(hashtag)}`)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      var socials = this.state.socials
      socials = socials.concat(data.tweets)
      var twitterLikes = 0
      var twitterComments = 0
      var twitterFollowers = 0
      for (let i = 0; i < data.tweets.length; i++) {
        twitterLikes += data.tweets[i].favorite_count ? data.tweets[i].favorite_count : 0
        twitterComments += data.tweets[i].reply_count ? data.tweets[i].reply_count : 0
        twitterFollowers += data.tweets[i].user.followers_count ? data.tweets[i].user.followers_count : 0
      }
      shuffle(socials)
      this.setState({socials: socials})
      var stats = this.state.stats ? this.state.stats : {}
      stats.twitter = {
        likes: twitterLikes,
        comments: twitterComments,
        followers: twitterFollowers
      }
      this.setState({stats: stats})
      console.log(this.state.stats)
    })
  }

  getInstas = (hashtag) => {
    fetch(`https://www.instagram.com/explore/tags/${hashtag.substring(1)}/?__a=1`)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      this.setState({instas: data.graphql.hashtag.edge_hashtag_to_media.edges})
      var edges = data.graphql.hashtag.edge_hashtag_to_top_posts.edges
      var instagramLikes = 0
      var instagramComments = 0
      var instagramFollowers = 0
      var userIds = {}
      for (let i = 0; i < edges.length; i++) {
        instagramLikes += edges[i].node.edge_liked_by.count
        instagramComments += edges[i].node.edge_media_to_comment.count
        if (!userIds[edges[i].node.owner.id]) {
          userIds[edges[i].node.owner.id] = true
          fetch(`https://www.instagram.com/p/${edges[i].node.shortcode}/?__a=1`)
          .then(response => response.json())
          .then(data => {
            console.log(data)
            return fetch(`https://www.instagram.com/${data.graphql.shortcode_media.owner.username}/?__a=1`)
          })
          .then(response => response.json())
          .then(data => {
            instagramFollowers += data.graphql.user.edge_followed_by.count
            let statestats = this.state.stats
            statestats.instagram.followers = instagramFollowers
            this.setState({stats: statestats})
          })
        }
      }
      var socials = this.state.socials
      socials = socials.concat(edges)
      shuffle(socials)
      this.setState({socials: socials})
      var stats = this.state.stats ? this.state.stats : {}
      stats.instagram = {
        likes: instagramLikes,
        comments: instagramComments
      }
      this.setState({stats: stats})
    })
  }

  componentDidMount(props) {
    if (localStorage.getItem('project')) {
      let project = JSON.parse(localStorage.getItem('project'))
      if (typeof project['Start Time'] === 'string') {
        project['Start Time'] = new Date(project['Start Time'])
        project['End Time'] = new Date(project['End Time'])
      }
      this.setState({loading: false, project: project})
      localStorage.removeItem('project')
    }

    db.collection("Project").doc(this.props.location.query.project ?
      this.props.location.query.project : this.props.params._id).get().then((doc) => {
      var project = doc.data()
      project._id = doc.id
      this.setState({loading: false, project: project, charity: {}})
      this.getTweets('#thamescleanup')
      this.getInstas('#thamescleanup')
      if (project.Charity) {
        if (fire.auth().currentUser) {
          db.collection("Charity").doc(project.Charity)
            .collection("Subscribers").doc(fire.auth().currentUser.uid).get().then((doc) => {
              if (doc.exists) {
                this.setState({subscribed: true})
              } else {
                this.setState({subscribed: false})
              }
            })
        }

        fire.auth().onAuthStateChanged((user) => {
          if (user === null) {

          } else {
            console.log('registering user as logged in')
            db.collection("Charity").doc(project.Charity)
              .collection("Subscribers").doc(fire.auth().currentUser.uid).get().then((doc) => {
                console.log(doc)
                if (doc.exists) {
                  this.setState({subscribed: true})
                } else {
                  this.setState({subscribed: false})
                }
              })
        }
      })
        db.collection("Charity").doc(project.Charity.toString()).get().then((charityDoc) => {
            var charity = charityDoc.data() ? charityDoc.data() : {}
            charity._id = charityDoc.id
            this.setState({ charity: charity, loading: false})
          })
          .catch(error => console.log('Error', error))
      } else {
        db.collection("User").doc(project.Creator).collection("public").doc(project.Creator).get().then((userDoc) => {
          var creator = userDoc.data()
          this.setState({creator: creator})
        })
      }
    })
    .catch(error => console.log('Error', error));
  }

  descriptionMarkup() {
    return {__html: this.state.project.Description ?
      this.state.project.Description.replace('<img', '<img style="width:100%;height:auto"') : this.state.project.Description}
  }

  render() {
    console.log(this.state.tweets)
    return (
      <div>
        {this.state.loading ?
          <Loading/>
          :
          <div>
            <MediaQuery minDeviceWidth={700}>
              <img
                src={changeImageAddress(this.state.project['Featured Image'], '1500xauto')}
                style={{height: '400px', width: '100%', position: 'relative',
                  objectPosition: this.state.project.imageY ? `50% ${this.state.project.imageY}`  : '50% 50%'
                , objectFit: 'cover'}}/>
                <div className='container' style={{width: '100%', paddingRight: 100, paddingTop: 30,
                    paddingLeft: 100, display: 'flex', boxSizing: 'border-box'}}>
                  <div className='story-etc' style={{flex: 1}}>
                    {fire.auth().currentUser && this.state.project.Creator === fire.auth().currentUser.uid ?
                      <div style={{display: 'flex', float: 'right'}}>
                        <FlatButton
                          secondary={true}
                          style={{marginRight: 20}}
                          label='Admin View' labelStyle={{textTransform: 'none', fontWeight: 700, padding: '10px', fontSize: '16px'}}
                            onTouchTap={() => browserHistory.push(window.location.pathname + '/admin/admin')}
                             />
                       <FlatButton
                         secondary={true}
                         style={{marginRight: 20}}
                         label='Edit Project' labelStyle={{textTransform: 'none', padding: '10px', fontWeight: 700,  fontSize: '16px'}}
                           onTouchTap={() => browserHistory.push(window.location.pathname + '/admin/editproject')}
                            />
                     </div>
                       : null
                     }
                    <p className='mobile-project-title'
                      style={{fontSize: '32px', fontWeight: 'bold', textAlign: 'left',
                      margin: 0}}>
                      {this.state.project.Name}
                    </p>

                    {this.state.project.Charity ?
                      <Link  className='charity-link' to={`/charity/${this.state.charity._id}`}>
                        <div className='charity-link-content'
                           style={{display: 'flex', marginTop: 6, alignItems: 'center', color: '#65A1e7'}}>
                          <div style={{marginRight: 10}} className='charity-icon'>
                            {this.state.charity['Featured Image'] ?
                              <img src={changeImageAddress(this.state.charity['Featured Image'], '50xauto')}
                                style={{height: 25, width: 25, borderRadius: '50%', objectFit: 'cover'}}/>
                              :
                              <World style={{height: 25, width: 25}} color={'#484848'}/>
                              }
                          </div>
                          <p className='charity-name' style={{margin: 0, fontSize: '14px'}}>
                              {this.state.charity.Name}
                          </p>
                        </div>
                      </Link>
                      :
                      <Link  className='charity-link' to={`/profile/${this.state.project.Creator}`}>
                        <div className='charity-link-content'
                           style={{display: 'flex', marginTop: 6, alignItems: 'center', color: '#65A1e7'}}>
                          <div style={{marginRight: 10}} className='charity-icon'>
                            {this.state.creator && this.state.creator.Picture ?
                              <Avatar src={this.state.creator.Picture}/>
                              :
                              <Avatar>{this.state.creator ? this.state.creator.Name.substring(0,1) : null}</Avatar>
                            }

                          </div>
                          <p className='charity-name' style={{margin: 0, fontSize: '14px'}}>
                              {this.state.creator ? this.state.creator.Name : null}
                          </p>
                        </div>
                      </Link>
                    }


                    <div style={{
                      borderRadius: 4, display: 'flex',
                       paddingTop: 10, textAlign: 'left'}}
                      className='datetime-container'>
                      {this.state.project['Start Time'] ?
                      <div className='date-container' style={{display: 'flex'}}>
                        <div className='date-icon'>
                          <CalendarIcon color={'black'} style={{height: 20, width: 20, marginRight: 10}}/>
                        </div>
                        <div>
                          {this.state.project['Start Time'].toLocaleString('en-gb',
                            {weekday: 'long', month: 'long', day: 'numeric'})}
                        </div>
                      </div>
                      : null}
                      {this.state.project['Start Time'] ?
                      <div className='time-container' style={{display: 'flex', marginLeft: 24}}>
                        <div className='time-icon'>
                          <Clock color={'black'} style={{height: 20, width: 20, marginRight: 10}}/>
                        </div>
                        <div >
                          {this.state.project['Start Time'].toLocaleString('en-gb',
                            {hour: '2-digit', minute: '2-digit'})} -
                            {this.state.project['End Time'].toLocaleString('en-gb',
                              {hour: '2-digit', minute: '2-digit'})}
                        </div>
                      </div>
                      : null}


                      {this.state.project.Location ?
                        <div className='location-container' style={{display: 'flex', marginLeft: 24}}>
                          <div className='location-icon'>
                            <Place color={'black'} style={{height: 20, width: 20, marginRight: 10}}/>
                          </div>
                          <a href={`https://www.google.com/maps/?q=${this.state.project.Location}`} target='_blank' rel='noopener' style={{color: '#65A1e7', textAlign: 'left'}}>
                            {this.state.project.Location}
                          </a>
                        </div>
                        : null
                      }
                    </div>
                  </div>
                </div>

                <div style={{paddingLeft: 100, paddingRight: 100, textAlign: 'left', display: 'flex'}}>
                  <div style={{flex:2, marginRight: 100}}>
                    <h2 style={{fontSize: '32px'}}>What happened?</h2>
                      <div style={{marginBottom: '30px', fontSize: '16px', lineHeight: '22px'}}
                        className='story-text'
                         dangerouslySetInnerHTML={this.descriptionMarkup()}/>
                      </div>
                  <div style={{flex: 1}}>
                    <h2 style={{fontSize: '32px'}}>Who was in?</h2>
                    <WhosIn project={this.state.project}/>
                  </div>
                </div>

                <div style={{paddingLeft: 100, paddingRight: 100, textAlign: 'left', marginTop: 50}}>
                  <h2 style={{fontSize: '32px'}}>What did people think?</h2>



                    <Masonry
                      breakpointCols={3}
                      className="my-masonry-grid"
                      columnClassName="my-masonry-grid_column">
                          {this.state.socials ?
                            this.state.socials.map((media) => (


                                <div style={{margin:20}}>
                                  {media.node ?
                                    <ErrorBoundary>
                                      <InstagramEmbed
                                          url={'https://instagr.am/p/' + media.node.shortcode}
                                          maxWidth={350}
                                          style={{width: 350}}
                                          hideCaption={false}
                                          containerTagName='div'
                                          protocol=''
                                          onLoading={() => {}}
                                          onSuccess={() => {}}
                                          onAfterRender={() => {}}
                                          onFailure={() => {}}
                                          />
                                      </ErrorBoundary>
                                      :
                                      <div style={{maxWidth: 350}}>
                                        <TwitterTweetEmbed
                                          style={{width: 350}}
                                          tweetId={media.id_str}
                                        />
                                    </div>
                                  }
                                </div>
                              ))
                            :
                            null
                          }
                    </Masonry>
                </div>

                <div style={{paddingLeft: 100, paddingRight: 100, textAlign: 'left', marginTop: 50}}>
                  <h2 style={{fontSize: '32px'}}>Lies, damned lies and...</h2>
                  <div style={{height: 400, fontWeight: 700, fontSize: '24px', textAlign: 'center',
                       background: 'linear-gradient(to bottom right, rgba(101, 161, 231,1), rgba(101, 161, 231,0.8))',
                       color: 'rgba(255,255,255,0.9)', display: 'flex', borderRadius: 4}}>
                    <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
                      <p style={{fontWeight: 200, marginTop: 0}}>
                        Likes
                      </p>
                      <div style={{height: 100, width: 100, borderRadius: '50%', marginBottom: 20,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white'}}>
                        <FontIcon className='far fa-heart' color='#484848'/>
                      </div>
                      <span style={{fontWeight: 200}}>Twitter:</span> {this.state.stats.twitter.likes}
                      <br/><span style={{fontWeight: 200}}>Instagram:</span> {this.state.stats.instagram.likes}
                    </div>
                    <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
                      <p style={{fontWeight: 200, marginTop: 0}}>
                        Replies
                      </p>
                      <div style={{height: 100, width: 100, borderRadius: '50%', marginBottom: 20,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white'}}>
                        <FontIcon className='far fa-comments' color='#484848'/>
                      </div>
                      <span style={{fontWeight: 200}}>Twitter:</span> {this.state.stats.twitter.comments}
                      <br/><span style={{fontWeight: 200}}>Instagram:</span> {this.state.stats.instagram.comments}
                    </div>

                    <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
                      <p style={{fontWeight: 200, marginTop: 0}}>
                        Reach
                      </p>
                      <div style={{height: 100, width: 100, borderRadius: '50%', marginBottom: 20,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white'}}>
                        <FontIcon className='fas fa-users' color='#484848'/>
                      </div>
                      <span style={{fontWeight: 200}}>Twitter:</span> {this.state.stats.twitter.followers}
                      <br/><span style={{fontWeight: 200}}>Instagram:</span> {this.state.stats.instagram.followers}
                    </div>

                  </div>
                </div>

                {this.state.project.Charity ?
                  <div style={{paddingLeft: 100, paddingRight: 100, textAlign: 'left', marginTop: 50}}>
                    <h2>Want in next time?</h2>
                    <div style={{height: 250, display: 'flex', alignItems: 'center',
                      flexDirection: 'column', justifyContent: 'center'}}>
                      {this.state.subscribed ?
                        <RaisedButton
                          label='Unsubscribe'

                          icon={<Social/>}
                          onClick={this.unsubscribeUser}
                          />
                        :

                      <RaisedButton
                        label='Subscribe'
                        labelStyle={{fontWeight: 700}}
                        icon={<Social/>}
                        onClick={this.handleSubscribe}
                        secondary={true}/>
                    }
                      <div style={{padding: 24}}>
                        We’ll let you know next time this organisation runs a project
                      </div>
                    </div>
                  </div>
                  :
                  null}
            </MediaQuery>
            <MediaQuery maxDeviceWidth={700}>

            </MediaQuery>
          </div>
        }
      </div>
    )
  }
}
