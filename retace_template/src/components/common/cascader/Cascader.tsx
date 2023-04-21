import React, { useRef, useState } from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem, { MenuItemProps } from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Popper, { PopperProps } from "@material-ui/core/Popper";

import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { createStyles, makeStyles } from "@material-ui/core";
// import "./index.css";

interface CascaderProps {
  menuItems?: any[];
}

const useStyles = makeStyles((theme) =>
  createStyles({
    rootMenu: {
      // overflow: "visible",
      maxHeight: 120,
    },
    active: {
      backgroundColor: "rgba(0, 0, 0, 0.04)",
    },
    menuList: {
      minHeight: 124,
      minWidth: 200,
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    menuItem: {
      cursor: "pointer",
      display: "flex",
      justifyContent: "space-between",
      overflow: "visible",
      position: "relative",
      "& a": {
        color: theme.palette.common.black
      }
    },
    caption: {
      alignItems: "center",
      display: "flex"
    },
    subMenu: {
      opacity: "0",
      position: "absolute",
      left: "100%",
      transform: "scale(0.75, 0.5625)",
      transformOrigin: "top right",
      transition: `opacity ${theme.transitions.duration.standard}ms ${
        theme.transitions.easing.easeInOut
      } 0ms, transform ${theme.transitions.duration.shorter}ms ${
        theme.transitions.easing.easeInOut
      } 0ms`, // match Menu transition
      top: "-8px",
      visibility: "hidden"
    },
    subMenuOpen: {
      transform: "scale(1, 1) translateZ(0px)",
      visibility: "visible",
      opacity: "1"
    }
  })
);

interface MyMenuItemProps {
  // id?: string | number;
  label: string;
  onClick: any;
  subMenuItems?: MyMenuItemProps[];
}

type CascaderMenuItemProps = MenuItemProps & {
  button?: true;
  anchorElement?: any;
  handleClose?: any;
} & Pick<PopperProps, "placement"> &
  MyMenuItemProps;

const CascaderMenuItem = (props: CascaderMenuItemProps) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const { label, subMenuItems,handleClose } = props;
  const hasSubMenu = !!(subMenuItems && subMenuItems.length);

  
  const [anchorElement, setAnchorElement] = useState(null);




  return (
    <MenuItem
      {...props}
      className={open ? classes.active : ""}
      onMouseEnter={e => setOpen(true)}
      // onFocus={() => setOpen(true)}
      // onBlur={() => setOpen(false)}
      onMouseLeave={() => setOpen(false)}
    >
      <span>{label}</span>
    </MenuItem>
  );
};

export const Cascader: React.FC<CascaderProps> = (props) => {
  const classes = useStyles();
  const { menuItems } = props;
  const ref = useRef<HTMLDivElement | null>(null);

  const [anchorElement, setAnchorElement] = useState(null);
  const [selectItem, setSelectItem] = useState("浙江");

  const handleClick = (event) => {
    console.log(anchorElement, event.currentTarget)
    setAnchorElement(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElement(null);
  };

  return (
    <div style={{ display: "flex" }}>
      <Button endIcon={<ArrowDropDownIcon />} onClick={handleClick}>
        {selectItem}
      </Button>
      <Menu
        {...props}
        anchorEl={anchorElement}
        elevation={2}
        classes={{
          paper: classes.rootMenu,
        }}
        open={Boolean(anchorElement)}
        // onClose={() => closeAllMenus()}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        onClose={handleClose}
        getContentAnchorEl={null}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        keepMounted
        PaperProps={{
          // ref: ref,
        }}
      >
        
        <MenuList>
          {menuItems &&
            menuItems.map((el, idx) => {
              return <CascaderMenuItem {...el} 
              anchorEl={anchorElement}
              handleClose={handleClose} />;
            })}
        </MenuList>
      </Menu>
      123
    </div>
  );
};
