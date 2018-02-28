import React from 'react';
import Dialog from 'material-ui/Dialog';
import {
  Step,
  Stepper,
  StepButton,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import Loadable from 'react-loadable';
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField'

const Loading = () => (
  <div>
    Hi
  </div>
)

const LoadableComponent = Loadable({
  loader: () => import('./texteditor.jsx'),
  loading: Loading
});

class ProgressBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <section style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <section style={{display: 'flex', justifyContent: 'center', alignItems: 'center', maxWidth:'300px', width:'100%'}}>
            <div style={{flex: '0 0 auto'}}>
              <svg style={{height: '10px', width: '10px', fill: '#FF9800' }}>
                <circle style={{cx: '5px', cy: '5px', r:'5px'}}/>
              </svg>
            </div>
            <div style={{flex: '1 1 auto'}}>
              <span style={{display: 'block', borderColor: this.props.index > 0 ? '#FF9800' : 'rgb(189, 189, 189)',
                  borderTopStyle: 'solid', borderTopWidth: '2px'}}/>
            </div>

            <div style={{flex: '0 0 auto'}}>
              <svg style={{height: '10px', width: '10px', fill: this.props.index > 0 ? '#FF9800' : 'rgb(158, 158, 158)'}}>
                <circle style={{cx: '5px', cy: '5px', r:'5px'}}/>
              </svg>
            </div>
            <div style={{flex: '1 1 auto'}}>
              <span style={{display: 'block', borderColor: this.props.index > 1 ? '#FF9800' : 'rgb(189, 189, 189)',
                  borderTopStyle: 'solid', borderTopWidth: '2px'}}/>
            </div>

            <div style={{flex: '0 0 auto'}}>
              <svg style={{height: '10px', width: '10px', fill: this.props.index > 1 ? '#FF9800' : 'rgb(158, 158, 158)'}}>
                <circle style={{cx: '5px', cy: '5px', r:'5px'}}/>
              </svg>
            </div>

          </section>
        </section>
    )
  }
}

export default class CreateProject extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      stepIndex: 0,
      project: {}
    }
  }

  handleNext = () => {
    const stepIndex = this.state.stepIndex;
    if (stepIndex < 2) {
      this.setState({stepIndex: stepIndex + 1});
    }
  };

  handlePrev = () => {
    const stepIndex = this.state.stepIndex;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1});
    }
  };

  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return(
        <div style={{height: '80%'}} className='front'>
            Select campaign settings...
            <div style={{backgroundColor: 'black', height: '80%'}}/>
        </div>
      )
      case 1:
          return(
          <div style={{height: '80%'}} className='front'>
              'Select campaign settings...'

          </div>
        )
      case 2:
          return(
          <div style={{height: '80%'}} className='front'>
              'The last step in the process'
              <div style={{backgroundColor: 'black', height: '80%'}}/>
          </div>
        )
      default:
          return(
          <div className='front'>
              'Select campaign settings...'
          </div>
        )
    }
  }


  render () {
    const stepIndex = this.state.stepIndex
    return (
      <div>
        <Dialog
           modal={false}
           contentStyle={{height: '80vh'}}
           paperClassName='paper'
           open={true}
           bodyStyle={{height: '100%'}}
           bodyClassName='isthistheone'
          >
          <div className='container'>
            <div   id='card' className={this.state.stepIndex === 1 ? 'flipped' : 'notflipped'}>

                <span className='front'>
                    {this.getStepContent(this.state.stepIndex)}
                    <ProgressBar  index={this.state.stepIndex}/>
                </span>
                <span className='back'>
                    <div style={{height: '80%'}}>

                      <Subheader>
                        What is the title of your project?
                      </Subheader>
                      <TextField name='summary'
                        fullWidth={true}
                        multiLine={true}
                        hintText='An overall summary'
                        defaultValue={this.state.summary ? this.state.summary: this.state.project.summary }
                        onChange={this.handleSummary}/>

                      <Subheader>
                        What are you doing? And why are you doing it?
                      </Subheader>
                      <LoadableComponent styles={{fontFamily: 'Open Sans', padding: '10px', marginTop: '10px'}}
                        returnableValue={this.state.project.returnableValue}
                        description={this.state.project.description}
                        onChange={this.handleOnChange}/>
                      <div style={{backgroundColor: 'black', height: '80%'}}/>
                    </div>

                    <ProgressBar index={this.state.stepIndex}/>
                </span>


            </div>
            <div style={{width: '100%', height: '36px', position: 'absolute', bottom: '0px'}}>
              <RaisedButton style={{float: 'left'}} label='Back' onTouchTap={this.handlePrev}/>
              <RaisedButton primary={true} style={{float: 'right'}} label='Next' onTouchTap={this.handleNext}/>

            </div>

            </div>
          </Dialog>
      </div>
    )
  }
}
