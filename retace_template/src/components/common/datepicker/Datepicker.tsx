import React from "react";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
interface DatepickerProps {
  startDate: any;
  endDate: any;
  handleStartDateChange(date): void;
  handleEndDateChange(date): void;
}

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    datepickerContainer: {
      maxWidth: 600,
      display: "flex",
      flex: 0.8,
      alignItems: "center",
      justifyContent: "space-between",
      marginLeft: 32,
    },
    datepicker: {
      margin: theme.spacing(1),
    },
  })
);
export const Datepicker: React.FC<DatepickerProps> = (props) => {
  const classes = useStyle();
  const { startDate, endDate, handleStartDateChange, handleEndDateChange } =
    props;

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <div className={classes.datepickerContainer}>
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="yyyy/MM/dd"
          margin="normal"
          label="开始时间"
          value={startDate}
          onChange={handleStartDateChange}
          className={classes.datepicker}
          inputProps={{
            variant: "outlined",
          }}
        />
        <span>至</span>
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="yyyy/MM/dd"
          margin="normal"
          value={endDate}
          label="结束时间"
          onChange={handleEndDateChange}
          className={classes.datepicker}
        />
      </div>
    </MuiPickersUtilsProvider>
  );
};
