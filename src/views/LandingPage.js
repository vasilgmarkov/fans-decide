import React from "react";
import SportsSoccerIcon from "@material-ui/icons/SportsSoccer";
import AccessibilityNewIcon from "@material-ui/icons/AccessibilityNew";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },

  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 0,
    fontSize: 45
  },
  media: {
    height: 0,
    width: "100%",
    paddingTop: "56.25%", // 16:9,
    backgroundSize: "100%"
  },
  button: {
    backgroundColor: "white",
    margin: 15,
    color: "#277f31",
    borderRadius: 30
  },
  outButton: {
    margin: 15,
    marginTop: 0,
    color: "white",
    fontSize: 18
  }
}));
function LandingPage() {
  const history = useHistory();
  const classes = useStyles();
  const { isAuthenticated } = useSelector(state => state.user);
  const changePage = page => {
    history.push(page);
  };

  if (isAuthenticated) {
    return <Redirect to="/home" />;
  }

  return (
    <div id="landing">
      <Typography variant="h6" className={classes.title}>
        <b>Fans</b>
        <b>Dec</b>
        <span>
          <SportsSoccerIcon />
          <AccessibilityNewIcon />
        </span>
        <b>dE</b>
      </Typography>
      <CardMedia
        className={classes.media}
        image={require("../assets/landing.png")}
        title="Paella dish"
      />
      <Typography variant="h6" className={classes.title}>
        <span> Because we live for the game!</span>
      </Typography>
      <Button
        variant="contained"
        className={classes.button}
        onClick={() => changePage("/signUp")}
      >
        select your favorite team
      </Button>
      <Button
        className={classes.outButton}
        onClick={() => changePage("/login")}
      >
        enter
      </Button>
    </div>
  );
}

export default LandingPage;
