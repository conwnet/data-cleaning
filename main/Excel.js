/**
 * @file Excel 类
 * @author netcon
 */

import cluster from 'cluster';
import xlsx from 'js-xlsx';
import {getOr} from 'lodash/fp';

// xlsx 读取的数据类型
const TYPE_TO_TEXT = {
    b: 'bool',
    e: 'error',
    n: 'number',
    d: 'date',
    s: 'string',
    z: 'stub'
};

// 获取 Excel 中横轴的第 n 个坐标
const getColKey = n => {
    const base  = 'A'.codePointAt(0);
    let key = '';

    while (n) {
        key = String.fromCodePoint(base + (n - 1) % 26) + key;
        n = (n - 1) / 26 | 0;
    }
    return key;
};

class Excel {
    // 从 file 中读取 Excel 表格
    init(file) {
        try {
            this.workbook = xlsx.readFile(file);
            return true;
        } catch (e) {
            return false;
        }
    }

    getContent(sheet, row = 10, col = 10) {
        if (!this.workbook) {
            return false;
        }

        const sheets = this.workbook.SheetNames;
        const current = sheet || sheets[0];
        const worksheet = this.workbook.Sheets[current];
        const rows = [];

        for (let i = 1; i <= row; i++) {
            const cols = [];

            for (let j = 1; j <= col; j++) {
                const cell = worksheet[getColKey(j) + i];

                cols.push({
                    type: TYPE_TO_TEXT[getOr('s', 't', cell)],
                    value: getOr('', 'v', cell)
                });
            }
            rows.push(cols);
        }
        // console.log(rows);
        return {sheets, current, rows};
    }
}

export default Excel;
