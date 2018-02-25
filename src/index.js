import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-thunk';
import logger from 'redux-thunk';
import reducer from './reducers';

import storeReducer from './reducers'
import registerServiceWorker from './registerServiceWorker';

//let store = createStore(storeReducer)  this is store
const store = createStore(storeReducer, applyMiddleware(thunk, promise, logger));

store.subscribe(function() {
  //console.log('current state is: ',store.getState())
})

ReactDOM.render(<Provider store={store}>
  <App/>
</Provider>, document.getElementById('root'));
registerServiceWorker();
