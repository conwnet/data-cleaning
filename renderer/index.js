import React from 'react';
import {createStore} from 'redux';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import App from './components/App';
import rootReducer from './reducers';
import 'antd/dist/antd.css';
import './style.css';

const store = createStore(rootReducer);

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
);
