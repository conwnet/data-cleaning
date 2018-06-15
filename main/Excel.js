/**
 * @file Excel 类
 * @author netcon
 */

import cluster from 'cluster';
import xlsx from 'xlsx';
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

const getColNumber = k => {
    const base = 'A'.codePointAt(0);
    let number = 0;
    let n = 1;

    for (let i = k.length - 1; i >= 0; i--) {
        number += (k.codePointAt(i) - base + 1) * n;
        n *= 26;
    }
    return number;
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

        if (!columns.length) {
            return false;
        }

        Object.entries(worksheet).forEach(([key, value]) => {
            if (!key.startsWith('!')) {
                const [_, col, row] = key.match(/([a-zA-Z]+)(\d+)/);

                if (!mapRowKeys[row]) {
                    mapRowKeys[row] = [];
                }

                mapRowKeys[row].push([col, value]);
            }
        });

        const getRowWeight = row => columns.reduce((p, v) => (
            p + getOr('', 'v', worksheet[getColKey(v) + row]) + '_'
        ), '') + Math.random();
        const rows = Object.keys(mapRowKeys);
        const lines = rows.map(row => mapRowKeys[row]);
        const weights = rows.map(row => getRowWeight(row));
        const swap = (first, second) => {
            [lines[first], lines[second]] = [lines[second], lines[first]];
            [weights[first], weights[second]] = [weights[second], weights[first]];
        }

        (function quickSort(left, right) {
            if (right - left > 0) {
                const rand = parseInt(Math.random() * (right - left + 1), 10) + left;
                swap(left, rand);
                const key = weights[left];
                let p = left + 1, q = right;

                while (p <= q) {
                    if (weights[p] > key) {
                        swap(p, q--);
                    } else {
                        p++;
                    }
                }
                swap(left, p - 1);
                quickSort(left, p - 2);
                quickSort(p, right);
            }
        })(0, lines.length - 1);

        Object.entries(worksheet).forEach(([key, value]) => {
            if (!key.startsWith('!')) {
                Reflect.deleteProperty(worksheet, key);
            }
        });

        rows.forEach((row, idx) => {
            lines[idx].forEach(([col, value]) => {
                worksheet[col + row] = value;
            });
        });

        return true;
    }

    unique(rule) {
        const {currentSheet, columns} = rule;
        const worksheet = this.workbook.Sheets[currentSheet];
        const mapRowKeys = {};

        if (!columns.length) {
            return false;
        }

        Object.entries(worksheet).forEach(([key, {v}]) => {
            if (!key.startsWith('!')) {
                const [_, col, row] = key.match(/([a-zA-Z]+)(\d+)/);

                if (!mapRowKeys[row]) {
                    mapRowKeys[row] = [];
                }

                const colIndex = getColNumber(col) - 1;
                mapRowKeys[row][colIndex] = v;
            }
        });

        const getRowWeight = row => columns.reduce((p, v) => {
            const cell = getOr('', 'v', worksheet[getColKey(v) + row]);

            return p + (cell ? cell + '_' : '');
        }, '') || '' + Math.random() + Math.random();
        const rows = Object.keys(mapRowKeys).sort((a, b) => a - b);
        const lines = rows.map(row => mapRowKeys[row]);
        const weights = rows.map(row => getRowWeight(row));
        const sheetData = (memorize => lines.filter((_, idx) => {
            if (!memorize[weights[idx]]) {
                memorize[weights[idx]] = true;
                return true;
            } else {
                return false;
            }
        }))({});

        this.workbook.Sheets[currentSheet] = xlsx.utils.aoa_to_sheet(sheetData);

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
