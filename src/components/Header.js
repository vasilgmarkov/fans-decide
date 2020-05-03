import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import SportsSoccerIcon from "@material-ui/icons/SportsSoccer";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { logOut } from "../store/actions/userActions";
import { Link } from "react-router-dom";
import AccessibilityNewIcon from "@material-ui/icons/AccessibilityNew";
import { useHistory } from "react-router-dom";
import PersonAddIcon from "@material-ui/icons/PersonAdd";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },

  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}));

export default function Header() {
  const classes = useStyles();
  const history = useHistory();

  const { user, isAuthenticated } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const logOutUser = () => dispatch(logOut());

  if (history.location.pathname === "/") {
    return null;
  }
  return (
    <div id="header" className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <Link to="/">
            <Typography variant="h6" className={classes.title}>
              <b>Fans</b>
              <b>Dec</b>
              <span>
                <SportsSoccerIcon />
                <AccessibilityNewIcon />
              </span>
              <b>dE</b>
            </Typography>
          </Link>
          {isAuthenticated ? (
            [
              user.name,
              <Button color="inherit" onClick={() => logOutUser()} key={"exit"}>
                <ExitToAppIcon />
              </Button>
            ]
          ) : history.location.pathname === "/login" ? (
            <Link to="/signUp">
              <Button color="inherit">
                <PersonAddIcon />
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button color="inherit">
                <VpnKeyIcon />
              </Button>
            </Link>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
