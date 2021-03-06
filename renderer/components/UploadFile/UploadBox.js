/**
 * @file 上传文件框
 * @author netcon
 */

 import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import withTimeout from 'react-timeout';
import {bind} from 'lodash-decorators';
import {ipcRenderer} from 'electron';
import {Icon, message, Progress} from 'antd';
import {nextProgress, handleReply} from '~/common/util';
import {update_file} from '~/actions';
import styles from './UploadBox.less';

class UploadBox extends PureComponent {
    state = {
        progress: 0
    }

    componentDidMount() {
        ipcRenderer.on('open-excel-file-reply', this.handleOpenExcelFileReply);
    }

    componentWillUnmount() {
        ipcRenderer.removeListener('open-execl-file-reply', this.handleOpenExcelFileReply);
    }

    @bind()
    handleOpenExcelFileReply(event, reply) {
        handleReply(reply, this.props.updateFile, () => {
            this.setState({progress: -1});
        });
    }

    @bind()
    startProgress() {
        // 上传文件失败（文件格式不正确）
        if (this.state.progress < 0) {
            return;
        }

        if (this.props.file) {
            this.setState({progress: 100});
        } else {
            this.setState(({progress}) => ({
                progress: nextProgress(progress)
            }), () => {
                this.props.setTimeout(this.startProgress, 200);
            });
        }
    }

    @bind()
    handleAdd() {
        // 正在上传中或者已经上传文件
        if (this.state.progress > 0 || !!this.props.file) {
            return;
        }

        const reply = ipcRenderer.sendSync('open-excel-file');

        if (!reply.errcode) {
            this.startProgress();
        } else {
            message.error(reply.errmsg);
        }
    }

    @bind()
    handleDelete() {
        this.setState({progress: 0});
        this.props.updateFile(null);
    }

    render() {
        const {progress} = this.state;
        const {file}  = this.props;

        return (
            <div className={styles.root}>
                <div
                    className={styles.box}
                    onClick={this.handleAdd}
                    disabled={!!file || progress > 0}
                >
                    <Icon type="inbox" />
                    <div>点击此处上传文件</div>
                </div>
                {!!file ? (
                    <div
                        title={file.path}
                        className={styles.file}
                        onClick={this.handleDelete}
                    >
                        {file.name}
                        <Icon type="delete" />
                    </div>
                ) : null}
                {progress > 0 ? (
                    <Progress
                        percent={+progress.toFixed(2)}
                    />
                 ) : null}
            </div>
        );
    }
}

const mapStateToProps = ({file}) => ({file});
const mapDispatchToProps = {
    updateFile: update_file
};

export default compose(
    withTimeout,
    connect(mapStateToProps, mapDispatchToProps)
)(UploadBox);
