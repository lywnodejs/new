import React from 'react';
import {Radio} from 'antd';

class ListTagSelector extends React.Component {
    render() {
        const {
            dataSource,
            ...props
        } = this.props;
        const radioItems = dataSource.map((item) => 
            <Radio.Button key={item.key} value={item.key}>{item.name}({item.assistInfo})</Radio.Button>
        );
        return (
            <Radio.Group {...props} buttonStyle="solid">
                {radioItems}
            </Radio.Group>
        );
    }
}

export default ListTagSelector;