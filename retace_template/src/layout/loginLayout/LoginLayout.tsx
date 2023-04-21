import React from 'react';
// import style
import style from './LoginLayout.module.css';
// impogrt MD component
import Grid from '@material-ui/core/Grid';

export const LoginLayout = ({children}) => {

    return (
        <Grid container>
            <div className={style["login-form"]}>
                {children}
            </div>
            {/* 登录图片 */}
            <div className={style["login-img"]}></div>
        </Grid>
    );
};