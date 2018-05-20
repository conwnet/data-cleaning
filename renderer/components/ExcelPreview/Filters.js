/**
 * @file 一堆 filters
 * @author netcon
 */

import React, {PureComponent} from 'react';
import {bind} from 'lodash-decorators';
import {connect} from 'react-redux';
import {Button, Menu, Dropdown, Icon, Input} from 'antd';
import {handleReply} from '~/common/util';
import {update_excel_data} from '~/actions';
import styles from './Filters.less';

const SheetFilter = ({sheets, current, onChange}) => {
    const handleClick = ({key}) => onChange({current: key});
    const menus = (
        <Menu onClick={handleClick}>
            {sheets.map(sheet => (
                <Menu.Item key={sheet}>
                    {sheet}
                </Menu.Item>
            ))}
        </Menu>
    );

    return (
        <Dropdown overlay={menus}>
            <Button style={{marginLeft: 8}}>
                {current} <Icon type="down" />
            </Button>
        </Dropdown>
    );
};

class Filters extends PureComponent {
    render() {
        const {sheets, filter, onChange} = this.props;
        const {current, startRow, startCol, rowCount, colCount} = filter;
        const handleChange = key => e => onChange({[key]: e.target.value});

        return (
            <div className={styles.root}>
                <SheetFilter
                    sheets={sheets}
                    current={current}
                    onChange={onChange}
                />
                <Input addonBefore="起始行" value={startRow} onChange={handleChange('startRow')} />
                <Input addonBefore="起始列" value={startCol} onChange={handleChange('startCol')} />
                <Input addonBefore="显示行数" value={rowCount} onChange={handleChange('rowCount')} />
                <Input addonBefore="显示列数" value={colCount} onChange={handleChange('colCount')} />
            </div>
        );
    }
}

export default Filters;
