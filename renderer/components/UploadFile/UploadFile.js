import React, {PureComponent} from 'react';
import {Icon} from 'antd';
import UploadBox from './UploadBox';
import styles from './UploadFile.less';

class UploadFile extends PureComponent {
    render() {
        const {fileList} = this.props;

        return (
            <div className={styles.root}>
                <div className={styles.title}>
                    请上传一个 Excel 文件
                </div>
                <UploadBox />
            </div>
        );
    }
}

export default UploadFile;
