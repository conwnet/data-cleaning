import React from 'react';
import {Layout} from 'antd';
import AppHeader from '../AppHeader';
import AppContent from '../AppContent';
import styles from './App.less';

const {Header, Content, Footer} = Layout;

const App = () => (
    <Layout className={styles.root}>
        <Header className={styles.header}>
            <AppHeader />
        </Header>
        <Content className={styles.content}>
            <AppContent />
        </Content>
        <Footer>
            <div className={styles.footer}>
                工储仓库数据清洗系统
            </div>
        </Footer>
    </Layout>
);

export default App;
