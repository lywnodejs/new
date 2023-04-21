import React from 'react';
// import layout
import {LoginLayout} from '../../layout';
// import style
import Logo from '../../assets/image/logo.png';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
// impogrt MD component
import {Button, Grid, Paper,} from '@material-ui/core';
// import customize component
import {SelectFormsErrorVerification,} from '../../components/common';
import {RegisterAdminAppsForms} from './roleForms/registerAdminAppsForms';
import {RegisterManageTeacherForm} from './roleForms/registerManageTeacherForm';
import {RegisterStudentForm} from './roleForms/registerStudentForm';
// import Router
import {useHistory} from 'react-router-dom';

const useStyle = makeStyles((theme: Theme) => createStyles({
    registerLogo: {
        marginTop: theme.spacing(2),
        justifyContent: 'center',
        marginLeft: -10,
    },
    registerLogoImg: {
        width: 50,
        marginRight: 20,
    },
    registerLogoTitle: {
        fontSize: 20,
        color: '#23ace6',
        fontWeight: 'bold',
    },
    registerLogoSubTitle: {
        fontSize: 12,
        color: '#a9a9a9',
        paddingTop: 2,
        letterSpacing: '5px',
    },
    registerForm: {
        justifyContent: 'center',
        marginRight: 45,
        marginLeft: 35,
        marginTop: 20,
        '& > *': {
            margin: '4px 8px',
            width: '100%',
        },
    },
    loginRegister: {
        backgroundColor: '#f1f1f1',
        color: '#808080',
        paddingTop: 22,
        paddingBottom: 10,
        marginTop: 25,
        marginRight: 40,
        marginLeft: 40,
        textAlign: 'center',
    },
    loginBtn: {
        marginTop: 5
    },
    roleSelectMessage: {
        marginBottom: 10,
        fontWeight: 'bold',
    },
}));


interface RegisterState {
    role: string;
};

export const RegisterPage: React.FC = () => {
    // router
    const history = useHistory();
    // MD style
    const classes = useStyle();
    // forms value control
    const [values, setValues] = React.useState<RegisterState>({
        role: ''
    });

    // role select change
    const handleChangeSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
        setValues({
            ...values,
            role: event.target.value as string
        });
    };


    return (
        <LoginLayout>
            {/*Logo*/}
            <Grid container className={classes.registerLogo}>
                <div>
                    <img src={Logo} alt="Logo" className={classes.registerLogoImg}/>
                </div>
                <div>
                    <div className={classes.registerLogoTitle}>
                        教学数据治理平台 | 注册
                    </div>
                    <div className={classes.registerLogoSubTitle}>
                        欢迎您使用教学数据治理平台
                    </div>
                </div>
            </Grid>
            {/*Form*/}
            <div>
                {/* role select */}
                <form className={classes.registerForm} noValidate autoComplete="off">
                    <SelectFormsErrorVerification
                        label={"用户角色"}
                        value={values.role}
                        items={['系统管理员', '第三方应用厂商', '区域管理者', '学校管理者', '教师', '学生']}
                        handleChangeSelect={handleChangeSelect}
                    />
                </form>

                {/* register forms based on different role */}
                {
                    (values.role === '系统管理员' || values.role === '第三方应用厂商') &&
                    <RegisterAdminAppsForms role={values.role} />
                }
                {
                    (values.role === '区域管理者' || values.role === '学校管理者' || values.role === '教师') &&
                    <RegisterManageTeacherForm role={values.role}/>
                }
                {
                    values.role === '学生' && <RegisterStudentForm role={values.role}/>
                }

                <Paper elevation={0} className={classes.loginRegister}>
                    {
                        values.role === '' ? (
                            <div className={classes.roleSelectMessage}>请先选择注册的用户角色</div>
                        ) : (
                            <div>
                                已经拥有账号？立刻登录并使用！
                                <br/>
                                <Button
                                    color="primary" className={classes.loginBtn}
                                    onClick={() => {
                                        history.push('/login');
                                    }}
                                >
                                    用户登录
                                </Button>
                            </div>
                        )
                    }
                </Paper>
            </div>
        </LoginLayout>
    );
};