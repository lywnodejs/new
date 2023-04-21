import React, { useState } from "react";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import Chip from "@material-ui/core/Chip";
import { SelectFormsErrorVerification, menuProps } from "../";

interface CoordinateSelectRegionProps {
  provinceData: any[];
  cityData: any;
  areaData: any;
  schoolData: any[];
  handleCheckDetail(checkType: "area" | "school" | null): void;
  handleChangeData(data: any): void;
  selectedData: {
    province: string;
    city: string;
    area: string;
    school: string;
  };

  className?: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
      height: "100%",

      "&::-webkit-scrollbar": {
        width: 5,
        backgroundColor: theme.palette.menu[theme.palette.type],
      },
      "&::-webkit-scrollbar-thumb": {
        background: "#a3a3a373",
        borderRadius: "8px",
      },
    },
    titleText: {
      margin: "20px 0 10px 0",
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    filterItemRoot: {
      display: "flex",
      width: "100%",
      maxWidth: 600,
      margin: theme.spacing(1),
    },
    filterType: {
      flex: 0.2,
      // maxWidth: 300,
    },
    filterValue: {
      flex: 0.8,
      // maxWidth: 700,
      marginLeft: theme.spacing(4),
    },
    chip: {
      margin: 2,
    },
    chips: {
      display: "flex",
      flexWrap: "wrap",
    },
    filterSelect: {
      minHeight: 49,
      fontSize: 13,
    },
  })
);

export const CoordinateSelectRegion: React.FC<CoordinateSelectRegionProps> = (
  props
) => {
  // 省市区学校对应数据 实际情况应是一级级请求后端？
  const {
    provinceData,
    cityData,
    areaData,
    schoolData,
    handleCheckDetail,
    handleChangeData,
    selectedData,
    className,
  } = props;

  const classes = useStyles();

  //选择项所组成的数组
  // const [selected, setSelected] = useState([]);

  const handleChangeProvince = (e) => {
    handleChangeData({
      province: e.target.value,
      city: "",
      area: "",
      school: "",
    });
    handleCheckDetail(null);
  };

  const handleChangeCity = (e) => {
    handleChangeData({
      ...selectedData,
      city: e.target.value,
      area: "",
      school: "",
    });
    handleCheckDetail(null);
  };

  const handleChangeArea = (e) => {
    handleChangeData({
      ...selectedData,
      area: e.target.value,
      school: "",
    });
    //点击区域查看相应信息
    handleCheckDetail("area");
  };

  const handleChangeSchool = (e) => {
    //点击学校查看相应信息
    handleChangeData({
      ...selectedData,
      school: e.target.value,
    });

    //点击区域查看相应信息
    handleCheckDetail("school");
  };

  return (
    <div className={className}>
      <SelectFormsErrorVerification
        value={selectedData.province}
        handleChangeSelect={handleChangeProvince}
        items={provinceData}
        label="省份"
        width={120}
      />
      <SelectFormsErrorVerification
        value={selectedData.city}
        handleChangeSelect={handleChangeCity}
        items={cityData[selectedData.province]}
        disabled={selectedData.province === ""}
        label="城市"
        width={120}
      />
      <SelectFormsErrorVerification
        value={selectedData.area}
        handleChangeSelect={handleChangeArea}
        items={areaData[selectedData.province]?.[selectedData.city]}
        disabled={selectedData.city === ""}
        label="区"
        width={120}
      />
      <SelectFormsErrorVerification
        value={selectedData.school}
        handleChangeSelect={handleChangeSchool}
        items={schoolData}
        disabled={selectedData.area === ""}
        label="学校"
        width={120}
      />
    </div>
  );
};

interface CoordinateSelectDetailProps {
  filterID: number;
  selected: {
    filterType: string;
    filterValue: string[] | string;
  };
  typeList: any[];
  valueList: any[];
  handleChangeType(type, id): void;
  handleChangeValue(value, id): void;
}

export const CoordinateSelectDetail: React.FC<CoordinateSelectDetailProps> = (
  props
) => {
  const {
    filterID,
    selected,
    typeList,
    valueList,
    handleChangeType,
    handleChangeValue,
  } = props;
  const classes = useStyles();

  // const [selected, setSelected] = useState("");

  const renderValue = (select) => {
    if (select.length === valueList.length) {
      return (
        <div className={classes.chips}>
          <Chip
            size="small"
            key={"所有" + selected.filterType}
            label={"所有" + selected.filterType}
            className={classes.chip}
          />
        </div>
      );
    }
    return (
      <div className={classes.chips}>
        {select.map((value) => (
          <Chip
            size="small"
            key={value}
            label={value}
            className={classes.chip}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={classes.filterItemRoot}>
      <FormControl
        size="small"
        className={classes.filterType}
        variant="outlined"
      >
        <InputLabel>筛选项</InputLabel>
        <Select
          value={selected.filterType}
          onChange={(e) => handleChangeType(e.target.value, filterID)}
          MenuProps={menuProps}
          label="筛选项"
          className={classes.filterSelect}
        >
          {typeList.map((el, idx) => {
            return <MenuItem value={el}>{el}</MenuItem>;
          })}
        </Select>
      </FormControl>

      <FormControl
        size="small"
        className={classes.filterValue}
        variant="outlined"
      >
        <InputLabel>筛选内容</InputLabel>
        {selected.filterType === "教学数据" ? (
          <Select
            value={selected.filterValue}
            onChange={(e) => handleChangeValue(e.target.value, filterID)}
            MenuProps={menuProps}
            label="筛选内容"
            className={classes.filterSelect}
          >
            {valueList.map((el, idx) => {
              return <MenuItem value={el}>{el}</MenuItem>;
            })}
          </Select>
        ) : (
          <Select
            value={selected.filterValue}
            onChange={(e) => handleChangeValue(e.target.value, filterID)}
            MenuProps={menuProps}
            label="筛选内容"
            multiple
            renderValue={renderValue}
            className={classes.filterSelect}
          >
            {valueList.map((el, idx) => {
              return (
                <MenuItem value={el}>
                  <Checkbox checked={selected.filterValue.indexOf(el) > -1} />
                  {el}
                </MenuItem>
              );
            })}
          </Select>
        )}
      </FormControl>
    </div>
  );
};
