import React, { useState, useEffect } from 'react';
import { Typography } from '@material-ui/core';
// improt Router
import { useHistory } from 'react-router-dom';
// import Redux
import { useSelector } from '../redux/hooks';
// import jwt decode
import jwt_decode, { JwtPayload as DefaultJwtPayload } from "jwt-decode";
// import MD style
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyle = makeStyles((theme: Theme) => createStyles({
    home: {
        height: 'calc(100vh - 182px)',
        textAlign: 'center',
        lineHeight: 'calc(100vh - 182px)',
        color: '#a5a5a5',
        userSelect: 'none',
    }
}));

// 自定义jwt的类型
interface JwtPayload extends DefaultJwtPayload {
    sub: string
}

export const HomePage = () => {
    const classes = useStyle();
    const jwt = useSelector(state => state.user.token);
    const role = useSelector(state => state.user.userRole);
    // const history = useHistory();
    // const [userName, setUserName] = useState('系统管理员');

    const [userName, setUserName] = useState(useSelector(state => state.user.userName));
    // console.log('userName',useSelector(state => state.user))
    

    useEffect(()=>{
        if(jwt){
            // const token = jwt_decode<JwtPayload>(jwt);
            
            // setUserName(token.sub);
        }else{
            // alert('尚未登录！请立即登录！');
            // history.push('/login');
        }
    }, [jwt]);

    return (
        <>
            <Typography variant='h4' className={classes.home}>
                {userName}您好！欢迎使用教育数据治理平台
            </Typography>
        </>
    );
};