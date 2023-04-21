import React from 'react';
// import MD component
import {TextField} from '@material-ui/core';

interface TextFormsState {
    label: string;
    value: any;
    handleChangeText: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isError?: boolean;
    helperText?: string;
    disabled?: boolean;
}

export const TextFormsErrorVerification:React.FC<TextFormsState> = (
    {
        label, value = '', handleChangeText, disabled,
        isError = false, helperText = "Error!"
    }
) => {

    return (
        isError ? (
            // error
            <TextField
                error helperText={helperText}
                id={label} label={label}
                value={value}
                onChange={handleChangeText}
            />
        ) : (
            // success
            <TextField
                id={label} label={label}
                value={value}
                onChange={handleChangeText}
                disabled={disabled}
            />
        )
    );
};