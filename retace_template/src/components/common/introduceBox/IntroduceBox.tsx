/**
 * TODO: 为内容introduce添加超过字数的省略显示，可以控制最大字数
 */
import React from 'react';
import {
    Card,
    CardActionArea,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    Button
} from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

interface IntroduceBox {
    img: any;
    title: string;
    titleAlign?: 'start' | 'end' | 'left' | 'right' | 'center';
    introduce: string;
    actionName?: string;
    deleteAction?: string;
    handleDelete?: (title:string)=>void;
    action: () => void;
    autoHeight?: boolean;
};

export const IntroduceBox: React.FC<IntroduceBox> = ({
    img, title, titleAlign, introduce, actionName, action, deleteAction, handleDelete =()=>{}, autoHeight = false
}) => {
    const useStyle = makeStyles((theme: Theme) => createStyles({
        cardTitle: {
            textAlign: titleAlign,
        }
    }));
    const classes = useStyle();

    return (
        <Card style={{ height: autoHeight? '100%' : 'auto'}}>
            <CardActionArea onClick={action} >
                <CardMedia
                    style={{ height: 140 }}
                    image={img}
                    title="Contemplative Reptile"
                />
                <CardContent>
                    <Typography className={classes.cardTitle} gutterBottom variant="h6" component="h3">
                        {title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {introduce}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                {
                    actionName &&
                    <Button
                        size="small" color="primary"
                        onClick={action}
                    >
                        {actionName}
                    </Button>
                }
                {
                    deleteAction &&
                    <Button size="small" color="secondary" onClick={()=>handleDelete(title)}>
                        {deleteAction}
                    </Button>
                }
            </CardActions>
        </Card>
    );
};