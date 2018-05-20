import React, {PureComponent} from 'react';
import {bind} from 'lodash-decorators';
import {connect} from 'react-redux';
import {Table} from 'antd';
import {getOr} from 'lodash/fp';
import styles from './ContentTable.less';

const getColKey = n => {
    const base  = 'A'.codePointAt(0);
    let key = '';

    while (n) {
        key = String.fromCodePoint(base + (n - 1) % 26) + key;
        n = (n - 1) / 26 | 0;
    }
    return key;
};

class ColumnTile extends PureComponent {
    @bind()
    handleClick() {
        const {onClick, index} = this.props;
    
        onClick(index);
    }

    render() {
        const {priority, children} = this.props;

        return (
            <div
                onClick={this.handleClick}
                className={priority > -1 ? styles.selectedColumn : ''}
            >
                {priority > -1 ? (
                    <span className={styles.priority}>{priority + 1}</span>
                ) : null}
                {children}
            </div>
        );
    }
}

class ContentTable extends PureComponent {
    getColumns() {
        const {rows, ruleColumns, toggleRuleColumn} = this.props;

        const columns = [{
            key: 'row',
            render(text, record, index) {
                return index + 1;
            }
        }];

        for (let i = 1, l = getOr(0, '0.length', rows); i <= l; i++) {
            columns.push({
                title: (
                    <ColumnTile
                        index={i}
                        onClick={toggleRuleColumn}
                        priority={ruleColumns.indexOf(i)}
                    >
                        {getColKey(i)}
                    </ColumnTile>
                ),
                key: i,
                dataIndex: i - 1
            });
        }

        return columns;
    }

    render() {
        const {rows} = this.props;

        return (
            <div className={styles.root}>
                <Table
                    rowKey="key"
                    dataSource={rows}
                    pagination={false}
                    columns={this.getColumns()}
                />
            </div>
        );
    }
}

export default ContentTable;
