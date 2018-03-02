import React , {PropTypes} from 'react';
import Dropzone from 'react-dropzone';
import Place from 'material-ui/svg-icons/maps/place';
import {grey200, grey500, grey100, amber500, grey300, lightBlue50, grey700} from 'material-ui/styles/colors'
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import {Tabs, Tab} from 'material-ui/Tabs';
import FlatButton from 'material-ui/FlatButton';
import {Spiral} from './icons.jsx';
import SwipeableViews from 'react-swipeable-views';
import {Link, browserHistory} from 'react-router';
import CharityProjectList from './charityprojectlist.jsx';
import fire from '../fire';

let db = fire.firestore()

const styles = {
  selectedTab: {
    height: '60px',
    backgroundColor: 'white',
    color: '#FF9800',
    textTransform: 'none',
    fontSize: '16px',
    letterSpacing: '0.4px',
    lineHeight: '16px',
    paddingLeft: '20px',
    paddingRight: '20px',
    fontWeight: 600
  },
  tab: {
    height: '60px',
    fontFamily: 'Open Sans',
    backgroundColor: 'white',
    color: '#484848',
    textTransform: 'none',

    fontSize: '16px',
    letterSpacing: '0.4px',
    lineHeight: '16px',
    paddingLeft: '20px',
    paddingRight: '20px',

  }
}

export function changeImageAddress(file, size) {
  var str = file, replacement = '/' + size + '/';
  str = str.replace(/\/([^\/]*)$/,replacement+'$1');
  return(str + '?pass=this')
}

export default class CharityProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {user: {}, loading: true, slideIndex: 0, left: '10%', selected: 'projects'}
  }

  handleClick(index, e) {
    e.preventDefault()
    this.setState({slideIndex: index})
  }

  componentDidMount(props) {
    db.collection("Charity").doc(this.props.params.charityId).get().then((doc) => {
      var charity = doc.data()
      charity['_id'] = doc.id
      this.setState({charity: charity, loading: false})
    })


  }

  handleChange = (value) => {
    this.setState({
      slideIndex: value,
    });
  };

  handleListClick(engagement, e) {
    browserHistory.push('/pages/projects/' + 'eng' + '/' + engagement.Project)
  }

  handleTwoTabClick = (value) => {
    var lookup = ['projects','supporters']
    this.setState({
      value: value,
      slideIndex: lookup.indexOf(value),
      left: lookup.indexOf(value) * 50 + 10 + '%'
    });
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
            }
        }

        xhr.open('PUT', data , true);
        xhr.setRequestHeader('Content-Type', file[0].type);
        xhr.send(file[0]);
      }.bind(this))

      .catch(error => this.setState({ error }));

  }

  changeAnchorEl = (e) => {
    console.log('handleMultipleChoiceClick')
    e.preventDefault()
    console.log(e)
    var rect = e.target.getBoundingClientRect()
    console.log(rect)
    this.setState({inkBarLeft: (rect.width-100)/2  + rect.x - (window.document.body.clientWidth - 1000) /2,
    })
  }

  handleTwoTabClick = (value) => {
    this.setState({selected: value})
  }

  render() {
    console.log(this.state)
    return (
      <div >
        {this.state.loading ?
          <div>
            Loading ...
          </div>
          :
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 30}}>
            <div style={{width: '100%', maxWidth: '1000px',
              backgroundColor: 'white'}}>
              <div style={{width: '250px', marginBottom: 30, textAlign: 'left'}}>
                <Spiral fill='#FF9800' style={{height: '100px', width: '100px'}}/>
                <b style={{display: 'inline-block'}}>{this.state.charity.Name}</b>

              </div>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div>

                </div>
                <div>

                </div>
              </div>
              <Tabs
                  tabItemContainerStyle={{height: '60px', backgroundColor: 'white', borderBottom: '1px solid #DDDDDD'}}
                  value={this.props.params.tab}
                  onChange={this.handleTwoTabClick}
                  inkBarStyle={{zIndex: 2, backgroundColor: '#FF9800',
                  left:this.state.inkBarLeft, width: '100px'}}
                >
                  <Tab label="Projects"
                    style={{width: 'auto', fontSize: '16px'}}
                      onTouchTap={this.changeAnchorEl}
                        buttonStyle={this.state.selected === 'projects' ? styles.selectedTab : styles.tab}
                     value="projects">
                    <CharityProjectList charityId={this.props.params.charityId}/>
                  </Tab>
                  <Tab
                    style={{width: 'auto', fontSize: '16px'}}
                    onTouchTap={this.changeAnchorEl}
                    buttonStyle={this.state.selected === 'about' ? styles.selectedTab : styles.tab}
                     label="About"  value="about">
                    <div/>
                  </Tab>
                  <Tab
                    style={{width: 'auto', fontSize: '16px'}}
                    onTouchTap={this.changeAnchorEl}
                    buttonStyle={this.state.selected === 'supporters' ? styles.selectedTab : styles.tab}
                     label="Supporters"  value="supporters">
                    <div/>
                  </Tab>
                  <Tab
                    style={{width: 'auto', fontSize: '16px'}}
                    onTouchTap={this.changeAnchorEl}
                    buttonStyle={this.state.selected === 'reviews' ? styles.selectedTab : styles.tab}
                     label="Reviews"  value="reviews">
                    <div/>
                  </Tab>
                </Tabs>

            </div>





          </div>

            }
        </div>

    )
  }
}
