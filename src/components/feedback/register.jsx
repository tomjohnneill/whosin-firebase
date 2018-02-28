import React from 'react';
import Swipeable from 'react-swipeable';
import {Card} from 'material-ui/Card';
import {Tick, Cross} from '../icons.jsx';
import IconButton from 'material-ui/IconButton';
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
    width: 120,
    height: 120,
    padding: 30,
  },
};

const worktoolsToken = localStorage.getItem('worktoolsToken') ? localStorage.getItem('worktoolsToken')
  : '05a797cd-8b31-4abe-b63b-adbf0952e2c7'

class AllDone extends React.Component {
  render() {
    return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center',
                  flexDirection: 'column', padding: '20px'}}>
        <h2>Thanks!</h2>

        This will be really helpful for other organisations to know how reliable each volunteer is.
      </div>
    )
  }
}

export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loading: true, counter:0, left: 0, top: 0, finished: false}
  }

  componentDidMount(props) {
    db.collection("Engagement").where("Project", "==", this.props.params._id).get().then((querySnapshot) => {
      var data = []
      querySnapshot.forEach((doc) => {
        console.log(doc.data())
        var elem = doc.data()
        elem['_id'] = doc.id
        data.push(elem)
      });
      this.setState({engagements: data, loading: false})
    })
  }

  handleSwipeLeft = (e) => {
    console.log('swiped left')
    var body = {
      Project: this.props.params._id,
      'Turned Up': false
    }
    // Post a review
    this.setState({finished: true})
    this.returnToStart()
  }

  returnToStart = () => {
    setTimeout(() => {
      this.setState({ left:0,top:0, turnedUp: null });
      this.setState({finished: false,counter: this.state.counter + 1, })
    }, 200);
  }

  handleSwipeRight =  (e, abs, engagement) => {
    console.log('swiped right')
    var body = {
      Project: this.props.params._id,
      'Turned Up': true
    }
    // Post a review
    this.setState({ finished: true })
    this.returnToStart()
  }

  handleSwiping = (e, deltaX, deltaY, absX, absY, velocity) => {
    this.setState({left: - deltaX, top: -deltaY})
  }

  handleSwipingRight = (e) => {
    this.setState({turnedUp: true})
  }

  handleSwipingLeft = (e) => {
    this.setState({turnedUp: false})
  }

  handleCrossClick = (e) => {
    e.preventDefault()
    this.setState({turnedUp: false})
    this.returnToStart()
  }


  handleTickClick = (e) => {
    e.preventDefault()
    this.setState({turnedUp: true})
    this.returnToStart()
  }

  render() {
    console.log(this.state)
    return (
      <div>
        <h2 style={{marginTop: 10, marginBottom: 10, fontSize: '20px'}}>Did this person turn up?</h2>
        {this.state.loading ?
          null :
          <div>
            <Swipeable
              onSwipedLeft={this.handleSwipeLeft}
              onSwipedRight={this.handleSwipeRight}
              onSwiping={this.handleSwiping}
              onSwipingLeft={this.handleSwipingLeft}
              onSwipingRight={this.handleSwipingRight}
              style={{position: 'relative'}}
              >
              <Card style={{display: this.state.finished ? 'none': 'flex', justifyContent: 'center', alignItems: 'center',
                flexDirection: 'column', margin: '10px', borderRadius: '4px',
                position: 'absolute', left: this.state.left, top: this.state.top}}>
                {this.state.counter === this.state.engagements.length ?
                  null :

                <span>
                  <img
                    alt={`${this.state.engagements[this.state.counter].Name}`}
                    src={this.state.engagements[this.state.counter]['Volunteer Picture']}
                    style={{height: '95vw', width: '95vw', objectFit: 'cover', position: 'relative'}}
                    />
                  {this.state.turnedUp === true ?

              <div style={{height: '95vw', width: '95vw', position: 'absolute'
                    , display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: 'rgba(59,158,116,0.5)'
                    , zIndex: 3, top: 0}}>
                    <Tick color={'rgb(59,158,116)'} style={{height: '50%', width: '50%'}}/>
                  </div>
                  :
                  this.state.turnedUp === false ?
                  <div style={{height: '95vw', width: '95vw', position: 'absolute'
                        , display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backgroundColor: 'rgba(182,48,43,0.5)'
                        , zIndex: 3, top: 0}}>
                        <Cross color={'rgb(182,48,43)'} style={{height: '50%', width: '50%'}}/>
                      </div>

                  :
                  null


                }

                <div style={{textAlign: 'left', padding: 16}}>
                  <b>{this.state.engagements[this.state.counter]['Volunteer Name']}</b>
                  <br/>
                  London, UK
                </div>

                </span>

              }

              </Card>

          </Swipeable>
          <Card style={{display: 'flex', justifyContent: 'center', alignItems: 'center',
            flexDirection: 'column', margin: '10px', borderRadius: '4px', zIndex: -1,
            position: 'absolute', left:0 , top: 98.2}}>
            {this.state.counter + 1 >= this.state.engagements.length ?
              <AllDone/> :
            <span>
              <img
                alt={`${this.state.engagements[this.state.counter +1].Name}`}
                src={this.state.engagements[this.state.counter + 1]['Volunteer Picture']}
                style={{height: '95vw', width: '95vw', objectFit: 'cover', position: 'relative'}}
                />
              <div style={{textAlign: 'left', padding: 16}}>
                  <b>{this.state.engagements[this.state.counter+ 1]['Volunteer Name']}</b>
                  <br/>
                  London, UK
                </div>
            </span>
            }
          </Card>
          <div style={{position: 'absolute', top: 'calc(100vw + 180px)', width: '100%'}}>
            {this.state.counter < this.state.engagements.length ?
              <div style={{display: 'flex',
                  alignItems: 'center', justifyContent: 'center'}}>
                <IconButton
                  onTouchTap={this.handleCrossClick}
                  iconStyle={styles.mediumIcon}
                  style={styles.medium}>
                  <Cross color={'rgb(182,48,43)'} style={{height: '50px'}}/>
                </IconButton>
                <IconButton
                  onTouchTap={this.handleTickClick}
                  iconStyle={styles.tickMed}
                  style={styles.medium}>
                  <Tick color={'rgb(59,158,116)'} style={{height: '50px'}}/>
                </IconButton>
              </div>
              :
              null
            }
          </div>
        </div>
      }



      </div>
    )
  }
}
