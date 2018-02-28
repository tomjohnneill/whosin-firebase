import React , {PropTypes} from 'react';
import Subheader from 'material-ui/Subheader';
import {GridList, GridTile} from 'material-ui/GridList';

import {Link, browserHistory} from 'react-router';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: '100%',
    height: 'auto'
  },
};

export default class CharitiesList extends React.Component{
  constructor(props) {
    super(props);
    this.state = {loading: true}
  }

  componentDidMount(props) {
    fetch('https://api.worktools.io/api/Charity/?api_token=05a797cd-8b31-4abe-b63b-adbf0952e2c7')
      .then(response => response.json())
      .then(data => this.setState({loading: false, charities: data}))

  }

  goToCharity (charity, e) {
    e.preventDefault()
    browserHistory.push('/charity/' + charity.id)
  }

  render() {
    console.log(this.state)
    return (
      <div id='block' style={{paddingTop: '18px',paddingBottom: '64px'}}>

        {this.state.loading ?
            <div>
              Loading...
            </div>
          :
          <ul id="hexGrid">
            {this.state.charities.map((charity) => (
              <li className="hex">
                <div className="hexIn">
                  <a className="hexLink" href="#">
                    <img src={charity['Featured Image'] ? charity['Featured Image'] : "https://farm9.staticflickr.com/8461/8048823381_0fbc2d8efb.jpg"} alt="" />
                    <h1 onClick={this.goToCharity.bind(this, charity)}>{charity.Name ? charity.Name : 'Charity Name'}</h1>
                    <p onClick={this.goToCharity.bind(this, charity)}>{charity.Summary}</p>
                  </a>
                </div>
              </li>
            ))}

          </ul>
        }
      </div>
    )
  }
}
