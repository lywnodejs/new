import React, {useState, useEffect} from 'react';
// import customize component
import {
    SnackbarAlertMessage,
    TextFormsErrorVerification,
    PasswordFormsErrorVerification,
} from '../../../components/common';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
// import customize hook
import {useKeyPress} from '../../../hooks';


const useStyle = makeStyles((theme: Theme) => createStyles({
    registerForm: {
        justifyContent: 'center',
        marginRight: 45,
        marginLeft: 35,
        '& > *': {
            margin: '8px 8px',
            width: '100%',
        },
    },
    registerBtn: {
        marginTop: 15,
    },
    registerBtnIcon: {
        marginLeft: 10
    },
}));

// Admin & Apps State
interface RegisterAdminAppsState {
    username: string;
    email: string;
    password1: string;
    password2: string;
    showPassword1: boolean;
    showPassword2: boolean;
    usernameErrorMessage: string;
    emailErrorMessage: string;
    password1ErrorMessage: string;
    password2ErrorMessage: string;
    openSnackbarAlertMessage: boolean;
    SnackbarAlertMessage: string;
    alertType: string;
}

// Props State
interface PropsState {
    role: string;
}

export const RegisterAdminAppsForms:React.FC<PropsState> = ({role}) => {
    const classes = useStyle();
    const enterPressed = useKeyPress(13);
    const [values, setValues] = useState<RegisterAdminAppsState>({
        username: '',
        email: '',
        password1: '',
        password2: '',
        showPassword1: false,
        showPassword2: false,
        usernameErrorMessage: '',
        emailErrorMessage: '',
        password1ErrorMessage: '',
        password2ErrorMessage: '',
        openSnackbarAlertMessage: false,
        SnackbarAlertMessage: '',
        alertType: '',
    });

    const handleChangeTextForms = (prop: keyof RegisterAdminAppsState) =>
        (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickShowPassword1 = () => {
        setValues({...values, showPassword1: !values.showPassword1});
    };

    const handleClickShowPassword2 = () => {
        setValues({...values, showPassword2: !values.showPassword2});
    };

    // close alert message
    const handleCloseSnackbarAlertMessage = () => {
        setValues({...values, openSnackbarAlertMessage: false});
    };

    // register btn click
    const handleClickRegister = () => {
        const emailReg = /^([a-zA-Z]|[0-9])(\w|)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
        // if values is null ...
        if (
            values.username === ''
            || values.email === ''
            || values.password1 === ''
            || values.password2 === ''
        ) {
            return setValues({
                ...values,
                usernameErrorMessage: values.username === '' ? '用户名不能为空' : '',
                emailErrorMessage: values.email === '' ? '邮箱不能为空' : '',
                password1ErrorMessage: values.password1 === '' ? '密码不能为空' : '',
                password2ErrorMessage: values.password2 === '' ? '密码不能为空' : '',
                openSnackbarAlertMessage: true,
                SnackbarAlertMessage: '注册信息有误！请修改后重新提交！',
                alertType: 'error',
            });
        }
        // email address format error
        if (!emailReg.test(values.email)) {
            return setValues({
                ...values,
                usernameErrorMessage: '',
                emailErrorMessage: '邮箱格式错误',
                password1ErrorMessage: '',
                password2ErrorMessage: '',
                openSnackbarAlertMessage: true,
                SnackbarAlertMessage: '邮箱格式错误',
                alertType: 'error',
            });
        }
        // password1 !== password2
        if (values.password1 !== values.password2) {
            return setValues({
                ...values,
                usernameErrorMessage: '',
                emailErrorMessage: '',
                password1ErrorMessage: '',
                password2ErrorMessage: '密码不一致',
                openSnackbarAlertMessage: true,
                SnackbarAlertMessage: '密码不一致',
                alertType: 'error',
            });
        }
        // success
        return setValues({
            ...values,
            usernameErrorMessage: '',
            emailErrorMessage: '',
            password1ErrorMessage: '',
            password2ErrorMessage: '',
            openSnackbarAlertMessage: true,
            SnackbarAlertMessage: '注册成功',
            alertType: 'success',
        });
    };

    // key board event listener
    useEffect(() => {
        if (enterPressed) {
            handleClickRegister();
        }
    });

    return (
        <form className={classes.registerForm} noValidate autoComplete="off">
            {/*username*/}
            <TextFormsErrorVerification
                label={"用户名"}
                value={values.username}
                handleChangeText={handleChangeTextForms('username')}
                isError={values.usernameErrorMessage!==''}
                helperText={values.usernameErrorMessage}
            />

            {/*email*/}
            <TextFormsErrorVerification
                label={"邮箱"}
                value={values.email}
                handleChangeText={handleChangeTextForms('email')}
                isError={values.emailErrorMessage!==''}
                helperText={values.emailErrorMessage}
            />

            {/* password 1 */}
            <PasswordFormsErrorVerification
                label={"密码"}
                value={values.password1}
                showPassword={values.showPassword1}
                handleChangePassword={handleChangeTextForms('password1')}
                handleClickShowPassword={handleClickShowPassword1}
                isError={values.password1ErrorMessage!==''}
                helperText={values.password1ErrorMessage}
            />

            {/* password 2 */}
            <PasswordFormsErrorVerification
                label={"确认密码"}
                value={values.password2}
                showPassword={values.showPassword2}
                handleChangePassword={handleChangeTextForms('password2')}
                handleClickShowPassword={handleClickShowPassword2}
                isError={values.password2ErrorMessage!==''}
                helperText={values.password2ErrorMessage}
            />

            {/* Register Error Msg */}
            <SnackbarAlertMessage
                isOpen={values.openSnackbarAlertMessage}
                text={values.SnackbarAlertMessage}
                type={values.alertType}
                closeAlert={handleCloseSnackbarAlertMessage}
            />

            {/* register button */}
            <Button
                variant="contained" color="primary" className={classes.registerBtn}
                onClick={handleClickRegister}
            >
                注册账号
                <ExitToAppIcon fontSize="small" className={classes.registerBtnIcon}/>
            </Button>
        </form>
    );
};