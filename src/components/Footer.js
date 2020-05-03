import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";

import { useHistory } from "react-router-dom";

import Badge from "@material-ui/core/Badge";

import EqualizerIcon from "@material-ui/icons/Equalizer";
import SportsIcon from "@material-ui/icons/Sports";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    position: "fixed",
    bottom: 0
  },
  "& > *": {
    marginBottom: theme.spacing(2)
  },
  "& .MuiBadge-root": {
    marginRight: theme.spacing(4)
  },
  logo: {
    width: 45,
    height: 45
  }
}));

export default function Footer() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const today = new Date().toDateString();

  const history = useHistory();
  const { isAuthenticated, user } = useSelector(state => state.user);
  const changePage = page => {
    console.log(page);

    history.push(page);
  };
  if (
    history.location.pathname === "/" ||
    history.location.pathname === "/signUp" ||
    history.location.pathname === "/login"
  ) {
    return null;
  }
  return (
    <div id="footer">
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        showLabels
        className={classes.root}
      >
        <BottomNavigationAction
          label="Standigs"
          icon={<EqualizerIcon />}
          onClick={() => changePage("/home")}
        />

        {isAuthenticated ? (
          <BottomNavigationAction
            //label="FC BARCELONA"
            icon={
              <Badge
                color="secondary"
                badgeContent={user.likes.includes(today) ? null : 1}
              >
                <img
                  className={classes.logo}
                  src={user.team.team_badge}
                  alt="team logo"
                />
              </Badge>
            }
          />
        ) : null}
        <BottomNavigationAction
          label="Kick-off"
          onClick={() => changePage("/kickoff")}
          icon={<SportsIcon />}
        />
      </BottomNavigation>
    </div>
  );
}
