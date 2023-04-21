import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',  
        },
        stepContainer: {
            position: 'fixed',
            bottom: 0,
            display: 'flex',
            justifyContent: 'space-between',
            width: 'calc(100vw - 56px)',
            padding: '0 10px',
            backgroundColor: '#e4e9f2',
            alignItems: 'center',
        },
        stepper: {
            width: '80%',
        },
        button: {
            width: 70,
            fontSize: 12
        },
        instructions: {
            // marginTop: theme.spacing(1),
            // marginBottom: theme.spacing(1),
        },
        finishText: {
            marginTop: theme.spacing(4),
            marginBottom: theme.spacing(4),
            textAlign: 'center',
            fontSize: 24,
        }
    }),
);

interface StepperBoxState {
    stepsTitle: string[];
    stepsContent: any[];
    finishMsg: string;
    handleFinish: ()=>void;
};

export const StepperBox:React.FC<StepperBoxState> = ({
    stepsTitle, stepsContent, finishMsg, handleFinish
}) => {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    const steps = stepsTitle;
    
    // 步骤标题
    // function getSteps() {
    //     return ['特征工程处理流程设计', '输出结果与图谱关联建立', '输出特征变量表'];
    // }

    // 步骤内容
    // function getStepContent(step: number) {
    //     switch (step) {
    //         case 0:
    //             return '特征工程处理流程设计';
    //         case 1:
    //             return '输出结果与图谱的关联建立';
    //         case 2:
    //             return '输出特征变量表';
    //         default:
    //             return '未知步骤！请重新刷新页面！';
    //     }
    // }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      };

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <div className={classes.root}>
            <div>
                {activeStep === steps.length ? (
                    <div>
                        <Typography className={classes.finishText}>
                            {finishMsg}
                        </Typography>
                        {/* <Button onClick={handleFinish} className={classes.button} color="primary" variant="contained">
                            确定
                        </Button> */}
                    </div>
                ) : (
                    <div>
                        <Typography className={classes.instructions}>{stepsContent[activeStep]}</Typography>
                        {/* <div>
                            <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                                上一步
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleNext}
                                className={classes.button}
                            >
                                {activeStep === steps.length - 1 ? '完成' : '下一步'}
                            </Button>
                        </div> */}
                    </div>
                )}
            </div>
            
            <div className={classes.stepContainer}>
                <Button variant="contained" color="primary" disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                    上一步
                </Button>
                <Stepper activeStep={activeStep} className={classes.stepper} style={{background: 'none', padding: 14,}}>
                    
                    {steps.map((label, index) => {
                        const stepProps: { completed?: boolean } = {};
                        return (
                            <Step key={label} {...stepProps}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.button}
                >
                    {activeStep === steps.length - 1 ? '完成' : '下一步'}
                </Button>
            </div>
        </div>
    );
}
