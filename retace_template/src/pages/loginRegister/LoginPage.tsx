import React, {useEffect} from 'react';
// import Layout
import {LoginLayout} from '../../layout';
// import style
import Logo from '../../assets/image/logo.png';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
// impogrt MD component & icons
import {Button, Checkbox, FormControlLabel, FormGroup, Grid, Paper,} from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
// import customize component
import {
    SnackbarAlertMessage,
    PasswordFormsErrorVerification,
    SelectFormsErrorVerification,
    TextFormsErrorVerification,
} from '../../components/common';
// import Router
import {useHistory} from 'react-router-dom';
// import customize hook
import {useKeyPress} from '../../hooks';
// import Redux
import { useDispatch } from 'react-redux';
import { useSelector } from '../../redux/hooks';
// import Login Redux Action
import { signIn } from '../../redux/userLogin/slice';

const useStyle = makeStyles((theme: Theme) => createStyles({
    loginLogo: {
        marginTop: theme.spacing(8),
        marginBottom: 25,
        justifyContent: 'center',
        marginLeft: -10,
    },
    loginLogoImg: {
        width: 50,
        marginRight: 20,
    },
    loginLogoTitle: {
        fontSize: 20,
        color: '#23ace6',
        fontWeight: 'bold',
    },
    loginLogoSubTitle: {
        fontSize: 12,
        color: '#a9a9a9',
        paddingTop: 2,
        letterSpacing: '5px',
    },
    loginForm: {
        justifyContent: 'center',
        marginRight: 45,
        marginLeft: 35,

        '& > *': {
            margin: theme.spacing(1),
            width: '100%',
        },
    },
    margin: {
        margin: theme.spacing(1),
    },
    withoutLabel: {
        marginTop: theme.spacing(3),
    },
    textField: {
        width: '100%',
    },
    forgetIcon: {
        fontSize: 20,
        marginBottom: -4,
        color: '#777777',
    },
    loginRegister: {
        backgroundColor: '#f1f1f1',
        color: '#808080',
        paddingTop: 22,
        paddingBottom: 10,
        marginTop: 25,
        textAlign: 'center',
    },
    loginBtn: {
        marginTop: 15,
    },
    loginBtnIcon: {
        marginLeft: 10
    },
    registerBtn: {
        marginTop: 5
    },
}));

interface LoginState {
    role: string;
    userID: string;
    password: string;
    rememberMe: boolean;
    showPassword: boolean;
    roleErrorMessage: string;
    userIDErrorMessage: string;
    passwordErrorMessage: string;
    openSnackbarAlertMessage: boolean;
    SnackbarAlertMessage: string;
    alertType: string;
};

