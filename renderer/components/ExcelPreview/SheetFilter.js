import React, {PureComponent} from 'react';
import {Menu, Dropdown, Button, Icon} from 'antd';

const SheetFilter = ({sheets, current, onChange}) => {
    const menus = (
        <Menu onClick={onChange}>
            {sheets.map(sheet => (
                <Menu.Item key={sheet}>
                    {sheet}
                </Menu.Item>
            ))}
        </Menu>
    );

    return (
        <Dropdown overlay={menus}>
            <Button style={{marginLeft: 8}}>
                {current} <Icon type="down" />
            </Button>
        </Dropdown>
    );
};

export default SheetFilter;
