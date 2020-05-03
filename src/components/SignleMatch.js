import React, { forwardRef } from "react";
import { makeStyles } from "@material-ui/core/styles";

import Card from "@material-ui/core/Card";

import CardContent from "@material-ui/core/CardContent";

import IconButton from "@material-ui/core/IconButton";

import { red } from "@material-ui/core/colors";

import Tooltip from "@material-ui/core/Tooltip";
import ThumbsUpDownIcon from "@material-ui/icons/ThumbsUpDown";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: "100%",
    marginBottom: 10
  },
  media: {
    // paddingTop: "15%", // 16:9
    backgroundImage: "url(" + require("../assets/match.jpg") + ")",
    backgroundSize: "cover",
    display: "flex",
    flexDirection: "column",
    height: "145px"
  },
  logoDiv: {
    display: "flex",
    justifyContent: "space-evenly"
  },
  logo: {
    width: "20%"
  },
  nameContainer: {
    color: "white",
    height: "100%",
    display: "flex",
    // justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: 13,
    justifyContent: "space-around",
    padding: "0 14% 0 14%"
  },
  names: {
    width: "33%",
    textAlign: "center"
  },
  flipLike: {
    transform: "scaleX(-1)",
    " -moz-transform": "scaleX(-1)",
    "-webkit-transform": "scaleX(-1)",
    "-ms-transform": "scaleX(-1)"
  },
  likeButton: {
    padding: 0
  },
  myTeam: {
    color: "black"
  },
  liked: {
    color: "#277f31"
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: red[500]
  }
}));

function SingleMatch({ match, index, user, addLike, refToGet }) {
  const classes = useStyles();

  const today = new Date().toDateString();

  const checkMyTeam = teamId => {
    return teamId === user.team.team_key ? false : true;
  };

  return (
    <Card className={classes.root} ref={refToGet}>
      <CardContent>
        <div className={classes.media}>
          <div className={classes.logoDiv}>
            <Tooltip
              title={
                !checkMyTeam(match[0].team_key) ? "" : "This is not your team!"
              }
              disableTouchListener
            >
              <span>
                <IconButton
                  disabled={checkMyTeam(match[0].team_key)}
                  className={classes.likeButton}
                  onClick={() => addLike(index, 0)}
                >
                  <ThumbUpAltIcon
                    className={
                      checkMyTeam(match[0].team_key)
                        ? null
                        : user.likes.includes(today)
                        ? classes.liked
                        : classes.myTeam
                    }
                  />
                </IconButton>
              </span>
            </Tooltip>
            <img
              className={classes.logo}
              src={match[0].team_badge}
              alt="team logo"
            />
            <span>
              {match[0].score} - {match[1].score}
            </span>
            <img
              className={classes.logo}
              src={match[1].team_badge}
              alt="team logo"
            />
            <Tooltip
              title={
                !checkMyTeam(match[1].team_key) ? "" : "This is not your team!"
              }
              disableTouchListener
            >
              <span>
                <IconButton
                  disabled={checkMyTeam(match[1].team_key)}
                  className={classes.likeButton}
                  onClick={() => addLike(index, 1)}
                >
                  <ThumbUpAltIcon
                    className={`
                      ${classes.flipLike} 
                      ${
                        checkMyTeam(match[1].team_key)
                          ? null
                          : user.likes.includes(today)
                          ? classes.liked
                          : classes.myTeam
                      }`}
                  />
                </IconButton>
              </span>
            </Tooltip>
          </div>
          <p className={classes.nameContainer}>
            <span className={classes.names}> {match[0].team_name} </span>
            <ThumbsUpDownIcon className={classes.names} />
            <span className={classes.names}> {match[1].team_name} </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default forwardRef(SingleMatch);
