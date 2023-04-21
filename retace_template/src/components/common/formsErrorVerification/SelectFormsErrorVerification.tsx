import React from 'react';
// import MD compoenet
import {FormControl, FormHelperText, InputLabel, MenuItem, Select} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import { SelectProps } from "@material-ui/core/Select";
import { MenuProps } from "@material-ui/core/Menu";

interface SelectFormsState extends SelectProps {
    label: string;
    value: string | number;
    items: any[];
    handleChangeSelect: (event: React.ChangeEvent<{ value: unknown }>) => void;
    width?: any;
    isError?: boolean;
    helperText?: string;
    size?: 'small' | 'medium';
}

export const menuProps: Omit<MenuProps, "open"> = {
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "left",
    },
    getContentAnchorEl: null,
    PaperProps: {
      style: {
        maxHeight: 200,
      },
    },
  };

export const SelectFormsErrorVerification: React.FC<SelectFormsState> = (
    {
        label, value, items, handleChangeSelect,
        width='100%', isError = false, helperText = '', 
        size, style,
        ...props
    }
) => {
    const useStyle = makeStyles((theme: Theme) => createStyles({
        selectFormControl: {
            margin: theme.spacing(1),
            minWidth: width,
        },
    }));
    const classes = useStyle();
    return (
        isError ? (
            // error
            <FormControl className={classes.selectFormControl} error size={size} style={style}>
                <InputLabel id={`${label}-label`}>{label}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id={`${label}-select`}
                    value={value}
                    onChange={handleChangeSelect}
                    MenuProps={menuProps}
                    {...props}
                >
                    {
                        items?.map(item => (
                            <MenuItem value={item} key={item}>{item}</MenuItem>
                        ))
                    }
                </Select>
                <FormHelperText id={`${label}-helper-text`}>
                    {helperText}
                </FormHelperText>
            </FormControl>
        ) : (
            // success
            <FormControl className={classes.selectFormControl} size={size} style={style}>
                <InputLabel id={`${label}-label`}>{label}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id={`${label}-select`}
                    value={value}
                    onChange={handleChangeSelect}
                    MenuProps={menuProps}
                    {...props}
                >
                    {
                        items?.map(item => (
                            <MenuItem value={item} key={item}>{item}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
        )
    );
};