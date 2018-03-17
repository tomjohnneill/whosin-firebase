import React from 'react';
import Home from './components/home.jsx';
import Navigation from './components/navigation.jsx';
import Footer from './components/footer.jsx';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';


var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#E55749',
    primary2Color:  '#FF9800',
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
