import React , {PropTypes} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import AutoComplete from 'material-ui/AutoComplete';
import CircularProgress from 'material-ui/CircularProgress';

export default class CharityAutocomplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {searchText: '', charities: [], loading: false}
  }

  handleUpdateInput = (searchText) => {


    this.setState({
      searchText: searchText,
    });



  fetch('https://charitybase.uk/api/v0.2.0/charities?search=' + encodeURIComponent(this.state.searchText))
  .then(response => response.json())
  .then(function(data) {
    var charities = data.charities.map(a => a.name)
    this.setState({rawCharities: data.charities})
    this.setState({charities: []})
    this.setState({charities: charities})
  }.bind(this))


    };

  handleNewRequest = (string, v) => {
    console.log(string)
    console.log(this.state.rawCharities)
    var newArray = this.state.rawCharities.filter(function (el) {
      return el.name === string
      });
    console.log(newArray)
    this.setState({loading: true})
    fetch(`https://charitybase.uk/api/v0.2.0/charities?search=${string}&fields=beta.activities&limit=1`)
    .then(response => response.json())
    .then(data => this.setState({loading: false, details: data.charities ? data.charities[0] : {}}))
    };

  render() {
    console.log(this.state)
    return (
      <div>
        <AutoComplete
          hintText="Type your charity name or number"
          searchText={this.state.searchText}
          onUpdateInput={this.handleUpdateInput}
          onNewRequest={this.handleNewRequest}
          dataSource={this.state.charities}
          openOnFocus={true}
          filter={(searchText, key) => true}
        />

      {!this.state.loading ?
        <div>
        {this.state.details ?
        <div>
          {this.state.details.beta ? this.state.details.beta.activities: 'hi'}
        </div> :
        null}
        </div>
        :
        <div>
          <CircularProgress/>
        </div>
        }

      </div>
    )
  }

}
