/**
 * @file 第三步，导出页
 * @author netcon
 */
import React, {PureComponent} from 'react';
import {Button, message} from 'antd';
import {ipcRenderer} from 'electron';
import {bind} from 'lodash-decorators';
import styles from './ExportFile.less';

class ExportFile extends PureComponent {
    componentDidMount() {
        ipcRenderer.on('export-file-reply', this.handleExportFileReply);
    }

    @bind()
    handleExportFileReply() {
        global.unloading();
        message.success('导出成功！');
    }

    @bind()
    handleExportFile() {
        ipcRenderer.send('export-file');
        global.loading();
    }

    render() {
        return (
            <div className={styles.root}>
                <div className={styles.logo} />
                <div className={styles.content}>
                    <Button
                        size="large"
                        type="primary"
                        icon="download"
                        onClick={this.handleExportFile}
                    >
                        导出文件
                    </Button>
                </div>
            </div>
        );
    }
}

export default ExportFile;
