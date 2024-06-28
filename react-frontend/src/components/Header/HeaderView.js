import React from "react";
import { Link, withRouter } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Fab,
  withStyles
} from "@material-ui/core";
import {
  Menu as MenuIcon,
  MailOutline as MailIcon,
  NotificationsNone as NotificationsIcon,
  Person as AccountIcon,
  Search as SearchIcon,
  Send as SendIcon,
  ArrowBack as ArrowBackIcon
} from "@material-ui/icons";
import { fade } from "@material-ui/core/styles/colorManipulator";
import classNames from "classnames";

import { Badge, Typography } from "../Wrappers";
import Notification from "../Notification";
import UserAvatar from "../UserAvatar";

const messages = [
  {
    id: 0,
    variant: "warning",
    name: "Jane Hew",
    message: "Hey! How is it going?",
    time: "9:32"
  },
  {
    id: 1,
    variant: "success",
    name: "Lloyd Brown",
    message: "Check out my new Dashboard",
    time: "9:18"
  },
  {
    id: 2,
    variant: "primary",
    name: "Mark Winstein",
    message: "I want rearrange the appointment",
    time: "9:15"
  },
  {
    id: 3,
    variant: "secondary",
    name: "Liana Dutti",
    message: "Good news from sale department",
    time: "9:09"
  }
];

const notifications = [
  { id: 0, color: "warning", message: "Check out this awesome ticket" },
  {
    id: 1, color: "success", type: "info", message: "What is the best way to get ..."
  },
  {
    id: 2, color: "secondary", type: "notification", message: "This is just a simple notification"
  },
  {
    id: 3, color: "primary", type: "e-commerce", message: "12 new orders has arrived today"
  }
];

const Header = ({ classes, isSidebarOpened, toggleSidebar, ...props }) => (
  <AppBar position="fixed" className={classes.appBar}>
    <Toolbar className={classes.toolbar}>
      <IconButton
        color="inherit"
        onClick={toggleSidebar}
        className={classNames(
          classes.headerMenuButton,
          classes.headerMenuButtonCollapse
        )}
      >
        {isSidebarOpened ? (
          <ArrowBackIcon
            classes={{
              root: classNames(classes.headerIcon, classes.headerIconCollapse)
            }}
          />
        ) : (
          <MenuIcon
            classes={{
              root: classNames(classes.headerIcon, classes.headerIconCollapse)
            }}
          />
        )}
      </IconButton>
      <Typography variant="h6" weight="medium" className={classes.logotype}>
        React Material Admin
      </Typography>
      <div className={classes.grow} />
      <div
        className={classNames(classes.search, {
          [classes.searchFocused]: props.isSearchOpen
        })}
      >
        <div
          className={classNames(classes.searchIcon, {
            [classes.searchIconOpened]: props.isSearchOpen
          })}
          onClick={props.toggleSearch}
        >
          <SearchIcon classes={{ root: classes.headerIcon }} />
        </div>
        <InputBase
          placeholder="Search…"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput
          }}
        />
      </div>
      <IconButton
        color="inherit"
        aria-haspopup="true"
        aria-controls="mail-menu"
        onClick={props.openNotificationsMenu}
        className={classes.headerMenuButton}
      >
        <Badge
          badgeContent={
            props.isNotificationsUnread ? notifications.length : null
          }
          colortheme="warning"
        >
          <NotificationsIcon classes={{ root: classes.headerIcon }} />
        </Badge>
      </IconButton>
      <IconButton
        color="inherit"
        aria-haspopup="true"
        aria-controls="mail-menu"
        onClick={props.openMailMenu}
        className={classes.headerMenuButton}
      >
        <Badge
          badgeContent={props.isMailsUnread ? messages.length : null}
          color="secondary"
        >
          <MailIcon classes={{ root: classes.headerIcon }} />
        </Badge>
      </IconButton>
      <IconButton
        aria-haspopup="true"
        color="inherit"
        className={classes.headerMenuButton}
        aria-controls="profile-menu"
        onClick={props.openProfileMenu}
      >
        <AccountIcon classes={{ root: classes.headerIcon }} />
      </IconButton>
      <Menu
        id="mail-menu"
        open={Boolean(props.mailMenu)}
        anchorEl={props.mailMenu}
        onClose={props.closeMailMenu}
        MenuListProps={{ className: classes.headerMenuList }}
        className={classes.headerMenu}
        classes={{ paper: classes.profileMenu }}
        disableAutoFocusItem
      >
        <div className={classes.profileMenuUser}>
          <Typography variant="h4" weight="medium">
            New Messages
          </Typography>
          <Typography
            className={classes.profileMenuLink}
            component="a"
            color="secondary"
          >
            {messages.length} New Messages
          </Typography>
        </div>
        {messages.map(message => (
          <MenuItem key={message.id} className={classes.messageNotification}>
            <div className={classes.messageNotificationSide}>
              <UserAvatar color={message.variant} name={message.name} />
              <Typography size="sm" color="textSecondary">
                {message.time}
              </Typography>
            </div>
            <div
              className={classNames(
                classes.messageNotificationSide,
                classes.messageNotificationBodySide
              )}
            >
              <Typography weight="medium" gutterBottom>
                {message.name}
              </Typography>
              <Typography color="textSecondary">{message.message}</Typography>
            </div>
          </MenuItem>
        ))}
        <Fab
          variant="extended"
          color="primary"
          aria-label="Add"
          className={classes.sendMessageButton}
        >
          Send New Message
          <SendIcon className={classes.sendButtonIcon} />
        </Fab>
      </Menu>
      <Menu
        id="notifications-menu"
        open={Boolean(props.notificationsMenu)}
        anchorEl={props.notificationsMenu}
        onClose={props.closeNotificationsMenu}
        className={classes.headerMenu}
        disableAutoFocusItem
      >
        {notifications.map(notification => (
          <MenuItem
            key={notification.id}
            onClick={props.closeNotificationsMenu}
            className={classes.headerMenuItem}
          >
            <Notification {...notification} typographyVariant="inherit" />
          </MenuItem>
        ))}
      </Menu>
      <Menu
        id="profile-menu"
        open={Boolean(props.profileMenu)}
        anchorEl={props.profileMenu}
        onClose={props.closeProfileMenu}
        className={classes.headerMenu}
        classes={{ paper: classes.profileMenu }}
        disableAutoFocusItem
      >
        <div className={classes.profileMenuUser}>
          <Typography variant="h4" weight="medium">
            John Smith
          </Typography>
          <Typography
            className={classes.profileMenuLink}
            component="a"
            color="primary"
            href="https://flatlogic.com"
          >
            Flalogic.com
          </Typography>
        </div>
        <MenuItem
          className={classNames(classes.profileMenuItem, classes.headerMenuItem)}
          onClick={() => {
            history.push("/profile");
          }}
        >
          <AccountIcon className={classes.profileMenuIcon} /> Profile
        </MenuItem>
        <MenuItem
          className={classNames(
            classes.profileMenuItem,
            classes.headerMenuItem
          )}
          onClick={() => {
            props.history.push("/changePass");
          }}
        >
          <AccountIcon className={classes.profileMenuIcon} /> Change Password
        </MenuItem>
        <MenuItem
          className={classNames(
            classes.profileMenuItem,
            classes.headerMenuItem
          )}
        >
          <AccountIcon className={classes.profileMenuIcon} /> Messages
        </MenuItem>
        <div className={classes.profileMenuUser}>
          <Typography
            className={classes.profileMenuLink}
            color="primary"
            onClick={props.signOut}
          >
            Sign Out
          </Typography>
        </div>
      </Menu>
    </Toolbar>
  </AppBar>
);

