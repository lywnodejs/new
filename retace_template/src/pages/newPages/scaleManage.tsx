import React, { useState } from "react";
// import customize components
import {
  TreeStructure,
  DialogBox,
  DataTable,
  menuProps,
  KnowledgeGraph,
  SelectFormsErrorVerification,
} from "../../components/common";
// import MD components & styles
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  CardActions,
  Button,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  Avatar,
  ButtonGroup,
} from "@material-ui/core";
// import mock data
import { scaleList } from "../../settings/projectMockData";
import pdf from "../../assets/teachingPlanScaleExample.pdf";
// import React-PDF
import { Document, Page } from "react-pdf/dist/umd/entry.webpack";
// import react-router
import { useHistory } from "react-router";
// import icon
import AddIcon from "@material-ui/icons/Add";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import GetAppIcon from "@material-ui/icons/GetApp";

const categoryList = [
  "电子讲稿制作评价量规",
  "网页制作评价量规",
  "教学视频评价量规",
  "动画制作评价量规",
  "教学评价设计量规",
  "团队协作评价量规",
  "教师互评评价法规",
  "网络课程评价量规",
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
    },
    titleText: {
      margin: "10px 0",
    },
    cardContent: {
      overflow: "auto",
    },
    cardTitle: {
      color:
        theme.palette.type === "light"
          ? theme.palette.grey[800]
          : theme.palette.grey[200],
    },
    cardDescription: {},
    cardRecommendRate: {
      // backgroundColor: "#F26161",
      borderRadius: 3,
      color: "#fff",
      width: "100%",
      height: 30,
      lineHeight: "30px",
      textAlign: "center",
      marginRight: 10,
      fontSize: 12,
    },
    cardFooter: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: 10,
    },
    textIntro: {
      display: "flex",
      height: "calc(100vh - 250px)",
      color:
        theme.palette.type === "light"
          ? theme.palette.grey[400]
          : theme.palette.grey[200],
      "&>h1": {
        margin: "auto",
      },
    },
    filterRowRoot: {
      marginBottom: 18,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      // width: 800,
    },
    categoryTitle: {
      marginRight: 10,
      verticalAlign: "middle",
      minWidth: 80,
      height: "100%",
    },
    categoryListContainer: {
      display: "flex",
      alignItems: "center",
    },
    categoryList: {
      alignItems: "center",
      verticalAlign: "middle",
      overflow: "hidden",
      display: "-webkit-box",
      WebkitBoxOrient: "vertical",
    },
    categoryItem: {
      border: "none",
      marginRight: 10,
      display: "inline-block",
    },
    optionSelect: {
      // lineHeight: "20px",
    },
    pdfBox: {
      padding: 30,
    },
    pdfDocument: {
      border: "1px solid #737373",
      paddingLeft: 170,
    },
    pdfDownloadBtn: {
      width: "100%",
      margin: "20px 0px",
    },
    scaleDescription: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
    }
  })
);

export const ScaleManage: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  // state
  const [openDetail, setOpenDetail] = useState(false);
  const [category, setCategory] = useState("全部");
  const [selectedOption, setSelectedOption] = useState([
    "不限",
    "不限",
    "推荐度",
  ]);

  const handleChoose = (category) => {
    setCategory(category);
  };

  const handleSelect = (idx, value) => {
    selectedOption[idx] = value;
    setSelectedOption([...selectedOption]);
  };

  const handleCreateScale = () => {};

  const handleOpenDetail = () => {
    setOpenDetail(true);
  };

  return (
    <div className={classes.root}>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography className={classes.titleText} variant="h5">
          量规库管理
        </Typography>
        {openDetail && (
          <Button
            variant="contained"
            color="primary"
            endIcon={<ExitToAppIcon />}
            onClick={() => setOpenDetail(false)}
          >
            返回
          </Button>
        )}
      </Grid>
      {openDetail ? (
        <>
          <Grid>
            <Card>
              <CardContent className={classes.cardContent}>
                <Typography variant="h6">属性-量表-量规联系图</Typography>
                <KnowledgeGraph height={"300px"} />
              </CardContent>
            </Card>
          </Grid>

          <Grid style={{ marginTop: 10 }}>
            <Card>
              <CardContent className={classes.cardContent}>
                <Typography variant="h6">量规详细信息</Typography>
                <PDFDocument />
              </CardContent>
            </Card>
          </Grid>
        </>
      ) : (
        <>
          <Grid>
            <Card>
              <CardContent className={classes.cardContent}>
                <FilterRow
                  categoryList={categoryList}
                  handleChoose={handleChoose}
                  category={category}
                />
                <FilterRowSelect
                  selectedOption={selectedOption}
                  handleSelect={handleSelect}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid container spacing={3} style={{ marginTop: 10 }}>
            {scaleList.map((el, idx) => (
              <ScaleCard id={idx} {...el} handleOpenDetail={handleOpenDetail} />
            ))}
          </Grid>
        </>
      )}
    </div>
  );
};

interface FilterRowProps {
  categoryList: any[];
  handleChoose: (tag: any) => void;
  category: string;
}