export const LoginPage: React.FC = () => {
    // router
    const history = useHistory();
    // MD style
    const classes = useStyle();
    // key press hook
    const enterPressed = useKeyPress(13);   // enter
    // redux dispatch hook
    const dispatch = useDispatch();
    // selector store state hook
    const jwt = useSelector(state => state.user.token);
    // forms values control
    const [values, setValues] = React.useState<LoginState>({
        role: '',
        userID: '',
        password: '',
        rememberMe: false,
        showPassword: false,
        roleErrorMessage: '',
        userIDErrorMessage: '',
        passwordErrorMessage: '',
        openSnackbarAlertMessage: false,
        SnackbarAlertMessage: '',
        alertType: '',
    });

    // role select change
    const handleChangeSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
        setValues({
            ...values,
            role: event.target.value as string
        });
    };

    // userID value change
    const handleChangeuserID = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({...values, userID: event.target.value});
    }

    // password value change
    const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({...values, password: event.target.value});
    }

    // rememberMe checked change
    const handleCheckRememberMe = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({...values, rememberMe: event.target.checked});
    };

    // show password click
    const handleClickShowPassword = () => {
        setValues({...values, showPassword: !values.showPassword});
    };

    // close alert message
    const handleCloseSnackbarAlertMessage = () => {
        setValues({...values, openSnackbarAlertMessage: false});
    };

    // login btn click: login check info check out
    const handleClickLogin = () => {
        if (values.userID === "" || values.password === "" || values.role === "") {
            return setValues({
                ...values,
                openSnackbarAlertMessage: true,
                roleErrorMessage: values.role === '' ? '角色不能为空' : '',
                userIDErrorMessage: values.userID==='' ? '信息不能为空' : '',
                passwordErrorMessage: values.password==='' ? '密码不能为空': '',
                SnackbarAlertMessage: '信息错误！请重新填写！',
                alertType: 'warning',
            });
        }
        // send login action to redux-reducer
        dispatch(signIn({
            role: values.role,
            idCard: values.userID,
            password: values.password
        }));
        setValues({
            ...values,
            openSnackbarAlertMessage: true,
            roleErrorMessage: '',
            passwordErrorMessage: '',
            userIDErrorMessage: '',
            SnackbarAlertMessage:  jwt ? '登录成功!': '登录失败!',
            alertType: jwt ? 'success' : 'error',
        });
    };

    useEffect(()=>{
        // jwt change & had content => means this user aleary login => go to home page
        if(jwt){
            history.push('/');
        }
    },[jwt]);

    // key board press event
    useEffect(() => {
        if (enterPressed) {
            handleClickLogin();
        }
    },[enterPressed]);

    return (
        <LoginLayout>
            {/*Logo*/}
            <Grid container className={classes.loginLogo}>
                <div>
                    <img src={Logo} alt="Logo" className={classes.loginLogoImg}/>
                </div>
                <div>
                    <div className={classes.loginLogoTitle}>
                        教学数据治理平台 | 登录
                    </div>
                    <div className={classes.loginLogoSubTitle}>
                        欢迎您使用教学数据治理平台
                    </div>
                </div>
            </Grid>

            {/*Form*/}
            <div>
                <form className={classes.loginForm} noValidate autoComplete="off">
                    {/* role select */}
                    <SelectFormsErrorVerification
                        label={"用户角色"}
                        value={values.role}
                        items={['系统管理员', '教研员', '第三方应用厂商', '区域管理者', '学校管理者', '教师', '学生']}
                        handleChangeSelect={handleChangeSelect}
                        isError={values.roleErrorMessage !== ''}
                        helperText={values.roleErrorMessage}
                    />

                    {
                        values.role === '系统管理员' || values.role === '第三方应用厂商' ? (
                            // email
                            <TextFormsErrorVerification
                                label={"Email"}
                                value={values.userID}
                                handleChangeText={handleChangeuserID}
                                isError={values.userIDErrorMessage !== ''}
                                helperText={values.userIDErrorMessage}
                            />
                        ) : (
                            // id
                            <TextFormsErrorVerification
                                label={"证件号(身份证/师训号/学生证)"}
                                value={values.userID}
                                handleChangeText={handleChangeuserID}
                                isError={values.userIDErrorMessage!==''}
                                helperText={values.userIDErrorMessage}
                            />
                        )
                    }

                    {/* password */}
                    <PasswordFormsErrorVerification
                        label={"密码"}
                        value={values.password}
                        showPassword={values.showPassword}
                        handleChangePassword={handleChangePassword}
                        handleClickShowPassword={handleClickShowPassword}
                        isError={values.passwordErrorMessage !== ''}
                        helperText={values.passwordErrorMessage}
                    />

                    {/* remember me & forget password */}
                    <Grid container direction="row" justifyContent="space-between" alignItems="center">
                        {/* remember me */}
                        <Grid item>
                            <FormGroup row>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={values.rememberMe}
                                            onChange={handleCheckRememberMe}
                                            name="rememberMe"
                                            color="primary"
                                        />}
                                    label="记住我"
                                />
                            </FormGroup>
                        </Grid>
                        {/* forget password */}
                        <Grid item>
                            <LockIcon className={classes.forgetIcon}/>
                            <span> 忘记密码</span>
                        </Grid>
                    </Grid>

                    <Button
                        variant="contained" color="primary" className={classes.loginBtn}
                        onClick={handleClickLogin}
                    >
                        登录 <ExitToAppIcon fontSize="small" className={classes.loginBtnIcon}/>
                    </Button>

                    {/* register enter */}
                    <Paper elevation={0} className={classes.loginRegister}>
                        还未拥有账号？立刻注册新账号！
                        <br/>
                        <Button
                            color="primary" className={classes.registerBtn}
                            onClick={() => {
                                history.push('/register');
                            }}
                        >
                            注册账号
                        </Button>
                    </Paper>

                    {/* Login Error Msg */}
                    <SnackbarAlertMessage
                        isOpen={values.openSnackbarAlertMessage}
                        text={values.SnackbarAlertMessage}
                        type={values.alertType}
                        closeAlert={handleCloseSnackbarAlertMessage}
                    />
                </form>
            </div>
        </LoginLayout>
    );
};