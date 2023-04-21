import React, { useState, useEffect } from 'react';
// import MD Style & Components
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

// import customize components
import { 
    DataTable,
    DataGrid, 
    IntroduceBox, 
    ReactKonva,
    Ripple,
} from '../../../components/common';
// import MD Icon
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
// import mock data
import { infoApps, thirdPartyAppTable ,appFunctions, functionDetail, defaultField2Name, defaultColsProps } from '../../../settings/projectMockData';

const MAX_IMAGE_HEIGHT = 600

const useStyles = makeStyles((theme: Theme) => createStyles({
    root:{
        padding: theme.spacing(2),
        height: '100%',
    },
    titleText: {
        margin: '10px 0'
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    canvasContainer: {
        backgroundColor: 'red',
        height: '100%',
        width: '100%',
    },
    sidebar: {
        width: '30%',
        // backgroundColor: '#F5F7FA',
    },
    functionInfo: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    functionDetail: {
        width: '100%',
        height: 'calc(100vh - 196px)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginRight: 20,
        overflowY: 'scroll',
    },
    functionCard: {
        position: 'relative',
        margin: '10px 20px',
    },
    functionHover:{
        position: 'absolute',
        border: '2px dashed #ffc570',
        borderRadius: 5,
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
            borderColor: '#4b9fea',
        },
    },
    appImage: {
        maxHeight: MAX_IMAGE_HEIGHT
    },
    description: {
      fontSize: 16,
    }
}));

export const AdminInfoManagePage:React.FC = () => {
    const classes = useStyles();
    const [openApp, setOpenApp] = useState(false);
    const [openFunction, setOpenFunction] = useState(false);
    const [appInfo, setAppInfo] = useState({});
    const [funcItem, setFuncItem] = useState({})


    const handleRowDoubleClick= (params, event) => {
        console.log(params, event);
        setOpenApp(true);
        setAppInfo(params.row)
    }

    const FunctionDetailComponent = ({ functionDetail, onChangeInfo }) => {
        const [scale, setScale] = useState(1);
        return (
            <div className={classes.functionDetail}>
                {
                    functionDetail.map((el, idx) => {

                        return (
                            <Card className={classes.functionCard}>
                                <CardContent>
                                    <div 
                                        className={classes.functionHover} 
                                        style={{ 
                                            left:el.rect[0] *scale + 16, 
                                            top:el.rect[1]*scale + 16,
                                            width: el.rect[2]*scale, 
                                            height: el.rect[3]*scale, 
                                        }} 
                                        onMouseEnter = {e=>onChangeInfo(el.title, el.description)}
                                        onMouseOut = {e=>onChangeInfo('', '')}
                                    >
                                        <Ripple style={{top: el.rect[3]*scale/2}}/>
                                    </div>
                                    <img 
                                        src={el.image} 
                                        alt={el.title} 
                                        className={classes.appImage}
                                        onLoad={event => {
                                            let target = event.target as any;
                                            console.log(scale, target.naturalHeight)
                                            setScale(MAX_IMAGE_HEIGHT / target.naturalHeight)
                                        }}
                                    />]
                                </CardContent>
                            </Card>
                        )
                    })
                }
            </div>
        )
    }
        
    const AppsInfoPage = (props) => {
        const { tool, company } = props;
        const [title, setTitle] = useState('');
        const [description, setDescription] = useState('');
    

        const handleOpenDetailPage = (item) => {
            setOpenFunction(true)
            setFuncItem(item)
        }

        const handleExit = (isFunctionPage) => {
            if(isFunctionPage){
                setOpenFunction(false)
                setOpenApp(true)
            }else{
                setOpenApp(false)
            }
        }

        const handleChangeInfo = (title, description) => {
            setTitle(title)
            setDescription(description)
        }
        
        return (
            <>
                <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Typography className={classes.titleText} variant="h5">{company} - {tool}{openFunction && ' - ' + funcItem['title']}</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        endIcon={<ExitToAppIcon />}
                        onClick={e=>handleExit(openFunction === true)}
                    >
                        {
                            openFunction === true ? '返回功能列表' : '返回应用列表'
                        }
                    </Button>
                </Grid>
                
               {
                    openFunction ? (
                        // <Card>
                        //     <CardContent>
                        //         <ReactKonva  funcs={functionDetail}/>
                        //     </CardContent>
                        // </Card>
                        <div className={classes.functionInfo}>
                            <FunctionDetailComponent functionDetail={functionDetail} onChangeInfo={handleChangeInfo}/>
                            <div className={classes.sidebar}>
                                <h2>{title}</h2>
                                <div className={classes.description}>
                                    {description}
                                </div>
                            </div>
                        </div>
                    ):(
                        <Grid container spacing={2}>
                        {
                            appFunctions.map((item, idx) => (
                                <Grid item md={3} key={idx}>
                                    <IntroduceBox
                                        img={item['img']}
                                        title={item['title']}
                                        introduce={item['introduce']}
                                        actionName={item['actionName']}
                                        action={()=>handleOpenDetailPage(item)}
                                    />
                                </Grid>
                            ))
                        }
                        </Grid>
                    )
               }
            </>
        )

    }




    return (
        <div className={classes.root}>
            {
                openApp ? (
                    <AppsInfoPage {...appInfo}/>
                ) : (
                    <>
                        <Typography className={classes.titleText} variant="h5">应用信息列表</Typography>
                        {/* <DataTable
                            header={["已对接应用", "厂商名称", "应用类型", "应用对象"]}
                            data={infoApps}
                        /> */}
                        <DataGrid
                            initialData={thirdPartyAppTable}
                            handleRowDoubleClick={handleRowDoubleClick}
                            colsProps={defaultColsProps}
                            canEdit
                        />
                    </>
                )
            }
            
        </div>
    );
}

