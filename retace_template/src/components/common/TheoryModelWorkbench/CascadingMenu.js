import React, { useState } from "react";
import PropTypes from "prop-types";
import clsx from 'clsx';
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

const styles = theme => ({
  rootMenu: {
    overflow: "visible"
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
});




const CascadingMenu = ({
  anchorElement,
  open,
  onClose,
  menuItems,
  classes,
  onAdd,
  ...props
}) => {
  const [subMenuStates, setSubMenuStates] = useState([]);

  const handleItemClick = (event, menuItem) => {
    const hasSubMenu = !!(
      menuItem.subMenuItems && menuItem.subMenuItems.length
    );

    if (hasSubMenu) {
      // hide already open sub menus and open the requested sub menu
      const newSubMenuState = [...subMenuStates]
      for (const subMenuState of newSubMenuState) {
        if (subMenuState.key === menuItem.key) {
          subMenuState.anchorElement = event.target;
          subMenuState.open = !subMenuState.open;
        } else {
          subMenuState.open = false;
        }
      }
      setSubMenuStates(newSubMenuState)
      // this.setState({ subMenuStates });
    } else {
      onAdd(menuItem);
      closeAllMenus();
    }

    // menuItem.onClick();
  };

  const closeAllMenus = () => {
    setSubMenuStates([])
    onClose();
  };

  const renderMenuItem = (menuItem) => {
    
    const hasSubMenu = !!(
      menuItem.subMenuItems && menuItem.subMenuItems.length
    );

    let subMenuState = subMenuStates.find(
      (menuState) => menuState.key === menuItem.key
    );

    // initialize state for sub menu
    if (hasSubMenu && !subMenuState) {
      subMenuState = {
        key: menuItem.key,
        anchorElement: null,
        open: false,
      };
      

      subMenuStates.push(subMenuState);
      setSubMenuStates(subMenuStates)
    }

    return (
      <MenuItem
        onClick={(e) => handleItemClick(e, menuItem)}
        className={classes.menuItem}
        key={menuItem.key}
      >
        <div className={classes.caption}>{menuItem.caption}</div>
        {hasSubMenu && (
          <>
            <ArrowRightIcon />
            <Paper
              className={clsx(classes.subMenu, {[classes.subMenuOpen]: subMenuState.open})}
            >
              <MenuList>
                {menuItem.subMenuItems.map((subMenuItem) =>
                  renderMenuItem(subMenuItem)
                )}
              </MenuList>
            </Paper>
          </>
        )}
      </MenuItem>
    );
  };

  return (
    <Menu
      {...props}
      anchorEl={anchorElement}
      elevation={2}
      classes={{
        paper: classes.rootMenu,
      }}
      open={open}
      onClose={() => closeAllMenus()}
    >
      {menuItems.map((menuItem) => renderMenuItem(menuItem))}
    </Menu>
  );
};


export default withStyles(styles)(CascadingMenu);
