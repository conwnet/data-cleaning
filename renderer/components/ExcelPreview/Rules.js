/**
 * @file 配置清洗规则
 * @author netcon
 */

import React, {PureComponent} from 'react';
import {bind} from 'lodash-decorators';
import {ipcRenderer} from 'electron';
import {Checkbox, Modal, Radio, Input, Button} from 'antd';
import styles from './Rules.less';

const RadioGroup = Radio.Group;

const TYPE_TO_TITLE = {
    'sort': '多项排序规则',
    'unique': '多项去重规则',
    'format': '统一格式规则',
    'regexp': '正则过滤规则',
    'ai': '智能纠错规则'
};

const TYPE_TO_NAME = {
    'sort': '排序',
    'unique': '去重',
    'format': '格式化',
    'regexp': '过滤',
    'ai': '纠错'
}

class CommonRule extends PureComponent {
    @bind()
    handleRadioChange({target}) {
        const {type, updateRule} = this.props;
        
        updateRule({[type]: {rule: {type: target.value}}});
    }
    
    @bind()
    handleInputChange({target}) {
        const {type, updateRule} = this.props;

        updateRule({[type]: {rule: {regexp: target.value}}});
    }

    render() {
        const {rule, type} = this.props;

        return (
            <div className={styles.subRule}>
                <RadioGroup value={rule.type} onChange={this.handleRadioChange}>
                    <Radio value={'nature'}>
                        <span className={styles.rule}>自然连接{TYPE_TO_NAME[type]}</span>
                    </Radio>
                    <Radio value={'regexp'}>
                        <span>正则连接{TYPE_TO_NAME[type]}</span>
                        <Input
                            value={rule.regexp}
                            placeholder="在此输入正则表达式"
                            disabled={rule.type !== 'regexp'}
                            onChange={this.handleInputChange}
                        />
                    </Radio>
                </RadioGroup>
            </div>
        );
    }
}

class RegExpRule extends PureComponent {
    @bind()
    handleInputChange({target}) {
        this.props.updateRule({regexp: {rule: target.value}});
    }

    render() {
        const {rule, type} = this.props;

        return (
            <Input
                value={rule}
                placeholder="在此输入正则表达式"
                onChange={this.handleInputChange}
            />
        );
    }
}

class Rules extends PureComponent {
    state = {
        current: 'sort' // 当前配置的清洗规则
    }

    componentDidMount() {
        ipcRenderer.on('calculate-reply', this.handleCalculateReply);
    }


    componentWillUnmount() {
        ipcRenderer.removeListener('calculate-reply', this.handleCalculateReply);
    }

    @bind()
    handleCalculateReply() {
        const {filter} = this.props;

        ipcRenderer.send('get-excel-data', filter);
    }

    @bind()
    handleChange(type) {
        const {updateRule} = this.props;

        return e => {
            updateRule({[type]: {status: e.target.checked}});
            e.target.checked && this.setState(({current}) => ({current: type}));
        }
    }

    @bind()
    handleCancel() {
        const {current} = this.state;
        const {updateRule} = this.props;

        updateRule({[current]: {status: false}});
        this.setState({current: ''});
    }

    @bind()
    startCalculate() {
        const {rule, filter: {currentSheet}} = this.props;

        global.loading();
        ipcRenderer.send('calculate', {...rule, currentSheet});
    }

    render() {
        const {current} = this.state;
        const {updateRule, rule} = this.props;
        const {sort, unique, format, regexp, ai} = rule;

        return (
            <div className={styles.root}>
                <Checkbox checked={sort.status} onChange={this.handleChange('sort')}>多项排序</Checkbox>
                <Checkbox checked={unique.status} onChange={this.handleChange('unique')}>多项去重</Checkbox>
                <Checkbox checked={format.status} onChange={this.handleChange('format')}>统一格式</Checkbox>
                <Checkbox checked={regexp.status} onChange={this.handleChange('regexp')}>正则过滤</Checkbox>
                <Checkbox checked={ai.status} onChange={this.handleChange('ai')}>智能纠错</Checkbox>
                <Button type="primary" size="small" onClick={this.startCalculate}>开始清理</Button>
                <Modal
                    okText="确定"
                    cancelText="取消"
                    visible={current === 'regexp'}
                    title={TYPE_TO_TITLE[current]}
                    onCancel={this.handleCancel}
                    onOk={() => this.setState({current: ''})}
                >
                    <RegExpRule rule={regexp.rule} updateRule={updateRule} />
                </Modal>
            </div>
        );
    }
}

export default Rules;