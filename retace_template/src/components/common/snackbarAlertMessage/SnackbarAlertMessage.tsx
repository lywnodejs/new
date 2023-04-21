import React, {useEffect, useState} from 'react';
import {Snackbar} from '@material-ui/core';
import {Alert} from '@material-ui/lab';

interface SnackbarAlertMessageState {
    isOpen: boolean;            // whether open message
    text: string;               // content of message
    type: any;                  // type of message: success, error, warning et al.
    duration?: number | null;   // duration of the message
    closeAlert: () => void;     // a func to close alert message box
    alertVertical?: 'top' | 'bottom';     // vertical position
    alertHorizontal?: 'left' | 'center' | 'right';   // horizontal position
};

export const SnackbarAlertMessage: React.FC<SnackbarAlertMessageState> = (
    {
        isOpen, text, type, duration=10000,closeAlert,
        alertVertical='top', alertHorizontal='center'
    }
) => {
    const [open, setOpen] = useState(isOpen);

    // monitor whether isOpen is changed
    useEffect(() => {
        setOpen(isOpen);
    }, [isOpen]);

    return (
        <Snackbar
            open={open}
            autoHideDuration={duration}
            onClose={closeAlert}
            anchorOrigin={{vertical:alertVertical, horizontal:alertHorizontal}}
        >
            <Alert onClose={closeAlert} severity={type}>
                {text}
            </Alert>
        </Snackbar>
    );
};