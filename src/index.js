import React from 'react';
import { hydrate, render } from 'react-dom';
import './index.css';
import App from './App.jsx';
import registerServiceWorker from './registerServiceWorker';
import Project from './components/project.jsx';
import Home from './components/home.jsx';
import Profile from './components/profile.jsx';
import CharityProfile from './components/charityprofile.jsx';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import UserTabs from './components/tabs.jsx'
import CharityAutocomplete from './components/charityautocomplete.jsx';
import CreateProject from './components/createproject.jsx';
import Basics from './components/create-project/basics.jsx';
import Story from './components/create-project/story.jsx';
import OrganisationLookup from './components/create-project/organisationlookup.jsx';
import UploadPhoto from './components/create-project/uploadphoto.jsx';
import FirstSummary from './components/create-project/firstsummary.jsx';
import DateAndTime from './components/create-project/dateandtime.jsx';
import LinkedInAuth from './components/auth/linkedin.jsx';
import FormBuilder from './components/admin/formbuilder.jsx'
import CustomForm from './components/customform.jsx';
import ProjectJoined from './components/projectjoined.jsx';
import ProjectCreated from './components/create-project/projectcreated.jsx';
import Why from './components/why.jsx';
import Register from './components/feedback/register.jsx';
import MiniWhy from './components/create-project/miniwhy.jsx';

const rootElement = document.getElementById('root');

  render(<Router history={ browserHistory }>
    <Route path="/" component={ App }>

      <IndexRoute component={ UserTabs } />
      <Route path='/why' component={Why}/>
      <Route path='/auth/linkedin/' component={LinkedInAuth}/>
      <Route path='/customform' component={CustomForm}/>
      <Route path='/profile' component={Profile}/>
      <Route path='/form/formbuilder' component={FormBuilder}/>
      <Route path='/step/stepper' component={CreateProject}/>
      <Route path='/auto/autocomplete' component={CharityAutocomplete}/>
      <Route path='/create-project/0' component={MiniWhy}/>
      <Route path='/create-project/1' component={Basics}/>
      <Route path='/create-project/2' component={DateAndTime}/>
      <Route path='/create-project/3' component={Story}/>
      <Route path='/create-project/4' component={UploadPhoto}/>
      <Route path='/create-project/summary/1' component={FirstSummary}/>
      <Route path='/create-project/organisation' component={OrganisationLookup}/>
      <Route path='/projects/:pledge/:_id' component={Project}/>
      <Route path='/projects/:pledge/:_id/questions' component={CustomForm}/>
      <Route path='/projects/:pledge/:_id/joined' component={ProjectJoined}/>
      <Route path='/projects/:Name/:_id/register' component={Register}/>
      <Route path='/pages/:tabb/:pledge/:_id' component={Project}/>
      <Route path='/charity/:charityId' component={CharityProfile}/>
      <Route path='/' component={UserTabs}/>
      <Route path='/:tab' component={UserTabs}/>

      <Route path='/profile/:_id' component={Profile}/>
      <Route path='/create-project/:_id' component={ProjectCreated}/>

      <Route path="*" component={ Home } />
      </Route>


  </Router>, rootElement);


registerServiceWorker();
