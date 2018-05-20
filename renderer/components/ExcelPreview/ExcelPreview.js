/**
 * @file 预览表格内容
 * @author netcon
 */

import React, {PureComponent} from 'react';
import {message} from 'antd';
import {connect} from 'react-redux';
import {bind} from 'lodash-decorators';
import {ipcRenderer} from 'electron';
import {handleReply} from '~/common/util';
import {update_excel, update_filter, update_rule, toggle_rule_column} from '~/actions';
import Rules from './Rules';
import Filters from './Filters';
import ContentTable from './ContentTable';
import styles from './ExcelPreview.less';

class ExcelPreview extends PureComponent {
    componentDidMount() {
        ipcRenderer.on('get-excel-data-reply', this.handleGetExcelDataReply);
        ipcRenderer.on('get-excel-first-sheet-reply', this.handleGetExcelFirstSheetReply);
        global.loading();
        ipcRenderer.send('get-excel-first-sheet');
    }

    componentWillUnmount() {
        ipcRenderer.removeListener('get-excel-data-reply', this.handleGetExcelDataReply);
        ipcRenderer.removeListener('get-excel-first-sheet-reply', this.handleGetExcelFirstSheetReply);
    }

    @bind()
    handleGetExcelFirstSheetReply(event, reply) {
        handleReply(reply, this.props.updateFilter);
        global.unloading();
    }

    @bind()
    handleGetExcelDataReply(event, reply) {
        handleReply(reply, this.props.updateExcel);
        global.unloading();
    }

    render() {
        const {updateFilter, excel, rule, filter, updateRule, toggleRuleColumn} = this.props;

        return (
            <div className={styles.root}>
                <Filters
                    sheets={excel.sheets}
                    filter={filter}
                    onChange={updateFilter}
                />
                <ContentTable
                    rows={excel.rows}
                    ruleColumns={rule.columns}
                    toggleRuleColumn={toggleRuleColumn}
                />
                <Rules rule={rule} updateRule={updateRule} filter={filter} />
            </div>
        );
    }
}

const mapStateToProps = ({excel, filter, rule}) => ({excel, filter, rule});
const mapDispatchToProps = {
    updateRule: update_rule,
    updateExcel: update_excel,
    updateFilter: update_filter,
    toggleRuleColumn: toggle_rule_column
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ExcelPreview);
