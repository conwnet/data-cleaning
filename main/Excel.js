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
    openExcelFile(file) {
        try {
            this.workbook = xlsx.readFile(file);
            return true;
        } catch (e) {
            return false;
        }
    }

    getExcelFirstSheet() {
        return this.workbook.SheetNames[0];
    }

    getExcelData({current, startRow, startCol, rowCount, colCount}) {
        if (!this.workbook) {
            return false;
        }

        const sheets = this.workbook.SheetNames;
        const worksheet = this.workbook.Sheets[current];
        const rows = [];

        for (let i = 0; i < +rowCount; i++) {
            const cols = {length: colCount, key: i};

            for (let j = 0; j < +colCount; j++) {
                const key = getColKey(+startCol + j) + (+startRow + i);
                const cell = worksheet[key];

                cols[j] = getOr('', 'v', cell);
            }
            rows.push(cols);
        }
        return {sheets, rows};
    }
}

export default Excel;
