import React, {PureComponent} from 'react';
import SheetFilter from './SheetFilter';

class Filters extends PureComponent {
    render() {
        const {sheets, current, onChange} = this.props;

        return (
            <div>
                <SheetFilter
                    sheets={sheets}
                    current={current}
                    onChange={e => {console.log(e)}}
                />
            </div>
        );
    }
}

export default Filters;
