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

    getExcelData({currentSheet, startRow, startCol, rowCount, colCount}) {
        if (!this.workbook) {
            return false;
        }

        const sheets = this.workbook.SheetNames;
        const worksheet = this.workbook.Sheets[currentSheet];
        const rows = [];
        // console.log(worksheet);

        for (let i = 0; i < +rowCount; i++) {
            const cols = {length: colCount, key: i};

            for (let j = 0; j < +colCount; j++) {
                const cell = worksheet[getColKey(+startCol + j) + (+startRow + i)];

                cols[j] = getOr('', 'v', cell);
            }
            rows.push(cols);
        }
        return {sheets, rows};
    }

    sort(rule) {
        const {currentSheet, columns} = rule;
        const worksheet = this.workbook.Sheets[currentSheet];
        const mapRowKeys = {};

        // console.log(worksheet);
        Object.keys(worksheet).forEach(key => {
            if (!key.startsWith('!')) {
                const row = getOr('', 1, key.match(/[a-zA-Z]+(\d+)/));

                if (!mapRowKeys[row]) {
                    mapRowKeys[row] = [];
                }

                mapRowKeys[row].push(key);
            }
        });

        const rowKeys = [];
        const rowValues = [];
        const sortByValue = (a, b) => a - b;
        const getCellValue = key => ({k: key, v: getOr('', `${key}.v`, worksheet)});


        Object.keys(mapRowKeys).sort(sortByValue).forEach(row => {
            const keys = mapRowKeys[row].sort();

            rowKeys.push(keys);
            rowValues.push(keys.map(getCellValue));
        });

        const sortByColumns = (a, b) => {
            const ra = columns.reduce((r, i) => '' + r + a[i - 1], '');
            const rb = columns.reduce((r, i) => '' + r + b[i - 1], '');

            return ra > rb ? 1 : -1;
        }

        const sortedRowValues = rowValues.sort(sortByColumns);
        // console.log(sortedRowValues, rowKeys);
        rowKeys.forEach((keys, i) => {
            keys.forEach((key, j) => {
                worksheet[key].v = sortedRowValues[i][j];
                // console.log(key, i, j, sortedRowValues[i][j]);
            });
        });
        console.log(sortedRowValues);

        return true;
    }
}

export default Excel;



/*
{ ai: { status: false },
  columns: [],
  currentSheet: '107-2',
  format: { status: false },
  regexp: { rule: '', status: false },
  sort: { status: true },
  unique: { status: false } }
*/
