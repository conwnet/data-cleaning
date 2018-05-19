import React from 'react'
import {Button} from 'antd';
import {connect} from 'react-redux';
import {next_step} from '../../actions';
import styles from './NextButton.less';

const NextButton = ({step, file, nextStep}) => (
    <div className={styles.root}>
        <Button type="primary" onClick={nextStep} disabled={!file}>
            {step === 3 ? '完成' : '下一步'}
        </Button>
    </div>
);

const mapStateToProps = ({step, file}) => ({step, file});

const mapDispatchToProps = dispatch => ({
    nextStep: () => dispatch(next_step())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NextButton);
