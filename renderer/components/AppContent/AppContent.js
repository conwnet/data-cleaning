import React from 'react';
import {connect} from 'react-redux';
import NextButton from '../NextButton';
import UploadFile from '../UploadFile';
import ExcelPreview from '../ExcelPreview';
import styles from './AppContent.less';

const getContent = step => {
    switch (step) {
        case 1:
            return <UploadFile />
        case 2:
            return <ExcelPreview />
        default:
            return <div>NotFound</div>
    }
}

const AppContent = ({step}) => (
    <div className={styles.root}>
        {getContent(step)}
        <NextButton />
    </div>
);

const mapStateToProps = ({step}) => ({step});

export default connect(
    mapStateToProps
)(AppContent);
