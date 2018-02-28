import React from 'react';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import MediaQuery from 'react-responsive';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {  browserHistory } from 'react-router';

const styles = {
  textfield: {
    height: '40px',
    fontsize: '20px'
  },
  header : {
    margin: '0px',
    padding: '6px',
    fontWeight: 500
  }
}



function disableDates(date) {
  var basics = JSON.parse(localStorage.getItem('basics'))
  var deadline = basics ? parseISOString(basics.deadline): null
  return  date < deadline;
}


class Form extends React.Component {
  constructor(props) {
    super(props);
    var times = JSON.parse(localStorage.getItem('times'))
    this.state = {
      startDate: times? parseISOString(times['Start Time']): null,
      endDate: times? parseISOString(times['End Time']): null,
      startTime: times? parseISOString(times['Start Time']): null,
      endTime: times? parseISOString(times['End Time']): null
    }
  }


  handleNext = (e) => {
    e.preventDefault()
    var startTime = this.state.startTime
    var startHours = startTime.getHours()
    var startMinutes = startTime.getMinutes()
    var startDate = this.state.startDate
    startDate.setHours(startHours)
    startDate.setMinutes(startMinutes)

    var endTime = this.state.endTime
    var endHours = endTime.getHours()
    var endMinutes = endTime.getMinutes()
    var endDate = this.state.endDate
    endDate.setHours(endHours)
    endDate.setMinutes(endMinutes)

    var times =
      {'Start Time': startDate,
        'End Time': endDate}
    var timeString = JSON.stringify(times)
    localStorage.setItem('times', timeString)
    browserHistory.push('/create-project/3')
  }

  handleSetStartDate = (e, date) => {
    this.setState({startDate: date, endDate: date})

  }

  handleSetEndDate = (e, date) => {
    this.setState({endDate: date})
  }


    handlePrevious = (e) => {
      e.preventDefault()
      browserHistory.push('/create-project/1')
    }

  handleSetStartTime = (e, date) => {
    console.log(date)
    var today = new Date(date)
    var newDate = new Date(today.setHours(today.getHours() + 2));
    this.setState({startTime: date, endTime: newDate})
  }

  handleSetEndTime = (e, date) => {
    this.setState({endTime: date})
  }


  render() {
    console.log(this.state)

    return (
      <div className='form' style={{textAlign: 'left', width: '100%'}}>
        <p style={{marginTop: '0px',fontFamily: 'Permanent Marker', fontSize: '32px', textAlign: 'left'}}>
          So when is this going to happen?</p>
        <div style={{width: '100%', paddingBottom: '16px', boxSizing: 'border-box'}}>
          <div style={{width: '100%',  paddingBottom: '32px',
             boxSizing: 'border-box'}}>
             <div style={{width: '70%', display: 'inline-block'}}>
            <p style={styles.header}>
              When does your project start?
            </p>

            <DatePicker
               style={{borderRadius: '6px', border: '1px solid #858987',paddingLeft: '12px',
                   boxSizing: 'border-box'}}
                 underlineShow={false}
                 value={this.state.startDate}
                 onChange={this.handleSetStartDate}
                 hintStyle={{  bottom: '8px'}}
                 shouldDisableDate={disableDates}
                 hintText="Date" textFieldStyle={styles.textfield}/>
            </div>


              <div style={{width: '25%', display: 'inline-block', marginLeft: '5%'}}>
                <p style={styles.header}>
                  Start time?
                </p>

               <TimePicker
                style={{borderRadius: '6px', border: '1px solid #858987',paddingLeft: '12px',
                    boxSizing: 'border-box'}}
                  underlineShow={false}
                  value={this.state.startTime}
                  minutesStep={5}

                  onChange={this.handleSetStartTime}
                  hintStyle={{  bottom: '8px'}}
                  hintText="Time" textFieldStyle={styles.textfield}/>
              </div>
          </div>

          <div style={{width: '100%',  paddingBottom: '32px',
             boxSizing: 'border-box'}}>
             <div style={{width: '70%', display: 'inline-block'}}>
            <p style={styles.header}>
              When does your project finish?
            </p>

            <DatePicker
               style={{borderRadius: '6px', border: '1px solid #858987',paddingLeft: '12px',
                   boxSizing: 'border-box'}}
                 underlineShow={false}
                 shouldDisableDate={disableDates}
                 value={this.state.endDate}
                 onChange={this.handleSetEndDate}
                 hintStyle={{  bottom: '8px'}}
                 hintText="Date" textFieldStyle={styles.textfield}/>
            </div>


              <div style={{width: '25%', display: 'inline-block', marginLeft: '5%'}}>
                <p style={styles.header}>
                  End time?
                </p>

               <TimePicker
                style={{borderRadius: '6px', border: '1px solid #858987',paddingLeft: '12px',
                    boxSizing: 'border-box'}}
                  underlineShow={false}
                  minutesStep={5}
                  value={this.state.endTime}

                  onChange={this.handleSetEndTime}
                  hintStyle={{  bottom: '8px'}}
                  hintText="Time" textFieldStyle={styles.textfield}/>
              </div>
          </div>



        </div>
        <RaisedButton label='NEXT' backgroundColor='#E55749'
          onClick={this.handleNext}
          style={{marginRight: 16}}
          disabled={!this.state.startDate || !this.state.startTime || !this.state.endDate || !this.state.endTime}
          labelStyle={{ color: 'white', fontFamily: 'Permanent Marker', fontSize: '18px', letterSpacing: '1px'}}/>
        <RaisedButton label='Previous' backgroundColor='#C5C8C7'
            onTouchTap={this.handlePrevious}
            labelStyle={{ color: 'white', fontFamily: 'Permanent Marker', fontSize: '18px', letterSpacing: '1px'}}/>
      </div>
    )
  }
}

function parseISOString(s) {
  var b = s.split(/\D+/);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}

export default class DateAndTime extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <MediaQuery minDeviceWidth={700}>
          <div style={{display: 'flex', paddingLeft: '100px', paddingTop: '50px', paddingRight: '100px'}}>
            <div style={{maxWidth: '500px', display: 'flex'
              , justifyContent: 'center'}} className='basics-container'>
              <div style={{paddingRight: '50px'}}>
                <Form />
              </div>
            </div>

              <div style={{flex: 1, paddingLeft: '50px', boxSizing: 'border-box'}} className='basics-image'>
                <img src='http://dru-cdn.zipcar.com/sites/default/files/6__milwaukeefarm_4.jpg'
                  style={{width: '100%', height: '70vh', objectFit: 'cover', borderRadius: '10px'}}/>
              </div>

          </div>
        </MediaQuery>
        <MediaQuery maxDeviceWidth={700}>
          <div style={{padding: '16px'}}>
            <Form />
          </div>
        </MediaQuery>
      </div>
    )
  }
}
