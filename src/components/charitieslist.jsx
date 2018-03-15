import React , {PropTypes} from 'react';
import Subheader from 'material-ui/Subheader';
import MediaQuery from 'react-responsive';
import TextField from 'material-ui/TextField';
import Search from 'material-ui/svg-icons/action/search';
import {GridList, GridTile} from 'material-ui/GridList';
import {World, Tick} from './icons.jsx';

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

  handleSearch = (e, input) => {
    const client = window.algoliasearch('52RYQZ0NQK', 'b10f7cdebfc189fc6f889dbd0d3ffec2');
    const index = client.initIndex('organisations');
    var query = e.target.value
    index
        .search({
            query
        })
        .then(responses => {
            // Response from Algolia:
            // https://www.algolia.com/doc/api-reference/api-methods/search/#response-format
            this.setState({charities: responses.hits});
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
                <div style={{width: '280px', height: '332px', margin: 20}}>
                  <span style={{fontWeight: 700, marginBottom: 6, display: 'inline-block', height: '45px', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden', textOverflow: 'ellipsis'}}>
                    {charity.Name}
                  </span>
                  {charity['Featured Image'] ?
                  <img src={charity['Featured Image']}
                    style={{width: '100%', height: '180px',objectFit: 'cover', borderRadius: '4px'}}/>
                  :
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: '100%', height: '180px', borderRadius: '4px', backgroundColor: 'rgb(247,247,247)'}}>
                    <World style={{height: '40px', width: '40px'}} fill={'#E55749'}/>
                  </div>
                }
                  <span style={{marginTop: 6, display: 'inline-block', height: '90px', overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 4, textOverflow: 'ellipsis'}}>
                    {charity.Summary}
                  </span>
                </div>
              </Link>



            ))}
          </div>


        }
        </MediaQuery>
        <MediaQuery maxDeviceWidth={700}>
              <h1 style={{fontFamily: 'Permanent Marker', textAlign: 'left', paddingLeft: '24px'}}>
                Organisations
              </h1>
              {this.state.loading ?
                <div>
                  Loading...
                </div>
                :

            <div style={{display: 'flex', flexWrap: 'wrap', paddingLeft: '8px', paddingRight: '8px',
            textAlign: 'left'}}>
              {this.state.charities.map((charity) => (
                <Link to={`/charity/${charity._id}`} style={{width: '40%', margin: 16}}>
                  <div style={{width: '100%', height: '240px'}}>
                    <span style={{fontWeight: 700, marginBottom: 6, display: 'inline-block', height: '45px',
                      display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden', textOverflow: 'ellipsis'}}>
                      {charity.Name}
                    </span>
                    {charity['Featured Image'] ?
                    <img src={charity['Featured Image']}
                      style={{width: '100%', height: '80px',objectFit: 'cover', borderRadius: '4px'}}/>
                    :
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: '100%', height: '80px', borderRadius: '4px', backgroundColor: 'rgb(247,247,247)'}}>
                      <World style={{height: '25px', width: '25px'}} fill={'#E55749'}/>
                    </div>
                  }
                    <span style={{marginTop: 6, display: 'inline-block', height: '90px', fontSize: '16px',
                       overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 4,
                       textOverflow: 'ellipsis'}}>
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
