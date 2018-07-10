import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { BrowserRouter as Router, Route} from 'react-router-dom';

import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware, compose } from  'redux';

import thunk from 'redux-thunk';

import networkReducer from './store/reducer/networkReducer';
import analyticsReducer from './store/reducer/analytics';

// const rootReducer = (networkReducer);
const rootReducer = combineReducers({
  network: networkReducer,
  analytics: analyticsReducer,
});

const logger = (state) => {
  return next => {
    return action => {
      // console.log('[Middleware] Dispatching', action);
      const result = next(action);
      // console.log('[Middleware] next state', state.getState());
      return result;
    };
  };
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(logger, thunk)));

const app = (
  <Provider store={store}>
    <Router>
      <Route path="/:filter?" component={App} />
    </Router>
  </Provider>
);

ReactDOM.render( app, document.getElementById('root') );
registerServiceWorker();

// store={store}

