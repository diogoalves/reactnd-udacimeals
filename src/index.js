import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import Raven from "raven-js";
import createRavenMiddleware from "raven-for-redux";
import { createStore, applyMiddleware, compose } from 'redux';
import reducer from './reducers';
import LogRocket from 'logrocket';
import thunk from 'redux-thunk';


// Setting up LogRocket
LogRocket.init('8iwvex/reactnd-udacimeals');


// Configuring Sentry LOG
Raven.config('https://ef4fdf97e157452287248401a56c2d01@sentry.io/272996').install();


const initialState = {};

const localLogMiddleware = store => next => action => {
  console.group(action.type);
  console.info('dispatching', action);
  let result = next(action);
  console.log('next state', store.getState());
  console.groupEnd(action.type);
  return result;
}

Raven.setDataCallback(function (data) {
  data.extra.sessionURL = LogRocket.sessionURL;
  return data;
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middleware = [
  createRavenMiddleware(Raven, {}),
  localLogMiddleware,
  LogRocket.reduxMiddleware(),
  thunk
];

const store = createStore(
  reducer,
  initialState,
  composeEnhancers(
    applyMiddleware(...middleware)
  )
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  , document.getElementById('root'));
registerServiceWorker();
