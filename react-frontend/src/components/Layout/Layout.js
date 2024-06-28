import React from "react";
import {
  Route,
  Switch,
  Redirect,
  withRouter,
} from "react-router-dom";
import classnames from "classnames";
import { Box, IconButton, Link } from '@material-ui/core'
import Icon from '@mdi/react'

//icons
import {
  mdiFacebook as FacebookIcon,
  mdiTwitter as TwitterIcon,
  mdiGithub as GithubIcon,
} from '@mdi/js'

// styles
import useStyles from "./styles";

// components
import Header from "../Header";
import Sidebar from "../Sidebar";

// pages
import Dashboard from "../../pages/dashboard/Dashboard1.js";
import Typography from "../../pages/typography";
import Notifications from "../../pages/notifications";
import Maps from "../../pages/maps";
import Clients from "../../pages/clients/Clients";
import Users from "../../pages/users/Users"
import Icons from "../../pages/icons";
import Charts from "../../pages/charts";
import Profile from "../../pages/profile/Profile"
import ChangePass from '../../pages/profile/ChangePass'
import Projects from "../../pages/projects/projects";
import AddUser from "../../pages/users/AddUser";
import AddProject from "../../pages/projects/AddProject.js";
import AddClient from "../../pages/clients/AddClient.js";
import GrantAccess from "../../pages/projects/GrantAccess.js";
import ResetPass from "../../pages/users/ResetPass.js";

// context
import { useLayoutState } from "../../context/LayoutContext";
import { useUserState } from "../../context/UserContext.js";
import RevokeAccess from "../../pages/projects/RevokeAccess.js";

function Layout(props) {
  var classes = useStyles();

  // global
  var layoutState = useLayoutState();
  const { userRole } = useUserState();

  return (
    <div className={classes.root}>
      <>
        <Header history={props.history} />
        <Sidebar />
        <div
          className={classnames(classes.content, {
            [classes.contentShift]: layoutState.isSidebarOpened  // adjust content shift
          })}
        >
          <div className={classes.fakeToolbar} />
          <Switch>
            <Route path="/app/dashboard" component={Dashboard} />
            <Route path="/app/typography" component={Typography} />
            <Route path="/app/clients" component={Clients} />
            <Route path="/app/users" component={Users} />
            <Route path="/app/projects" component={Projects} />
            <Route path="/app/notifications" component={Notifications} />
            <Route path="/profile" component={Profile} />
            <Route path="/changePass" component={ChangePass} />
            <Route path="/app/addUser" component={AddUser} />
            <Route path="/app/addProject" component={AddProject} />
            <Route path="/app/addClient" component={AddClient} />
            <Route path='/app/grantAccess' component={GrantAccess} />
            <Route path='/app/revokeAccess' component={RevokeAccess} />
            <Route path='/app/resetPass' component={ResetPass} />

            <Route
              exact
              path="/app/ui"
              render={() => <Redirect to="/app/ui/icons" />}
            />
            {/* <Route path="/app/ui/maps" component={Maps} /> */}
            <Route path="/app/ui/icons" component={Icons} />
            <Route path="/app/ui/charts" component={Charts} />
          </Switch>
          <Box
            mt={5}
            width={"100%"}
            display={"flex"}
            alignItems={"center"}
            justifyContent="space-between"
          >
            <div>
              <Link
                color={'primary'}
                href={'https://flatlogic.com/'}
                target={'_blank'}
                className={classes.link}
              >
                Flatlogic
              </Link>
              <Link
                color={'primary'}
                href={'https://flatlogic.com/about'}
                target={'_blank'}
                className={classes.link}
              >
                About Us
              </Link>
              <Link
                color={'primary'}
                href={'https://flatlogic.com/blog'}
                target={'_blank'}
                className={classes.link}
              >
                Blog
              </Link>
            </div>
            <div>
              <Link
                href={'https://www.facebook.com/flatlogic'}
                target={'_blank'}
              >
                <IconButton aria-label="facebook">
                  <Icon
                    path={FacebookIcon}
                    size={1}
                    color="#6E6E6E99"
                  />
                </IconButton>
              </Link>
              <Link
                href={'https://twitter.com/flatlogic'}
                target={'_blank'}
              >
                <IconButton aria-label="twitter">
                  <Icon
                    path={TwitterIcon}
                    size={1}
                    color="#6E6E6E99"
                  />
                </IconButton>
              </Link>
              <Link
                href={'https://github.com/flatlogic'}
                target={'_blank'}
              >
                <IconButton
                  aria-label="github"
                  style={{ marginRight: -12 }}
                >
                  <Icon
                    path={GithubIcon}
                    size={1}
                    color="#6E6E6E99"
                  />
                </IconButton>
              </Link>
            </div>
          </Box>
        </div>
      </>
    </div>
  );
}

export default withRouter(Layout);
