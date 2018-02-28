import React , {PropTypes} from 'react';
import Dropzone from 'react-dropzone';
import Place from 'material-ui/svg-icons/maps/place';
import {grey200, grey500, grey100, amber500, grey300, lightBlue50, grey700} from 'material-ui/styles/colors'
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import {Tabs, Tab} from 'material-ui/Tabs';
import FlatButton from 'material-ui/FlatButton';
import SwipeableViews from 'react-swipeable-views';
import {Link, browserHistory} from 'react-router';
import CharityProjectList from './charityprojectlist.jsx';

const styles = {
  selectedTab: {
    height: '36px',
    display: 'flex',
    backgroundColor: 'white',
    color: '#0068B2',
    fontWeight: 700,
    fontSize: '12px',
    letterSpacing: '0.4px',
    lineHeight: '16px',
    fontFamily: 'Open Sans',
  },
  tab: {
    height: '36px',
    display: 'flex',
    fontFamily: 'Open Sans',
    backgroundColor: 'white',
    color: '#484848',
    fontWeight: 700,
    fontSize: '12px',
    letterSpacing: '0.4px',
    lineHeight: '16px',
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
    this.state = {user: {}, loading: true, slideIndex: 0, left: '10%'}
  }

  handleClick(index, e) {
    e.preventDefault()
    this.setState({slideIndex: index})
  }

  componentDidMount(props) {
    fetch('https://api.worktools.io/api/Charity/' + this.props.params.charityId + '/?api_token=05a797cd-8b31-4abe-b63b-adbf0952e2c7')
      .then(response => response.json())
      .then(data => this.setState({charity: data[0], loading: false}))
      .catch(error => this.setState({error, loading: false}))

    fetch('https://api.worktools.io/api/Review/?api_token=05a797cd-8b31-4abe-b63b-adbf0952e2c7&Charity=' +
                this.props.params.charityId)
      .then(response => response.json())
      .then(data => this.setState({reviews: data}))
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

  render() {
    console.log(this.state)
    return (
      <div>
        {this.state.loading ?
          <div>
            Loading ...
          </div>
          :
          <div>
            <div style={{width: '100%', height: '250px', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              backgroundColor: 'white'}}>
              <div style={{backgroundColor: 'white'}}>
                <img style={{height: 'auto', width: '100%', position: 'relative', top: '0px', left:'0px'}} src={this.state.user.Picture ? this.state.user.Picture : 'https://farm9.staticflickr.com/8461/8048823381_0fbc2d8efb.jpg'}/>
                <div style={{position: 'absolute', top: '24%', left: '20%', borderRadius: '6px'
                      , backgroundColor: 'rgba(255,255,255,0.95)', width: '60%', height: '100px',
                      display: 'flex', alignItems: 'center'}}>
                      <img style={{width: '80px', height: 'auto', paddingLeft: '12px', borderRadius: '6px'}}
                        src='https://d3kkowhate9mma.cloudfront.net/d1589100-7f08-4552-a2bc-31482174913a'/>
                      <div style={{paddingLeft: '12px', fontSize: 'large', fontFamily: 'Open Sans', fontWeight: 600}}>
                      {this.state.charity.Name}
                      </div>

                </div>

            </div>



            </div>

            <Tabs
              style={{borderBottom: '1px solid #e4e4e4', boxShadow: '0 1px 5px rgba(0, 0, 0, 0.1) '}}
              tabItemContainerStyle={{height: '36px', backgroundColor: 'white'}}
                value={this.props.params.tab}
                onChange={this.handleTwoTabClick}
                inkBarStyle={{zIndex: 2, backgroundColor: '#0068B2',
                left: this.state.left, width: '30%'}}
              >
                <Tab label="Projects"  buttonStyle={this.state.slideIndex === 0 ? styles.selectedTab : styles.tab}
                   value="projects">
                  <CharityProjectList charityId={this.props.params.charityId}/>
                </Tab>
                <Tab label="Supporters" buttonStyle={this.state.slideIndex === 1 ?
                  styles.selectedTab : styles.tab}  value="supporters">
                  <div/>
                </Tab>
              </Tabs>



          </div>

            }
        </div>

    )
  }
}