const styles = theme => ({
  logotype: {
    color: "white",
    marginLeft: theme.spacing.unit * 2.5,
    marginRight: theme.spacing.unit * 2.5,
    fontWeight: 500,
    fontSize: 18,
    whiteSpace: "nowrap",
    [theme.breakpoints.down("xs")]: {
      display: "none"
    }
  },
  appBar: {
    width: "100vw",
    zIndex: theme.zIndex.drawer + 1
  },
  toolbar: {
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit
  },
  hide: {
    display: "none"
  },
  grow: {
    flexGrow: 1
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: "auto",
    [theme.breakpoints.up("md")]: {
      width: "auto"
    },
    [theme.breakpoints.down("sm")]: {
      display: "none"
    }
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    color: "inherit",
    width: "100%"
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create("width"),
    width: 120,
    [theme.breakpoints.up("md")]: {
      width: 200
    }
  },
  headerMenu: {
    marginTop: theme.spacing.unit * 7
  },
  headerMenuItem: {
    "&:hover, &:focus": {
      backgroundColor: theme.palette.primary.main,
      color: "white"
    }
  },
  headerMenuButton: {
    marginLeft: theme.spacing.unit * 2,
    padding: theme.spacing.unit / 2
  },
  headerMenuButtonCollapse: {
    marginRight: theme.spacing.unit * 2
  },
  profileMenu: {
    minWidth: 265
  },
  profileMenuUser: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing.unit * 2
  },
  profileMenuIcon: {
    marginRight: theme.spacing.unit * 2,
    color: theme.palette.text.primary
  },
  profileMenuItem: {
    color: theme.palette.text.primary
  },
  messageNotification: {
    display: "flex",
    alignItems: "center",
    margin: theme.spacing.unit * 2,
    justifyContent: "space-between",
    flex: 1
  },
  messageNotificationSide: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  messageNotificationBodySide: {
    justifyContent: "space-between",
    flex: 1
  },
  sendMessageButton: {
    margin: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 4,
    textTransform: "none"
  },
  sendButtonIcon: {
    marginLeft: theme.spacing.unit
  }
});

export default withStyles(styles)(withRouter(Header));
