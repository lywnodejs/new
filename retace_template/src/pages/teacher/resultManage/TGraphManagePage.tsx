/**
 * ! 量化模型分析使用
 */
 import React, { useState, useEffect } from 'react';
 // import customize components
 import {
     IntroduceBox, DragFlow, DialogBox,
     TextFormsErrorVerification, DataTable,
     StepperBox, SelectFormsErrorVerification, TransferListBox,
     DragDrop
 } from '../../../components/common';
 // import MD style & components & Icons
 import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
 import Typography from '@material-ui/core/Typography';
 import Grid from '@material-ui/core/Grid';
 import ExitToAppIcon from '@material-ui/icons/ExitToApp';
 import ReactECharts from 'echarts-for-react';
 
 // import Mock Data
 import {
     MockEducationModelsList,
     MockEducationModelsResult,
     MockEducationModelsResultLevel1,
     MockEducationModelsResultLevel2,
     MockEducationModelsResultLevel3,
     MockEducationModelsResultLevel4,
     MockEducationModelsResultLevel5,
 } from '../../../settings/projectMockData';
 import newTableImg from '../../../assets/image/models/newTable.png';
 import Button from '@material-ui/core/Button';
 import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
 import educationalModel3 from '../../../assets/image/models/ModelExample3.jpg';
 import { useHistory,useLocation } from 'react-router-dom';
 import { useSelector } from '../../../redux/hooks';
 
 
 
 const useStyles = makeStyles((theme: Theme) => createStyles({
     pageTitle: {
         margin: '20px 0 10px 0'
     },
     textForm: {
         justifyContent: 'center',
         marginRight: 20,
         // marginLeft: 35,
         '& > *': {
             margin: '8px 8px',
             width: '100%',
             minWidth: 100
         },
     },
 }));
 
 // 已使用的模型列表
 interface DecisionSupportListState {
     handleOpenDetailPage: () => void;
     handleOpenProcessPage: () => void;
 };
 interface NewDecisionSupportState {
     title: string;
     describe: string;
 };
 const ModelList: React.FC<DecisionSupportListState> = ({
     handleOpenDetailPage, handleOpenProcessPage
 }) => {
     const classes = useStyles();
     const [modelUseList, setModelUseList] = useState(MockEducationModelsList);
     const [openDialog, setOpenDialog] = useState(false);
     const role = useSelector(state => state.user.userRole);
     const userRouter = useSelector(state => state.openPage.projectUserAuthorization).find(el => el.role === (role || '系统管理员')).router;
 
     // 打开新建决策支持服务对话框
     const handleOpenDialog = () => {
         setOpenDialog(true);
     };
 
     // 关闭新建决策支持服务对话框
     const handleCloseDialog = () => {
         setOpenDialog(false);
     };
 
     const handleAddModelUse = () => {
         // MockEducationModelsList.push({
         //     title: '美育数据分析',
         //     img: educationalModel3,
         //     introduce: '美育数据分析',
         //     actionName: '查看数据模型',
         //     actionKey: '美育数据分析',
         // });
         setModelUseList([
             ...modelUseList,
             {
                 title: '美育数据分析',
                 img: educationalModel3,
                 introduce: '美育数据分析',
                 actionName: '查看数据模型',
                 actionKey: '美育数据分析',
             }
         ]);
         handleCloseDialog();
     };
 
     const handleDelete = (title: string) => {
         let newModelUseList: any[] = [];
         modelUseList.map((model, index) => {
             if (model.title !== title) {
                 newModelUseList.push(model);
             }
         });
         setModelUseList(newModelUseList);
     }
 
     // dialog 内容
     const DialogContent: React.FC = () => {
         const classes = useStyles();
         const [values, setValues] = useState<NewDecisionSupportState>({
             title: '',
             describe: '',
         });
 
         // 改变text值
         const handleChangeText = (prop: keyof NewDecisionSupportState) =>
             (event: React.ChangeEvent<HTMLInputElement>) => {
                 setValues({ ...values, [prop]: event.target.value });
             };
 
         return (
             <form className={classes.textForm} noValidate autoComplete="off">
                 <FormControl>
                     <InputLabel id="demo-simple-select-label">选择所需分析的数据表</InputLabel>
                     <Select
                         labelId="demo-simple-select-label"
                         id="demo-simple-select"
                     >
                         <MenuItem value={10}>大同中学-101班-美术期末成绩数据表</MenuItem>
                         <MenuItem value={20}>大同中学-101班-美术平时成绩数据表</MenuItem>
                         <MenuItem value={30}>大同中学-101班-音乐期末成绩数据表</MenuItem>
                         <MenuItem value={40}>大同中学-101班-音乐平时成绩数据表</MenuItem>
                     </Select>
                 </FormControl>
                 <FormControl>
                     <InputLabel id="demo-simple-select-label">选择量化分析模型</InputLabel>
                     <Select
                         labelId="demo-simple-select-label"
                         id="demo-simple-select"
                     >
                         <MenuItem value={10}>学生德育分析模型</MenuItem>
                         <MenuItem value={20}>学生智育分析模型</MenuItem>
                         <MenuItem value={20}>学生体育分析模型</MenuItem>
                         <MenuItem value={20}>学生美育分析模型</MenuItem>
                         <MenuItem value={20}>学生劳育分析模型</MenuItem>
                         <MenuItem value={20}>学生核心素养分析模型</MenuItem>
                         <MenuItem value={20}>教师教案分析模型</MenuItem>
                         <MenuItem value={20}>教师听评课分析模型</MenuItem>
                         <MenuItem value={20}>教师专业发展分析模型</MenuItem>
 
                     </Select>
                 </FormControl>
             </form>
         );
     };
 
     return (
         <>
             <Typography className={classes.pageTitle} variant="h5">图表管理</Typography>
             <Grid container spacing={2}>
                 {/* 展示已有的特征变量表 */}
                 {
                     modelUseList.map((item) => (
                         <Grid item md={3} key={item['actionKey']}>
                             <IntroduceBox
                                 img={item['img']}
                                 title={item['title']}
                                 introduce={item['introduce']}
                                 actionName={'查看图表'}
                                 action={handleOpenDetailPage}
                                 handleDelete={handleDelete}
                                 deleteAction={'删除图表'}
                             />
                         </Grid>
                     ))
                 }
                 {/* Dialog: 打开新建变量表操作表单 */}
                 <DialogBox
                     boxSize={'sm'}
                     openDialog={openDialog}
                     handleCloseDialog={handleCloseDialog}
                     title={'新建模型分析'}
                     content={
                         <DialogContent />
                     }
                     action={
                         <>
                             <Button onClick={handleCloseDialog} color="secondary" autoFocus>
                                 取消
                             </Button>
                             <Button onClick={handleAddModelUse} color="primary" autoFocus>
                                 确认
                             </Button>
                         </>
                     }
                 />
             </Grid>
         </>
     );
 };
 
 // 模型详细内容页面
 interface DecisionSupportDetailState {
     handleReturn: () => void;
 };
 const DecisionSupportDetail: React.FC<DecisionSupportDetailState> = ({
     handleReturn
 }) => {
     const classes = useStyles();
     const [index, setIndex] = useState('');
     const [chart, setChart] = useState<any>(MockEducationModelsResult);
 
     const handleChangeIndex = (event: React.ChangeEvent<{ value: unknown }>) => {
         setIndex(event.target.value as string);
     };
 
     // 随着等级选择的变更而调整chart
     useEffect(() => {
         switch (index) {
             case '等级1':
                 setChart(MockEducationModelsResultLevel1)
                 break;
             case '等级2':
                 setChart(MockEducationModelsResultLevel2);
                 break;
             case '等级3':
                 setChart(MockEducationModelsResultLevel3);
                 break;
             case '等级4':
                 setChart(MockEducationModelsResultLevel4);
                 break;
             case '等级5':
                 setChart(MockEducationModelsResultLevel5);
                 break;
             default:
                 setChart(MockEducationModelsResult)
                 break;
         }
     }, [index]);
 
     return (
         <>
             {/* title & return button */}
             <Grid
                 container
                 direction="row"
                 justifyContent="space-between"
                 alignItems="center"
             >
                 <Typography className={classes.pageTitle} variant="h5">三年级语文学科教案数据分析图</Typography>
                 <Button
                     variant="contained"
                     color="primary"
                     endIcon={<ExitToAppIcon />}
                     onClick={handleReturn}
                     style={{ marginRight: 20 }}
                 >
                     返回首页
                 </Button>
             </Grid>
             <div>
                 <Grid
                     container
                     direction="row"
                     justifyContent="space-between"
                     alignItems="center"
                     style={{ marginBottom: 10 }}
                 >
                     <h2>模型分析结果</h2>
                     <SelectFormsErrorVerification
                         label={"选择参考系"}
                         items={[
                             "等级1",
                             "等级2",
                             "等级3",
                             "等级4",
                             "等级5",
                         ]}
                         value={index}
                         handleChangeSelect={handleChangeIndex}
                         width={'20%'}
                     />
                 </Grid>
                 <ReactECharts option={chart} style={{ height: '500px', width: '100%' }} />
                 <div style={{fontSize: '16px', padding: '10px', lineHeight: '30px'}}>
                     张三老师对教学目标的处理为等级一，对教学内容的处理为等级三，学习活动任务设计为等级五，学习活动方式设计为等级二，资源媒体使用为等级一，学习评价的设计为等级二。<br />
                     李四老师对教学目标的处理为等级五，对教学内容的处理为等级四，学习活动任务设计为等级四，学习活动方式设计为等级二，资源媒体使用为等级四，学习评价的设计为等级三。<br />
                     王五老师对教学目标的处理为等级二，对教学内容的处理为等级五，学习活动任务设计为等级五，学习活动方式设计为等级二，资源媒体使用为等级四，学习评价的设计为等级四。
                 </div>
             </div>
         </>
     );
 };
 

 export const TGraphManagePage: React.FC = () => {
     const history = useHistory();
     const location = useLocation() as any;
     //open page state
     const [openPage, setOpenPage] = useState({
         openDetailPage: false,
         openProcessPage: false
     });
 
     // 关闭所有页面, 返回主页
     const handleClosePage = () => {
         setOpenPage({
             ...openPage,
             openDetailPage: false,
             openProcessPage: false,
         });
     }
 
 
     // 打开内部页面
     const handleOpenPage = (target) => {
         handleClosePage();
         setOpenPage({
             ...openPage,
             [target]: true
         });
     };
 
     if (openPage.openDetailPage) {
         return (
             <div style={{ paddingLeft: 20 }}>
                 <DecisionSupportDetail
                     handleReturn={handleClosePage}
                 />
             </div>
         );
     }
     return (
         <div style={{ paddingLeft: 20 }}>
             <ModelList
                 handleOpenDetailPage={() => handleOpenPage('openDetailPage')}
                 handleOpenProcessPage={() => handleOpenPage('openProcessPage')}
             />
         </div>
     );
 };