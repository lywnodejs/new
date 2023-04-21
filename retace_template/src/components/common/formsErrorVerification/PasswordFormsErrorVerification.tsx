import React from 'react';
// import MD style
import clsx from 'clsx';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
// import MD component
import {FormControl, FormHelperText, IconButton, Input, InputAdornment, InputLabel} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';

const useStyle = makeStyles((theme: Theme) => createStyles({
    margin: {
        margin: theme.spacing(1),
    },
    textField: {
        width: '100%',
    },
}));

interface PasswordFormsState {
    label: string;
    value: any;
    showPassword: boolean;
    handleChangePassword: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleClickShowPassword: () => void;
    isError?: boolean;
    helperText?: string;
}

export const PasswordFormsErrorVerification:React.FC<PasswordFormsState> = (
    {
        label, value = '', showPassword = false,
        handleChangePassword , handleClickShowPassword,
        isError = false, helperText = "Error!"
    }
) => {
    const classes = useStyle();

    return (
        isError ? (
            // error
            <FormControl
                error
                className={clsx(classes.margin, classes.textField)}
            >
                <InputLabel htmlFor={label}>{label}</InputLabel>
                <Input
                    id={label}
                    value={value}
                    type={showPassword ? 'text' : 'password'}
                    onChange={handleChangePassword}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                            >
                                {showPassword ?
                                    <Visibility/> : <VisibilityOff/>
                                }
                            </IconButton>
                        </InputAdornment>
                    }
                />
                <FormHelperText id={`${label}-error-text`}>
                    {helperText}
                </FormHelperText>
            </FormControl>
        ) : (
            // success
            <FormControl
                className={clsx(classes.margin, classes.textField)}
            >
                <InputLabel htmlFor={label}>{label}</InputLabel>
                <Input
                    id={label}
                    value={value}
                    type={showPassword ? 'text' : 'password'}
                    onChange={handleChangePassword}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                            >
                                {showPassword ?
                                    <Visibility/> : <VisibilityOff/>
                                }
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>
        )
    );
};