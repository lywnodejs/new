import React from 'react';
import Typography from '@material-ui/core/Typography';


interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
    isVertical?: boolean
}
export const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...props }) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`wrapped-tabpanel-${index}`}
            aria-labelledby={`wrapped-tab-${index}`}
            style={{ width: '100%' }}
            {...props}
        >
            {value === index && (
                <Typography style={{ margin: '0 20px' }}>{children}</Typography>
            )}
        </div>
    );
}