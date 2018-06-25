import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { Provider } from 'react-redux';
import { createStore } from  'redux';

import reducer from './store/reducer/reducer';

// const store = createStore(reducer);

const app = (
  <Provider >
    <App />
  </Provider>
);

ReactDOM.render( app, document.getElementById('root'));
registerServiceWorker();

// store={store}
