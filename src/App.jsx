import React from 'react';
import Navigation from './components/navigation.jsx';
import Footer from './components/footer.jsx';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import ReactGA from 'react-ga';
import ReactPixel from 'react-facebook-pixel';


const advancedMatching = { em: 'some@email.com' }; // optional, more info: https://developers.facebook.com/docs/facebook-pixel/pixel-with-ads/conversion-tracking#advanced_match
const options = {
    autoConfig: true, 	// set pixel's autoConfig
    debug: false, 		// enable logs
};
ReactPixel.init('221921085240078', advancedMatching, options);

ReactPixel.pageView(); 	


var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

if (process.env.NODE_ENV === 'production') {
  ReactGA.initialize('UA-116158905-1');
  ReactGA.pageview(window.location.pathname + window.location.search);
}




const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#E55749',
    primary2Color:  '#E55749',
    accent1Color: '#65A1e7',
  },
  appBar: {
    height: 50,
  },
  datePicker: {
    headerColor: '#65A1e7',
  },
  timePicker: {
    headerColor: '#65A1e7',
  },
  fontFamily: 'Nunito'
});



const App = ( { children } ) => (

      <div style={{paddingTop: 50}} className="App">
        <MuiThemeProvider muiTheme={muiTheme}>
          <div>
            <Navigation />
            { children }
            <Footer />
          </div>
        </MuiThemeProvider>
      </div>


)

export default App
