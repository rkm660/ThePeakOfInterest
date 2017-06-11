import React from 'react';
import {Route} from 'react-router';
import App from './components/App';
import Home from './components/Home';
import Page from './components/Page';
import Bracket from './components/Bracket';


export default (
  <Route component={App}>
    <Route path='/' component={Home} />
    <Route path='/page' component={Page}/>
    <Route path='/bracket' component={Bracket}/>
  </Route>
);