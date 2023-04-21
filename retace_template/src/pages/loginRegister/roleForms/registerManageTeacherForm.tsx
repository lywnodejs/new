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

// Manage & Teacher State
interface RegisterManageTeacherState {
    username: string;
    idCard: string;
    password1: string;
    password2: string;
    showPassword1: boolean;
    showPassword2: boolean;
    usernameErrorMessage: string;
    idCardErrorMessage: string;
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

export const RegisterManageTeacherForm:React.FC<PropsState> = ({role}) => {
    const classes = useStyle();
    const enterPressed = useKeyPress(13);
    const [values, setValues] = useState<RegisterManageTeacherState>({
        username: '',
        idCard: '',
        password1: '',
        password2: '',
        showPassword1: false,
        showPassword2: false,
        usernameErrorMessage: '',
        idCardErrorMessage: '',
        password1ErrorMessage: '',
        password2ErrorMessage: '',
        openSnackbarAlertMessage: false,
        SnackbarAlertMessage: '',
        alertType: '',
    });

    const handleChangeTextForms = (prop: keyof RegisterManageTeacherState) =>
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
        // if values is null ...
        if (
            values.username === ''
            || values.idCard === ''
            || values.password1 === ''
            || values.password2 === ''
        ) {
            return setValues({
                ...values,
                usernameErrorMessage: values.username === '' ? '用户名不能为空' : '',
                idCardErrorMessage: values.idCard === '' ? '身份证/师训证不能为空' : '',
                password1ErrorMessage: values.password1 === '' ? '密码不能为空' : '',
                password2ErrorMessage: values.password2 === '' ? '密码不能为空' : '',
                openSnackbarAlertMessage: true,
                SnackbarAlertMessage: '注册信息有误！请修改后重新提交！',
                alertType: 'error',
            });
        }
        // password1 !== password2
        if (values.password1 !== values.password2) {
            return setValues({
                ...values,
                usernameErrorMessage: '',
                idCardErrorMessage: '',
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
            idCardErrorMessage: '',
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

            {/*idCard*/}
            <TextFormsErrorVerification
                label={"身份证/师训证"}
                value={values.idCard}
                handleChangeText={handleChangeTextForms('idCard')}
                isError={values.idCardErrorMessage!==''}
                helperText={values.idCardErrorMessage}
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