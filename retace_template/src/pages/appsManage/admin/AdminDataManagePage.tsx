import React, { useState, useEffect } from 'react';
// import Customize Components
import { DataTable, AlertBox, DialogBox } from '../../../components/common';
// import Code Highlight Plugin
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coyWithoutShadows, okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';
// Mock Data
import { xmlDocumentList, xml } from '../../../settings/projectMockData';
// import Redux
import { useSelector } from '../../../redux/hooks';
// import MD style
import { makeStyles, createStyles } from '@material-ui/core/styles';
// import MD components
import { Grid, Paper, Button, Typography } from '@material-ui/core';


const useStyle = makeStyles(() => createStyles({
    pageTitle: {
        margin: '10px 0'
    },
    xmlGrid: {
        height: 500,
        overflow: 'auto',
        '&::-webkit-scrollbar': {
            width: 5,
            backgroundColor: '#ffffff',
        },
        '&::-webkit-scrollbar-thumb': {
            background: '#dcdcdcb8',
            borderRadius: '2px',
        },
    },
    infoGrid: {
        '&>*': {
            marginTop: 5,
            marginBottom: 20
        }
    },
    alertMsgBox: {
        padding: '5px 20px 15px 20px'
    },
}));

export const AdminDataManagePage = () => {
    // style hook
    const classes = useStyle();
    // redux: theme
    const currentTheme = useSelector(state => state.theme.currentMode);
    // heigh lighter style state
    const [highLighterStyle, setHighLighterStyle] = useState(
        currentTheme === 'light' ? coyWithoutShadows : okaidia
    );
    // dialog open state
    const [open, setOpen] = React.useState(false);

    // Listen Whether Theme Mode would change
    useEffect(() => {
        setHighLighterStyle(
            currentTheme === 'light' ? coyWithoutShadows : okaidia
        );
    }, [currentTheme]);

    // open Dialog
    const handleOpenAuditDialog = () => {
        setOpen(true);
    };

    // close Dialog
    const handleClose = () => {
        setOpen(false);
    };

    // Dialog Content
    const DialogContentComponent = () => {
        return (
            <Grid container spacing={2}>
                <Grid item md={8}>
                    <SyntaxHighlighter
                        language="xml"
                        style={highLighterStyle}
                        showLineNumbers={true}
                        className={classes.xmlGrid}
                    >{xml}</SyntaxHighlighter>
                </Grid>
                <Grid item md={4} className={classes.infoGrid}>
                    <AlertBox
                        title={"错误 Error"}
                        text={<>应用工具所上传的XML数据存在错误<br /><strong>请仔细核对错误信息！</strong></>}
                        type="error"
                    />
                    <Paper elevation={2} className={classes.alertMsgBox}>
                        <h3>修改提示: </h3>
                        关于教师教学目标板书行为的标注缺少四个维度，请按照“教师板书行为采集标准规范文档”的具体要求，对数据采集功能进行更新、修改或重设计，已满足规范文档的具体需求！
                    </Paper>
                    {/* <AlertBox
                        title={"正确 Success"}
                        text={<>应用工具所上传的XML数据格式正确！</>}
                        type="success"
                    /> */}
                </Grid>
            </Grid>
        );
    };

    return (
        <div style={{padding: 16}}>
            <Typography className={classes.pageTitle} variant="h5">数据采集管理</Typography>
            <DataTable
                header={["数据文档名称", "应用工具", "工具类型", "数据上传时间", "操作"]}
                data={xmlDocumentList}
                actionName={['查看']}
                action={[handleOpenAuditDialog]}
            />
            {/* XML Document & Info Msg Dialog */}
            <DialogBox
                boxSize={'md'}
                openDialog={open}
                handleCloseDialog={handleClose}
                title={'XML数据及其规范审核结果'}
                content={<DialogContentComponent />}
                action={
                    <Button onClick={handleClose} color="primary" autoFocus>
                        确认
                    </Button>
                }
            />
        </div>
    );
};