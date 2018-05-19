import React, {PureComponent} from 'react';
import {Table} from 'antd';
import styles from './ContentTable.less';
import { NOTINITIALIZED } from 'dns';
import { EAGAIN } from 'constants';

const columns = [{
    key: 'row',
    render(text, record, index) {
        return index + 1;
    }
}];

const getColKey = n => {
    const base  = 'A'.codePointAt(0);
    let key = '';

    while (n) {
        key = String.fromCodePoint(base + (n - 1) % 26) + key;
        n = (n - 1) / 26 | 0;
    }
    return key;
};

const ContentTable = ({rows}) => {
    for (let i = 0, l = rows.length; i < l; i++) {
        columns.push({
            title: getColKey(i + 1),
            dataIndex: i,
            key: i,
            render(cell) {
                return cell.value;
            }
        });
    }

    return (
        <div className={styles.root}>
            <Table
                rowKey={'row'}
                dataSource={rows}
                columns={columns}
                pagination={false}
            />
        </div>
    );
};

export default ContentTable;
