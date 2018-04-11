import React from 'react';
import {  render } from 'react-dom';
import './index.css';
import App from './App.jsx';
import registerServiceWorker from './registerServiceWorker';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import asyncComponent from './AsyncComponent'
import Project from  './components/project.jsx'
import EmbeddedProject from './components/embeddedproject.jsx'
import AllProjects from './components/allprojects.jsx';
import NewWhy from './components/newwhy.jsx';

const Terms = asyncComponent(() =>
  import('./components/terms.jsx').then(module => module.default)
)
const About = asyncComponent(() =>
  import('./components/about.jsx').then(module => module.default)
)
const EmailTemplateFrontPage = asyncComponent(() =>
  import('./components/admin/emailtemplatefrontpage.jsx').then(module => module.default)
)
const MiniWhy = asyncComponent(() =>
  import('./components/create-project/miniwhy.jsx').then(module => module.default)
)
const CantCome = asyncComponent(() =>
  import('./components/cantcome.jsx').then(module => module.default)
)
const Register = asyncComponent(() =>
  import('./components/feedback/register.jsx').then(module => module.default)
)
const Profile = asyncComponent(() =>
  import('./components/profile.jsx').then(module => module.default)
)
const CharityProfile = asyncComponent(() =>
  import('./components/charityprofile.jsx').then(module => module.default)
)
const UserTabs = asyncComponent(() =>
  import('./components/tabs.jsx').then(module => module.default)
)
const OrganisationLookup = asyncComponent(() =>
  import('./components/create-project/organisationlookup.jsx').then(module => module.default)
)
const ProjectJoined = asyncComponent(() =>
  import('./components/projectjoined.jsx').then(module => module.default)
)
const Why = asyncComponent(() =>
  import('./components/why.jsx').then(module => module.default)
)
const EditProfile = asyncComponent(() =>
  import('./components/editprofile.jsx').then(module => module.default)
)
const EditCharity = asyncComponent(() =>
  import('./components/editcharity.jsx').then(module => module.default)
)
const OrganisationType = asyncComponent(() =>
  import('./components/create-project/organisationtype.jsx').then(module => module.default)
)
const Basics = asyncComponent(() =>
  import('./components/create-project/basics.jsx').then(module => module.default)
)
const Story = asyncComponent(() =>
  import('./components/create-project/story.jsx').then(module => module.default)
)
const DateAndTime = asyncComponent(() =>
  import('./components/create-project/dateandtime.jsx').then(module => module.default)
)
const AdminView = asyncComponent(() =>
  import('./components/admin/adminview.jsx').then(module => module.default)
)
const ProjectReview = asyncComponent(() =>
  import('./components/feedback/projectreview.jsx').then(module => module.default)
)
const ReviewOverview = asyncComponent(() =>
  import('./components/feedback/project-review-overview.jsx').then(module => module.default)
)
const ShortReview = asyncComponent(() =>
  import('./components/feedback/shortreview.jsx').then(module => module.default)
)
const VolunteerStars = asyncComponent(() =>
  import('./components/feedback/volunteerstars.jsx').then(module => module.default)
)
const EmailTemplateBuilder = asyncComponent(() =>
    import('./components/admin/emailtemplatebuilder.jsx').then(module => module.default)
)

const ImageCrop = asyncComponent(() =>
    import('./components/admin/imagecrop.jsx').then(module => module.default)
)
const CaseStudy = asyncComponent(() =>
    import('./components/casestudy.jsx').then(module => module.default)
)


const rootElement = document.getElementById('root');

  render(<Router onUpdate={() => window.scrollTo(0, 0)} history={ browserHistory }>
    <Route path="/" component={ App }>

      <IndexRoute component={ UserTabs } />
      <Route path='/why' component={Why}/>
      <Route path='/admin/emailtemplate' component={EmailTemplateFrontPage}/>
      <Route path='/admin/emailtemplate/new' component={EmailTemplateBuilder}/>
      <Route path='/admin/emailtemplate/:templateId' component={EmailTemplateBuilder}/>
      <Route path='/terms' component={Terms}/>
      <Route path='/profile' component={Profile}/>
      <Route path='/casestudy' component={CaseStudy}/>
      <Route path='/newwhy' component={NewWhy}/>
      <Route path='/about' component={About}/>
      <Route path='/projects' component={AllProjects}/>
      <Route path='/profile/edit' component={EditProfile}/>
      <Route path='/create-project/0' component={MiniWhy}/>
      <Route path='/create-project/choose-type' component={OrganisationType}/>
      <Route path='/create-project/1' component={Basics}/>
      <Route path='/create-project/2' component={DateAndTime}/>
      <Route path='/create-project/3' component={Story}/>
      <Route path='/create-project/organisation' component={OrganisationLookup}/>
      <Route path='/embed/:_id' component={EmbeddedProject}/>
      <Route path='/project/' component={Project}/>
      <Route path='/projects/:pledge/:_id' component={Project}/>
      <Route path='/projects/:pledge/:_id/crop-edit' component={ImageCrop}/>
      <Route path='/projects/:pledge/:_id/admin' component={AdminView}/>
      <Route path='/projects/:pledge/:_id/admin/:adminTab' component={AdminView}/>
      <Route path='/projects/:pledge/:_id/completed' component={Project}/>
      <Route path='/projects/:pledge/:_id/review/project' component={ReviewOverview}/>
      <Route path='/projects/:pledge/:_id/review/project/long' component={ProjectReview}/>
      <Route path='/projects/:pledge/:_id/review/project/short' component={ShortReview}/>
      <Route path='/projects/:Name/:_id/review/:userId' component={VolunteerStars}/>
      <Route path='/projects/:pledge/:_id/joined' component={ProjectJoined}/>
      <Route path='/projects/:pledge/:_id/declined' component={CantCome}/>
      <Route path='/projects/:Name/:_id/register' component={Register}/>
      <Route path='/projects/:pledge/:_id/:challengeId/joined' component={ProjectJoined}/>
      <Route path='/projects/:pledge/:_id/:challengeId' component={Project}/>
      <Route path='/pages/:tab/:pledge/:_id' component={Project}/>
      <Route path='/charity/:charityId' component={CharityProfile}/>
      <Route path='/charity/:charityId/edit' component={EditCharity}/>
      <Route path='/' component={UserTabs}/>
      <Route path='/:tab' component={UserTabs}/>

      <Route path='/profile/:_id' component={Profile}/>
      <Route path="*" component={ UserTabs } />
      </Route>


  </Router>, rootElement);


registerServiceWorker();