const FilterRow: React.FC<FilterRowProps> = (props) => {
  const classes = useStyles();
  const { categoryList, handleChoose, category } = props;
  // 是否折叠
  const [fold, setFold] = useState(true);

  const toggleFold = () => {
    setFold(!fold);
  };

  const handleClick = (item) => {
    handleChoose(item);
  };

  return (
    <div className={classes.filterRowRoot}>
      <div className={classes.categoryListContainer}>
        <span className={classes.categoryTitle}>所属类目：</span>
        <div
          className={classes.categoryList}
          style={{
            overflow: fold ? "hidden" : "visible",
            textOverflow: fold ? "clip" : "ellipsis",
            WebkitLineClamp: fold ? 1 : "unset",
          }}
        >
          <Button
            variant={category === "全部" ? "contained" : "text"}
            color={category === "全部" ? "primary" : "inherit"}
            className={classes.categoryItem}
            onClick={(e) => handleClick("全部")}
          >
            全部
          </Button>
          {categoryList.map((item, idx) => {
            return (
              <Button
                key={idx}
                className={classes.categoryItem}
                variant={item === category ? "contained" : "text"}
                color={item === category ? "primary" : "inherit"}
                onClick={(e) => handleClick(item)}
              >
                {item}
              </Button>
            );
          })}
        </div>
      </div>
      <Button
        size="small"
        color="primary"
        variant="outlined"
        onClick={toggleFold}
      >
        {fold ? "展开" : "折叠"}
      </Button>
    </div>
  );
};

const optionList = ["作者", "好评度", "排序方式"];
const options = {
  作者: ["不限", "小王", "小美", "小明"],
  好评度: ["不限", "大于95%", "80%到95%", "小于80%"],
  排序方式: ["推荐度", "更新时间", "类型"],
};

const FilterRowSelect = (props) => {
  const classes = useStyles();
  const { handleSelect, selectedOption } = props;

  const style = {
    // margin: theme.spacing(1),
    minWidth: 120,
    marginRight: 30,
  };
  return (
    <div className={classes.filterRowRoot}>
      <div className={classes.categoryListContainer}>
        <span className={classes.categoryTitle}>其他选项：</span>
        <div className={classes.categoryList}>
          {optionList.map((el, idx) => {
            return (
              <SelectFormsErrorVerification
                // width={120}
                style={style}
                size="small"
                label={el}
                value={selectedOption[idx]}
                handleChangeSelect={(e) => handleSelect(idx, e.target.value)}
                items={options[el]}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ScaleCard = (props) => {
  const {
    banner,
    title,
    description,
    recommendRate,
    avatar,
    handleOpenDetail,
    id,
  } = props;
  const bgColor = ["#F26161", "#E29836", "#7AC756", "#3894FF"];
  const classes = useStyles();
  // const randomNum = Math.floor(Math.random() * bgColor.length);

  return (
    <Grid xs={3} item>
      <Card>
        {/* <CardContent className={classes.cardContent}> */}
        <CardActionArea onClick={handleOpenDetail}>
          <CardMedia style={{ height: 140 }} image={banner} />
          <CardContent>
            <Typography
              className={classes.cardTitle}
              gutterBottom
              variant="h6"
              component="h3"
            >
              {title}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p" className={classes.scaleDescription}>
              {description}
            </Typography>
          </CardContent>
          <div className={classes.cardFooter}>
            <div
              className={classes.cardRecommendRate}
              style={{ backgroundColor: bgColor[id] }}
            >
              推荐度：{recommendRate} %
            </div>
            <Avatar alt="creator" src={avatar} />
          </div>
        </CardActionArea>
        {/* </CardContent> */}
      </Card>
    </Grid>
  );
};

const PDFDocument: React.FC = () => {
  const classes = useStyles();
  // state
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  // loading pdf document
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // go to previous page
  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  // go to next page
  const handleNextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  // download document
  const handleDownloadDocument = () => {
    const link = document.createElement("a");
    link.setAttribute("download", "");
    link.href = pdf;
    link.click();
  };

  return (
    <Grid container spacing={3}>
      <Grid item md={8}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item>
            <ButtonGroup color="primary" size="small" variant="text">
              <Button
                startIcon={<NavigateBeforeIcon />}
                onClick={handlePreviousPage}
              >
                上一页
              </Button>
              <Button endIcon={<NavigateNextIcon />} onClick={handleNextPage}>
                下一页
              </Button>
            </ButtonGroup>
          </Grid>
          <Grid item>
            <p>
              第 {pageNumber} 页 / 共 {numPages} 页
            </p>
          </Grid>
        </Grid>
        <Document
          className={classes.pdfDocument}
          file={pdf}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page pageNumber={pageNumber} width={400} />
        </Document>
      </Grid>
      <Grid item md={4}>
        <h3>使用对象：</h3>
        <p>教师、教研员</p>
        <h3>使用说明：</h3>
        <p>
          {scaleList[0].description}
        </p>
        <Button
          color="primary"
          variant="outlined"
          className={classes.pdfDownloadBtn}
          endIcon={<GetAppIcon />}
          onClick={handleDownloadDocument}
        >
          标准文档下载
        </Button>
      </Grid>
    </Grid>
  );
};
