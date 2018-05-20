import React, {PureComponent} from 'react';
import {bind} from 'lodash-decorators';
import {Spin} from 'antd';
import './Loading.css';

class Loading extends PureComponent {
    state = {
        loading: 0
    };

    componentDidMount() {
        global.loading = this.startLoading;
        global.unloading = this.endLoading;
    }

    @bind()
    startLoading() {
        this.setState(({loading}) => ({
            loading: loading + 1
        }));
    }

    @bind()
    endLoading() {
        this.setState(({loading}) => ({
            loading: loading - 1
        }));
    }

    render() {
        return this.state.loading > 0 ? (
            <Spin id="loading" tip="正在处理中，请稍候..." />
        ) : null;
    }
}

export default Loading;
