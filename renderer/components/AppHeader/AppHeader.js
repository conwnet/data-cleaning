import React from 'react';
import {Menu} from 'antd';
import {connect} from 'react-redux';
import styles from './AppHeader.less';

const {Item} = Menu;

const AppHeader = ({step}) => (
    <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[step + '']}
        className={styles.root}
    >
        <Item key="1">上传文件</Item>
        <Item key="2">数据清理</Item>
        <Item key="3">输出结果</Item>
    </Menu>
);

const mapStateToProps = ({step}) => ({step});

export default connect(
    mapStateToProps
)(AppHeader);
