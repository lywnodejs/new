import React, { useState } from "react";
// import MD style & components
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Collapse from "@material-ui/core/Collapse";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
// transition group
import { TransitionGroup } from "react-transition-group";
// import redux
import { useDispatch } from "react-redux";
import { setFilterOptions } from "../../../redux/basicData/slice";
// import customize components
import {
  CoordinateSelectDetail,
  menuProps,
  Datepicker,
} from "../../../components/common";
// import md icon
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
// mock data
import { educationDataList } from "../../../settings/projectMockData";

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    filterItem: {
      // witdh: "100%",
      display: "flex",
      marginRight: 48,
      alignItems: "center",
    },
    filterDelBtn: {
      width: 48,
      height: 48,
    },
    selectRegion: {
      marginLeft: 48,
    },
    addBtn: {
      marginLeft: 48,
      padding: theme.spacing(1),
    },
    filterItemContainer: {
      marginTop: theme.spacing(2),
    },
    btnContainer: {
      textAlign: "right",
    },
    infoDetail: {
      marginTop: theme.spacing(4),
    },
    rangePicker: {
      marginLeft: 48,
      // padding: 8,
      display: "flex",
    },
    rangeTitle: {
      margin: 8,
      padding: "5px 15px",
      border: "1px solid #0000001f",
      borderRadius: 4,
      color: "#0000008a",
    },
    filterBtn: {
      margin: 10,
    },
    filterItemRoot: {
      display: "flex",
      width: "100%",
      maxWidth: 600,
      margin: theme.spacing(1),
    },
    filterType: {
      flex: 0.2,
    },
    filterValue: {
      flex: 0.8,
      // maxWidth: 700,
      marginLeft: theme.spacing(4),
    },
  })
);

export const FilterForm = (props) => {
  const classes = useStyle();
  const dispatch = useDispatch();
  const {
    handleOpenDetail,
    dateRangePicker = false,
    filterData,
    filterType,
  } = props;

  const defaultFilterItem = {
    filterType: "年级",
    filterValue: filterData["年级"],
  };

  const { filterInitialList = [defaultFilterItem] } = props;

  const [filterList, setFilterList] = useState(filterInitialList);
  const [startDate, setStartDate] = useState(new Date("2014-08-18"));
  const [endDate, setEndDate] = useState(new Date("2021-08-18"));
  const [educationFilter, setEducationFilter] = useState(educationDataList[0]);

  const handleChangeType = (type, id) => {
    setFilterList(
      filterList.map((el, idx) =>
        idx === id
          ? {
              filterType: type,
              filterValue:
                type === "教学数据" ? filterData[type][0] : filterData[type],
            }
          : el
      )
    );
  };

  const handleChangeValue = (value, id) => {
    // console.log(value);
    setFilterList(
      filterList.map((el, idx) =>
        idx === id ? { ...el, filterValue: value } : el
      )
    );
  };

  const onAddFilter = () => {
    if (filterList.length < filterType.length) {
      const newFilterType = filterType.filter(
        (type) => filterList.map((item) => item.filterType).indexOf(type) === -1
      );
      const type = newFilterType[0];
      const filterItem = {
        filterType: type,
        filterValue:
          type === "教学数据" ? filterData[type][0] : filterData[type],
      };
      setFilterList([...filterList, filterItem]);
    }
  };

  const onDelFilter = (id) => {
    setFilterList(filterList.filter((el, idx) => idx !== id));
  };

  const onResetFilter = () => {
    setFilterList([defaultFilterItem]);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleSearch = () => {
    console.log(filterList);
    dispatch(setFilterOptions(filterList));
    handleOpenDetail(true);
  };

  const getFilterList = (listItem) => {
    const list = filterType.filter(
      (type) => filterList.map((item) => item.filterType).indexOf(type) === -1
    );
    list.unshift(listItem.filterType);
    // console.log('list', list)
    return list;
  };

  const handleChangeEducationData = (e) => {
    setEducationFilter(e.target.value);
  };

  return (
    <div>
      <div className={classes.filterItemContainer}>
        <TransitionGroup>
          {filterList.map((el, idx) => {
            return (
              <Collapse key={idx}>
                <div className={classes.filterItem}>
                  {idx !== 0 ? (
                    <IconButton
                      className={classes.filterDelBtn}
                      onClick={() => onDelFilter(idx)}
                    >
                      <RemoveIcon />
                    </IconButton>
                  ) : (
                    <IconButton className={classes.filterDelBtn} disabled />
                  )}
                  <CoordinateSelectDetail
                    filterID={idx}
                    selected={filterList[idx]}
                    typeList={getFilterList(filterList[idx])}
                    valueList={filterData[filterList[idx].filterType]}
                    handleChangeType={handleChangeType}
                    handleChangeValue={handleChangeValue}
                  />
                </div>
              </Collapse>
            );
          })}
          {dateRangePicker && (
            <Collapse>
              <div className={classes.filterItem}>
                <IconButton className={classes.filterDelBtn} disabled />
                <div className={classes.filterItemRoot}>
                  <FormControl
                    size="small"
                    className={classes.filterType}
                    variant="outlined"
                  >
                    <TextField
                      variant="outlined"
                      label="筛选项"
                      defaultValue="教学数据"
                      InputProps={{
                        readOnly: true,
                        style: {
                          height: 49,
                          fontSize: 13,
                        },
                      }}
                    />
                  </FormControl>
                  <FormControl
                    size="small"
                    className={classes.filterValue}
                    variant="outlined"
                  >
                    <InputLabel>筛选内容</InputLabel>
                    <Select
                      value={educationFilter}
                      onChange={handleChangeEducationData}
                      MenuProps={menuProps}
                      label="筛选内容"
                      // className={classes.filterSelect}
                      style={{
                        height: 49,
                        fontSize: 13,
                      }}
                    >
                      {educationDataList.map((el, idx) => {
                        return <MenuItem value={el}>{el}</MenuItem>;
                      })}
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div className={classes.filterItem}>
                <IconButton className={classes.filterDelBtn} disabled />
                <div className={classes.filterItemRoot}>
                  <FormControl
                    size="small"
                    className={classes.filterType}
                    variant="outlined"
                  >
                    <TextField
                      variant="outlined"
                      label="筛选项"
                      defaultValue="时间范围"
                      InputProps={{
                        readOnly: true,
                        style: {
                          height: 49,
                          fontSize: 13,
                        },
                      }}
                    />
                  </FormControl>
                  <Datepicker
                    startDate={startDate}
                    endDate={endDate}
                    handleEndDateChange={handleEndDateChange}
                    handleStartDateChange={handleStartDateChange}
                  />
                </div>
              </div>
            </Collapse>
          )}
        </TransitionGroup>
      </div>
      <div className={classes.addBtn}>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onAddFilter}
          disabled={filterList.length >= filterType.length}
        >
          添加行
        </Button>
        {/* {dateRangePicker && (
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            onClick={onAddFilter}
            disabled={filterList.length >= filterType.length}
            style={{ marginLeft: 20 }}
          >
            添加时间范围
          </Button>
        )} */}
      </div>

      <div className={classes.btnContainer}>
        <Button
          variant="contained"
          onClick={onResetFilter}
          className={classes.filterBtn}
        >
          重置条件
        </Button>

        <Button
          variant="contained"
          onClick={handleSearch}
          color="primary"
          className={classes.filterBtn}
        >
          查询
        </Button>
      </div>
    </div>
  );
};
