/**
 * @file 预览表格内容
 * @author netcon
 */

import React, {PureComponent} from 'react';
import {message} from 'antd';
import {ipcRenderer} from 'electron';
import {connect} from 'react-redux';
import {bind} from 'lodash-decorators';
import {handleReply} from '~/common/util';
import {update_excel, update_filter} from '~/actions';
import Filters from './Filters';
import ContentTable from './ContentTable';
import styles from './ExcelPreview.less';

class ExcelPreview extends PureComponent {
    componentDidMount() {
        ipcRenderer.on('get-excel-data-reply', this.handleGetExcelDataReply);
        ipcRenderer.on('get-excel-first-sheet-reply', this.handleGetExcelFirstSheetReply);
        ipcRenderer.send('get-excel-first-sheet');
    }

    componentWillUnmount() {
        ipcRenderer.removeListener('get-excel-data-reply', this.handleGetExcelDataReply);
        ipcRenderer.removeListener('get-excel-first-sheet-reply', this.handleGetExcelFirstSheetReply);
    }

    @bind()
    handleGetExcelFirstSheetReply(event, reply) {
        handleReply(reply, this.props.updateFilter);
    }

    @bind()
    handleGetExcelDataReply(event, reply) {
        handleReply(reply, this.props.updateExcel);
    }

    render() {
        const {updateFilter, excel, filter} = this.props;

        return (
            <div className={styles.root}>
                <Filters
                    sheets={excel.sheets}
                    filter={filter}
                    onChange={updateFilter}
                />
                <ContentTable className={styles.table} rows={excel.rows} />
            </div>
        );
    }
}

const mapStateToProps = ({excel, filter}) => ({
    excel, filter,
});
const mapDispatchToProps = {
    updateExcel: update_excel,
    updateFilter: update_filter
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ExcelPreview);
