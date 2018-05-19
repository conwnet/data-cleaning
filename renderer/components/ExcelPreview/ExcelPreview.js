/**
 * @file 预览表格内容
 * @author netcon
 */

import React, {PureComponent} from 'react';
import {message} from 'antd';
import {ipcRenderer} from 'electron';
import {connect} from 'react-redux';
import {bind} from 'lodash-decorators';
import Filters from './Filters';
import ContentTable from './ContentTable';
import styles from './ExcelPreview.less';

class ExcelPreview extends PureComponent {
    state = {
        sheets: [],
        current: '未选择',
        rows: []
    };

    componentDidMount() {
        const {current} = this.state;

        ipcRenderer.send('get-excel-content', {current});
        ipcRenderer.on('get-excel-content-reply', this.handleGetExcelContentReply);
    }

    componentWillUnmount() {
        ipcRenderer.removeListener('get-excel-content-reply', this.handleGetExcelContentReply);
    }

    @bind()
    handleGetExcelContentReply(event, reply) {
        const {errcode, errmsg, data} = reply;

        if (errcode) {
            message.error(errmsg);
        } else {
            this.setState(data);
        }
    }

    render() {
        const {sheets, current, rows} = this.state;

        return (
            <div className={styles.root}>
                <Filters
                    sheets={sheets}
                    current={current}
                    onChange={e => {console.log(e)}}
                />
                <ContentTable rows={rows} />
            </div>
        );
    }
}

const mapStateToProps = ({fileList}) => ({fileList});

export default connect(
    mapStateToProps
)(ExcelPreview);
