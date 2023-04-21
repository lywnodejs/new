import { GridRenderEditCellParams } from '@mui/x-data-grid';
import Select, { SelectProps } from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { MenuProps } from '@material-ui/core/Menu';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';
import InfoIcon from '@material-ui/icons/Info';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import DoneIcon from '@material-ui/icons/Done';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { STATUS_OPTIONS } from './static-data';


const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      select: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(1),
      },
      optionIcon: {
        minWidth: 36,
      },
      optionText: {
        overflow: 'hidden',
      },
    }),
);

function EditStatus(props: GridRenderEditCellParams) {
  const classes = useStyles();
  const { id, value, api, field } = props;

  const handleChange: SelectProps['onChange'] = (event) => {
    api.setEditCellValue({ id, field, value: event.target.value }, event);
    if (!(event as any).key) {
      api.commitCellChange({ id, field });
      api.setCellMode(id, field, 'view');
    }
  };

  const handleClose: MenuProps['onClose'] = (event, reason) => {
    if (reason === 'backdropClick') {
      api.setCellMode(id, field, 'view');
    }
  };

  return (
    <Select
      value={value}
      classes={{ select: classes.select }}
      onChange={handleChange}
      MenuProps={{
        onClose: handleClose,
      }}
      autoFocus
      fullWidth
      open
    >
      {STATUS_OPTIONS.map((option) => {
        let IconComponent: any = null;
        if (option === 'Rejected') {
          IconComponent = ReportProblemIcon;
        } else if (option === 'Open') {
          IconComponent = InfoIcon;
        } else if (option === 'PartiallyFilled') {
          IconComponent = AutorenewIcon;
        } else if (option === 'Filled') {
          IconComponent = DoneIcon;
        }

        let label = option;
        if (option === 'PartiallyFilled') {
          label = 'Partially Filled';
        }

        return (
          <MenuItem key={option} value={option}>
            <ListItemIcon className={classes.optionIcon}>
              <IconComponent fontSize="small" />
            </ListItemIcon>
            <ListItemText className={classes.optionText} primary={label} />
          </MenuItem>
        );
      })}
    </Select>
  );
}

export function renderEditStatus(params: GridRenderEditCellParams) {
  return <EditStatus {...params} />;
}
