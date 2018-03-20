import React from 'react';
import MediaQuery from 'react-responsive';
import {World, AvatarIcon} from '../icons.jsx';
import {browserHistory} from 'react-router'

export default class OrganisationType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  handleAreaEnter = (side) => {
    this.setState({[side]: true})
  }

  handleAreaLeave = (side) => {
    this.setState({[side]: false})
  }

  render() {

    const styles = {
      leftIconBox: {
        margin: 35,
        height: 300,
        width: 300,
        backgroundColor: this.state.left ? 'rgba(101, 161, 231, 0.2)' : 'rgba(216,216,216,0.2)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        flexDirection: 'column',
        border: '3px solid #65A1e7',
        boxSizing: 'border-box',
        cursor: 'pointer',
        position: 'relative',
        boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px'
      },
      rightIconBox: {
        margin: 35,
        height: 300,
        width: 300,
        backgroundColor: this.state.right ? 'rgba(229, 87, 73, 0.2)' : 'rgba(216,216,216,0.2)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        borderRadius: 6,
        border: '3px solid #E55749',
        position: 'relative',
        boxSizing: 'border-box',
        cursor: 'pointer',
        boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px'
      },
      icon : {
        height: 150,
        paddingBottom: 20
      },
      choiceText: {
        position: 'absolute',
        bottom: 25,
        fontSize: '24px',
        fontWeight: 700
      }
    }

    return (
      <div>
        <MediaQuery minDeviceWidth={700}>
          <div style={{paddingLeft: 100, paddingTop: 36}}>
            <div className='desktop-header'>
              Who you are creating this project for?
            </div>
            <div style={{display: 'flex'}} className='choose-container'>
              <div className='choices' style={{display: 'flex'}}>
                <div className='icon-box'
                  onClick={() => browserHistory.push('/create-project/organisation')}
                  onMouseEnter={() => this.handleAreaEnter('left')}
                  onMouseLeave={() => this.handleAreaLeave('left')}
                  style={styles.leftIconBox}>
                  <World color={'#484848'} style={{height: 80, paddingBottom: 20}}/>
                  <div style={styles.choiceText}>
                    A Charity/Organisation
                  </div>
                </div>
                <div className='icon-box'
                  onClick={() => browserHistory.push('/create-project/1')}
                  onMouseEnter={() => this.handleAreaEnter('right')}
                  onMouseLeave={() => this.handleAreaLeave('right')}
                  style={styles.rightIconBox}>
                  <AvatarIcon color={'#484848'} style={styles.icon}/>
                  <div style={styles.choiceText}>
                    Myself
                  </div>
                </div>
              </div>
              <div className='illustrative-image'>
                <img src='' />
              </div>
            </div>
          </div>
        </MediaQuery>
      </div>
    )
  }
}
