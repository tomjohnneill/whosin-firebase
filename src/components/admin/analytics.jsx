import React from 'react';
import fire from '../../fire';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import {dateDiffInDays} from '../desktopproject.jsx';

let db = fire.firestore()

Date.prototype.getWeek = function() {
  var date = new Date(this.getTime());
   date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                        - 3 + (week1.getDay() + 6) % 7) / 7);
}

export default class Analytics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount(props) {
    db.collection("Engagement").get
  }

  handleFindData = () => {
    db.collection("Engagement").get().then((querySnapshot) => {
      var rawData = {}
      querySnapshot.forEach((doc) => {
        var engagement = doc.data()
        var today = new Date()
        if (engagement.created) {
          var createdDate = new Date(engagement['created'])
          var weekNo = Math.floor(dateDiffInDays(createdDate, today)/7)
          rawData[weekNo] = rawData[weekNo] ? rawData[weekNo] + 1 : 1
        }

      })
      var data = []
      Object.keys(rawData).forEach((key) => {
        data.push({name: key, value: rawData[key]})
      })
      data.sort(function(a,b) {return (Number(a.name) > Number(b.name)) ? 1 : ((Number(b.name) > Number(a.name)) ? -1 : 0);} );
      this.setState({data: data})
      console.log(data)
    })
  }

  render() {
    return (
      <div>

            <RaisedButton label='Find Data'
              onClick={this.handleFindData}/>

              {this.state.data ?
                <div>
                  Engagements each week
                  {this.state.data.map((week) => (
                    <p>
                      <b>{week.name}: </b>{week.value}
                    </p>
                  ))}
                </div>
                :
                null
              }

      </div>
    )
  }
}
