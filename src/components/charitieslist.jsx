import React , {PropTypes} from 'react';
import Subheader from 'material-ui/Subheader';
import MediaQuery from 'react-responsive';
import TextField from 'material-ui/TextField';
import Search from 'material-ui/svg-icons/action/search';
import {GridList, GridTile} from 'material-ui/GridList';

import {Link, browserHistory} from 'react-router';
import fire from '../fire';

let db = fire.firestore()

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


    db.collection("Charity").get().then((querySnapshot) => {
      var data = []
      querySnapshot.forEach((doc) => {

        var elem = doc.data()
        elem['_id'] = doc.id
        data.push(elem)
      });
      this.setState({charities: data, loading: false})
    });


  }

  goToCharity (charity, e) {
    e.preventDefault()
    browserHistory.push('/charity/' + charity.id)
  }

  render() {
    console.log(this.state)
    return (
      <div id='block' style={{paddingBottom: '64px'}}>
        <MediaQuery minDeviceWidth={700}>
          <div style={{position: 'sticky', top: '0px', display: 'flex', alignItems: 'center', paddingLeft: 100, zIndex: 10, paddingRight: 100
            , background: 'linear-gradient(0deg, #ffffff, #f7f7f7)', paddingTop: 20, paddingBottom: 20, borderBottom: '1px solid #DDDDDD'}}>

            <Search style={{marginRight: 6}}/>
            <TextField hintText={'Search'} onChange={this.handleSearch}/>
          </div>

        </MediaQuery>
        <MediaQuery maxDeviceWidth={700}>
          <div style={{position: 'sticky', top: '0px', display: 'flex', alignItems: 'center', paddingLeft: 16, zIndex: 10, paddingRight: 10
            , background: 'linear-gradient(0deg, #ffffff, #f7f7f7)', paddingTop: 20, paddingBottom: 20, borderBottom: '1px solid #DDDDDD'}}>

            <Search style={{marginRight: 6}}/>
            <TextField hintText={'Search'} onChange={this.handleSearch}/>
          </div>
        </MediaQuery>
        <div>
          <MediaQuery minDeviceWidth={700}>
            <h1 style={{fontFamily: 'Permanent Marker', textAlign: 'left', paddingLeft: '100px'}}>
              Organisations</h1>
            {this.state.loading ?
              <div>
                Loading...
              </div>
              :

          <div style={{display: 'flex', flexWrap: 'wrap', paddingLeft: '80px', paddingRight: '80px',
          textAlign: 'left'}}>
            {this.state.charities.map((charity) => (
              <Link to={`/charity/${charity._id}`}>
                <div style={{width: '230px', height: '280px', margin: 20}}>
                  <span style={{fontWeight: 700, display: 'inline-block'}}>
                    {charity.Name}
                  </span>
                  <img src={charity['Featured Image'] ? charity['Featured Image'] : "https://farm9.staticflickr.com/8461/8048823381_0fbc2d8efb.jpg"}
                    style={{width: '100%', height: '180px',objectFit: 'cover', borderRadius: '4px'}}/>
                  <span style={{display: 'inline-block'}}>
                    {charity.Summary}
                  </span>
                </div>
              </Link>



            ))}
          </div>


        }
        </MediaQuery>
      </div>
      </div>
    )
  }
}
