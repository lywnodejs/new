import React from "react";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  CardHeader,
  Button,
} from "@material-ui/core";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    header: {
      borderBottom: "1px solid #ccc",
      paddingBottom: 5,
      fontSize: 16,
      fontWeight: 'bold',
    },
    classItem: {
      width: '100%',
      paddingBottom: 5
    },
    content: {
      padding: '0 16px',
    }
  })
);
interface ClassifyCardProps {
  caption: string;
  description: string;
  itemList: string[];
}

export const ClassifyCard: React.FC<ClassifyCardProps> = ({
  caption,
  description,
  itemList,
}) => {
  const classes = useStyle();

  const handleCheck = () => {
    
  }

  const hanldeDelete = () => {

  }

  return (
    <Card className={classes.root}>
      <CardContent>
        <div className={classes.header}>{caption}</div>
      </CardContent>
      <div className={classes.content}>
        {itemList.map((el, idx) => {
          return <div className={classes.classItem}>{el}</div>;
        })}
      </div>
      <CardActions>
        <Button size="small" color="primary" onClick={handleCheck}>
          查看
        </Button>
        <Button size="small" color="primary" onClick={hanldeDelete}>
          删除
        </Button>
      </CardActions>
    </Card>
  );
};
