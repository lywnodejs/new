import React from 'react';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

interface AlertBoxState {
    title: string,
    text: JSX.Element,
    type: 'error' | 'warning' | 'info' | 'success',
};

export const AlertBox: React.FC<AlertBoxState> = ({
    title, text, type
}) => {
    return (
        <Alert severity={type}>
            <AlertTitle>{title}</AlertTitle>
            {text}
        </Alert>
    );
};