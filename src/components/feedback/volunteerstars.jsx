import React from 'react';
import MediaQuery from 'react-responsive';
import {grey200, grey500, red500, red100, orange500, orange100, yellow500,
  yellow100, limeA200, limeA700, green300} from 'material-ui/styles/colors'
import {Tick, Cross, Spiral} from '../icons.jsx';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import fire from '../../fire';


let db = fire.firestore()

const styles = {
  smallIcon: {
    width: 36,
    height: 36,
  },
  mediumIcon: {
    width: 48,
    height: 48,
  },
  tickMed: {
    width: 58,
    height:58
  },
  largeIcon: {
    width: 60,
    height: 60,
  },
  small: {
    width: 72,
    height: 72,
    padding: 16,
  },
  medium: {
    width: 96,
    height: 96,
  },
  large: {
    width: 96,
    height: 96,

  },
  circle : {
    borderRadius: '50%',
    border: '2px solid ' + grey200,
    color: grey500,
    width: 36,
    fontWeight: 700,
    height: 36,
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  badRating : {
    borderRadius: '50%',
    border: '2px solid rgb(182,48,43)',
    color: 'white',
    width: 36,
    fontWeight: 700,
    height: 36,
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(182,48,43)'
  },
  middleRating : {
    borderRadius: '50%',
    border: '2px solid ' + yellow500,
    color: 'inherit',
    width: 36,
    fontWeight: 700,
    height: 36,
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: yellow500
  },
  goodRating : {
    borderRadius: '50%',
    border: '2px solid ' + 'rgb(59,158,116)',
    color: 'white',
    width: 36,
    fontWeight: 700,
    height: 36,
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(59,158,116)'
  }
}

export default class VolunteerStars extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loading: true, stage: 1}
  }

  scrollToBottom = () => {
    this.el.scrollIntoView({ behavior: "smooth" });
  }

  componentDidMount(props) {
    db.collection("Engagement").where("User", "==", this.props.params.userId)
    .where("Project", "==", this.props.params._id).get().then((querySnapshot) => {
      if (querySnapshot.size > 0) {
        var data = []
        querySnapshot.forEach((doc) => {
          var elem = doc.data()
          elem['_id'] = doc.id
          data.push(elem)
        })
        this.setState({engagement: data[0], loading: false})
      }
    })
  }

  handleRating = (rating) => {
    this.scrollToBottom()
    this.setState({rating: rating})
  }

  handleCrossClick = () => {
    this.setState({turnedUp: false})
  }

  handleTickClick = () => {
    this.setState({turnedUp: true})
  }

  handleMoveToNextStage = () => {
    var body = {
      Project: this.props.params._id,
      User: this.props.params.userId,
      Rating: this.state.turnedUp ? this.state.rating : 1,
      "Turned Up" : this.state.turnedUp,
      "Project Name": this.state.engagement['Project Name'],
      created : new Date ()
    }
    db.collection("UserReview").add(body).then((doc) => {
      this.setState({reviewId: doc.id})
    })
    this.setState({stage: 2})
  }

  handleSetAdditional = (e) => {
    this.setState({additional: e.target.value})
  }

  handleSaveReview = () => {
    db.collection("UserReview").doc(this.state.reviewId).update({
      Review: this.state.additional
    })
  }

  render() {
    return (
      <div >

          {this.state.loading ?
          null :
          <div   style={{textAlign: 'left', padding: 24, paddingBottom: 50}}>
            <div>
              {this.state.engagement['Volunteer Picture'] ?
                <img src={this.state.engagement['Volunteer Picture']}
                  style={{height: '100px', width: '100px', objectFit: 'cover', borderRadius: 6}}/>
                :
                <Spiral style={{height: '150px', width: '150px'}} color={'#FF9800'}/>
              }
            </div>
            <div>
              <b>{this.state.engagement['Name']}</b>
            </div>
            <div>
              {this.state.engagement['Project Name']}
            </div>
            {this.state.engagement['Project Date'] ?
            <div>
              {this.state.engagement['Project Date']}
            </div>
            : null}

            {this.state.stage === 1 ?
              <div>
              <h2 style={{marginTop: 36}}>
                Did they turn up?
              </h2>
              <div style={{display: 'flex',
                  alignItems: 'center', justifyContent: 'center'}}>
                <IconButton
                  onTouchTap={this.handleCrossClick}
                  iconStyle={styles.mediumIcon}
                  style={styles.medium}>
                  <Cross color={this.state.turnedUp ? grey200 : 'rgb(182,48,43)'} style={{height: '50px'}}/>
                </IconButton>
                <IconButton
                  onTouchTap={this.handleTickClick}
                  iconStyle={styles.tickMed}
                  style={styles.medium}>
                  <Tick color={this.state.turnedUp === false ? grey200 : 'rgb(59,158,116)'} style={{height: '50px'}}/>
                </IconButton>
              </div>

              {this.state.turnedUp ?
                <div>
                  <h2 style={{marginBottom: 36}}>
                    How did they do?
                  </h2>

                  <div style={{color: grey500, fontSize: '16px', marginLeft: 20, marginBottom: 10, marginTop: 15}}>
                    Rubbish
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      marginLeft: 20, marginRight: 20}}>
                    <span onTouchTap={() => this.handleRating(1)}
                        style={this.state.rating > 3 ? styles.goodRating : this.state.rating === 3 ? styles.middleRating : this.state.rating < 3 ? styles.badRating :  styles.circle}>
                      1
                    </span>
                    <span onTouchTap={() => this.handleRating(2)}
                        style={this.state.rating > 3 ? styles.goodRating : this.state.rating === 3 ? styles.middleRating : this.state.rating === 2 ? styles.badRating :  styles.circle}>
                      2
                    </span>
                    <span onTouchTap={() => this.handleRating(3)}
                        style={this.state.rating > 3 ? styles.goodRating : this.state.rating === 3 ? styles.middleRating : styles.circle}>
                      3
                    </span>
                    <span onTouchTap={() => this.handleRating(4)}
                        style={this.state.rating > 3 ? styles.goodRating : styles.circle}>
                      4
                    </span>
                    <span onTouchTap={() => this.handleRating(5)}
                      style={this.state.rating === 5 ? styles.goodRating : styles.circle}>
                      5
                    </span>
                  </div>
                  <div style={{color: grey500, fontSize: '16px', textAlign: 'right', marginRight: 20, marginTop: 10}}>
                    Amazing
                  </div>
              </div>
              : null}
              <div ref={el => { this.el = el; }} >
              {this.state.rating || this.state.turnedUp === false ?
              <RaisedButton
                onTouchTap={this.handleMoveToNextStage}
                style={{marginTop: 36}}
                 primary={true} fullWidth={true}
                  labelStyle={{letterSpacing: '0.6px', fontWeight: 'bold', fontFamily: 'Permanent Marker', fontSize: '18px'}}
                 label="Save"  />
               : <div style={{height: 36}}/>}
               </div>
             </div>
               :

               <div>
                 <h2 style={{marginTop: 36, marginBottom: 6}}>
                   Anything more to add?
                 </h2>
                 <div style={{color: grey500}}>

                 </div>
                 <div style={{width: '100%', paddingTop: 15, paddingBottom: 30}}>
                   <TextField
                     inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                       paddingLeft: '12px',  boxSizing: 'border-box'}}
                     underlineShow={false}
                     hintText={`This will be shared publicly on ${this.state.engagement['Name'] ? this.state.engagement['Name'].replace(/ .*/,'') : "this person"}'s profile.`}
                     multiLine={true}
                     fullWidth={true}
                     value={this.state.additional}
                     onChange={this.handleSetAdditional}
                     rows={5}
                     hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                     />
                 </div>
                 <RaisedButton
                   onTouchTap={this.handleSaveReview}
                   style={{marginTop: 36}}
                    primary={true} fullWidth={true}
                     labelStyle={{letterSpacing: '0.6px', fontWeight: 'bold', fontFamily: 'Permanent Marker', fontSize: '18px'}}
                    label="Finish"  />
               </div>
             }
          </div>}


      </div>
    )
  }
}
