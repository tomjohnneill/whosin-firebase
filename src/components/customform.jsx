import React from 'react';
import {browserHistory} from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Checkbox from 'material-ui/Checkbox';
import {Tree1,Tree2, Tree3, Tree4, Embryo1, Embryo2, Embryo3, Embryo4} from './icons.jsx';


import Dropzone from 'react-dropzone';
import {grey500} from 'material-ui/styles/colors';


const styles = {
  question : {
    fontSize: '14pt',
    fontWeight: 'bold'
  },
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

export default class CustomForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {loading: true, stepIndex: 0, response: {}, details: [], index: 0}
  }

  fetchOption = (id, index) => {
    fetch('https://api.worktools.io/api/Option/?api_token=05a797cd-8b31-4abe-b63b-adbf0952e2c7&Question=' + id)
    .then(response => response.json())
    .then(newData => {console.log(newData);
      const details = this.state.details
      details[index].options = newData
      this.setState({details: details})})
  }

  componentDidMount(props) {
    fetch('https://api.worktools.io/api/Question/?api_token=05a797cd-8b31-4abe-b63b-adbf0952e2c7&Project=' + this.props.params._id)
    .then(response => response.json())
    .then(data => {this.setState({details: data});
      for (var i = 0; i < data.length; i++) {
        if (data[i].Type === 'multipleChoice' || data[i].Type === 'checkbox') {
          var questions = data
          console.log(i)
          var number = i
          this.fetchOption(data[i].id, i)
        }
      }
    }

    )
    .then(this.setState({loading: false}))

  }

  upload = (acceptedFiles, rejectedFiles) => {


  }

  handleNext = () => {
    const stepIndex = this.state.stepIndex;
    this.setState({
      stepIndex: stepIndex + 2,
      finished: stepIndex >= 2,
    });


    var body = {
      'Question': this.state.response.id,
      'Answer': this.state.response.value,
      'Project': '7p4Q7ODB5vo7w',
      'User': 'DWERM1MqeKpM8'
    }
    if (this.state.response.id && localStorage.getItem(this.state.response.id)) {
      fetch(`https://api.worktools.io/api/Response/?api_token=9915e23e-d908-4d29-badf-d51d76cfb9bb&Question=${this.state.response.id}&User=${'DWERM1MqeKpM8'}`)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        console.log(this.state.response.id)
        fetch(`https://api.worktools.io/api/Response/${data[0].id}/?api_token=9915e23e-d908-4d29-badf-d51d76cfb9bb`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: 'PATCH',
          body: JSON.stringify(body)
        })
        .catch(error => this.setState({error: error}))
      })
    } else if (this.state.response.id) {
      fetch('https://api.worktools.io/api/Response/?api_token=9915e23e-d908-4d29-badf-d51d76cfb9bb', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(body)
      })
      .catch(error => this.setState({error: error}))
    }
    localStorage.setItem(this.state.response.id, this.state.response.value)
    if (this.state.stepIndex > this.state.details.length - 3) {
      browserHistory.push(window.location.href.replace('/questions','') + '/joined')
    }
  };

  handlePrev = () => {
    const stepIndex = this.state.stepIndex;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 2});
    }
  };

  renderStepActions(step) {
    const stepIndex = this.state.stepIndex;

    return (
      <div style={{margin: '12px 0'}}>
        <RaisedButton
          labelStyle={{ color: 'white', fontFamily: 'Permanent Marker', fontSize: '18px', letterSpacing: '1px'}}
          label={stepIndex > this.state.details.length - 3 ? 'Finish' : 'Next'}
          disableTouchRipple={true}
          disableFocusRipple={true}
          primary={true}
          onTouchTap={this.handleNext}
          style={{marginRight: 12}}
        />
        {step > 0 && (
          <FlatButton
            label="Back"
            disabled={stepIndex === 0}
            disableTouchRipple={true}
            disableFocusRipple={true}
            onTouchTap={this.handlePrev}
          />
        )}
      </div>
    );
  }

  handleTextChange (id, e, newValue) {
    this.setState({response: {id: id, value: newValue}})

  }

  getCoords(id, lat, lng, desc){
    console.log(lat, lng);
    console.log(desc)
    this.setState({response: {id: id, value:{place: desc, location: {type: "Point", coordinates : [lng, lat]}}}})
  }

  handleCheckChange (id, option, e, checked) {
    var options = this.state.response.value ? this.state.response.value : []

    if (checked) {
      options.push(option)
    } else {
      options.splice(options.indexOf(option), 1)
    }
    console.log(options)
    this.setState({response: {id: id, value: options}})
  }

  renderStep = (item, step) => {
    var allResponses, userResponse
    if (localStorage.getItem(item.id)) {
      userResponse = localStorage.getItem(item.id)
    } else {
      userResponse = {}
    }


    if (item.Type === 'text') {

      return (
        <div>
          <p style={styles.question}>{item.Question}</p>
          <span>
            <TextField onChange={this.handleTextChange.bind(this, item._id)}
              inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                paddingLeft: '12px',  boxSizing: 'border-box'}}
              style={styles.textfield}
              underlineShow={false}
              hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
              hintText={item.Question}/>

          </span>
        </div>

      )
    } else if (item.Type === 'checkbox') {
      var checkedOption = userResponse ? userResponse : null
      return (
        <div>
          <p style={styles.question}>{item.Question}</p>
          <span>
            {item.options ? item.options.map((option) => (
              <Checkbox onCheck={this.handleCheckChange.bind(this, item._id, option)}
                  label={option.Text}
                  defaultChecked={checkedOption ? checkedOption.includes(option) : false}/>
              )) : null}

          </span>
        </div>
      )
    } else if (item.Type === 'multipleChoice') {
      var chosenOption = userResponse ? userResponse : null
      return (
        <div>
          <p style={styles.question}>{item.Question}</p>
          <span>
            <RadioButtonGroup
              defaultSelected={chosenOption}
              onChange={this.handleTextChange.bind(this, item._id)}
              name={item.question}>
            {item.options ? item.options.map((option) => (
              <RadioButton label={option.Text} value={option.Text}/>
            )) :null}
            </RadioButtonGroup>

          </span>
        </div>
      )
    } else if (item.Type === 'location') {
      if (userResponse && userResponse.response && userResponse.response.place) {
        return (
          <div>
            <p style={styles.question}>{item.Question}</p>
            <span>
              Put stuff in here

            </span>
          </div>
        )
      } else {
        return (
          <div>
            <p style={styles.question}>{item.Question}</p>
            <span>
              Put things in here

            </span>
          </div>
        )
      }
    } else if (item.Type === 'image') {
      return (
        <div>
          <p style={styles.question}>{item.Question}</p>
          <span>
            <Dropzone key={'photos'} onDrop={this.upload}  style={{}}>
                  {({ isDragActive, isDragReject }) => {
                    let styles = {
                      width: 'auto',
                      height: 100,
                      textAlign: 'center',
                      justifyContent: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      borderWidth: 1.5,
                      borderColor: grey500,
                      borderStyle: 'dashed',
                      borderRadius: 5,
                      color: grey500,

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

          </span>
        </div>
      )
    }
  }

  renderIcon = (id) => {
    console.log(this.state.stepIndex/this.state.details.length*3.49)
    var stage = Math.round(this.state.stepIndex/this.state.details.length*3.49)
    console.log(stage)
    switch(stage) {
      case 0:
      console.log('whaaaaaaaaaat')
        return


            <Embryo1 style={{height: '50px'}}/>

          break;
      case 1:
        return
          <Embryo2 style={{height: '100px'}}/>
        break;
      case 2:
        return
          <Embryo3 style={{height: '150px'}}/>
        break;
      case 3:
        return
          <Embryo4 style={{height: '200px'}}/>
        break;
      default:
      return <p></p>
    }
  }

  render() {
    console.log('Form details:')
    console.log(this.state)
    return (
      <div>
      <h1 style={{fontFamily: 'Permanent Marker', textAlign: 'left', paddingLeft: '200px'}}>
        Just a couple of questions before you're done
      </h1>
      <p style={{textAlign: 'left', paddingLeft: '200px'}}>
        Our charities often need a little bit of extra information about you to make sure projects are great, and safe.
      </p>
      <div style={{display: 'flex', paddingLeft: '200px', paddingRight: '100px'}}>

          <div style={{minWidth: '400px', display: 'flex'}} className='basics-container'>
          {this.state.loading ?

            <div style={{position: 'relative'}}>

              <div style={{width: '100%', height: '400px', zIndex: 10, backgroundColor: 'rgba(238,238,238,0.4)'
                , position:'absolute', top: '0px', verticalAlign: 'bottom', textAlign: 'center',
              display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>


                <div style={{display: 'flex', justifyContent: 'center', backgroundColor: 'rgba(238,238,238,0.4)'}}>


                  <div style={{width: '60%'}}>
                    <p style={{marginBottom: '16px'}}>Once you've joined the pledge, we might need a bit more info </p>
                <RaisedButton

                   primary={true} fullWidth={true} label="Join Now"  />

                  </div>
                  </div>
                </div>
              </div>
                 :

            <div style={{textAlign: 'left'}}>


          <div style={{minHeight: '300px', marginTop: '60px'}}>
            <div>
              {this.state.details[this.state.stepIndex] ? this.renderStep(this.state.details[this.state.stepIndex]) : null}
            </div>
            <div>
              {this.state.details[this.state.stepIndex + 1] ? this.renderStep(this.state.details[this.state.stepIndex +1]) : null}
            </div>


          </div>
          <div style={{display: 'flex'}}>
            {this.renderStepActions(this.state.stepIndex)}


          </div>
          </div>

      }
        </div>

        <div style={{ flex: 1}}>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'flex-end',height: '400px', marginBottom: '16px'}}>
          {this.state.loading ?
          null : this.renderIcon(1)}
          {this.state.loading ? null :
          Math.round(this.state.stepIndex/this.state.details.length*3.49) === 0 ?
            <Tree1 style={{height: '100px'}}/>
            :
          Math.round(this.state.stepIndex/this.state.details.length*3.49) === 1 ?
            <Tree2 style={{height: '200px'}}/>
            :
            Math.round(this.state.stepIndex/this.state.details.length*3.49) === 2 ?
            <Tree3 style={{height: '300px'}}/>
            :
            <Tree4 style={{height: '400px'}}/>
          }
        </div>
        <b style={{marginTop: '24px'}}>Step {this.state.stepIndex/2 + 1} of {Math.round(this.state.details.length/2)}</b>
        </div>

    </div>
    </div>
  )
  }
}
