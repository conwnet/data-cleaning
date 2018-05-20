import React from 'react';
import {createStore} from 'redux';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import Loading from '~/common/Loading';
import App from './components/App';
import rootReducer from './reducers';
import 'antd/dist/antd.css';
import './style.css';

const store = createStore(rootReducer);

render(
    <Loading />,
    document.body.appendChild(document.createElement('div'))
);
render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
);
