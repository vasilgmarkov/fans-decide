import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

import db from "../config/fbConfig";
import SingleMatch from "./SignleMatch";
import Loader from "./Loader";
import { Redirect } from "react-router-dom";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: "100%"
  },
  cardsContainer: {
    height: "75vh",
    overflow: "scroll"
  },
  myTeam: {
    borderStyle: "dotted",
    borderColor: "#387f3275"
  }
}));

export default function DashboardTabs() {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [matches, setMatches] = useState([]);
  // const [user, setUser] = useState({
  //   name: "Vasil",
  //   team: {
  //     team_key: "7105",
  //     team_name: "Barcelona",
  //     team_badge: "https://apiv2.apifootball.com/badges/7105_barcelona.png"
  //   },
  //   likes: []
  // });

  const [today, setToday] = useState(new Date().toDateString());
  const { user, isAuthenticated } = useSelector(state => state.user);

  let myRef = useRef(user ? user.team.team_name : null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const scrollToRef = ref => {
    ref.current.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
    ref.current.classList.add(classes.myTeam);
  };
  const handleChangeIndex = index => {
    setValue(index);
  };

  const getMatches = async () => {
    // const snapshot = await db
    //   .firestore()
    //   .collection("matches")
    //   .where("jornada", "array-contains", new Date().toDateString())
    //   .get();
    // // snapshot.docs.forEach(doc => console.log(doc.data()));
    // console.log(snapshot.docs);
    // let games = [];
    // snapshot.docs.forEach((doc, i) => {});
    // console.log(games);

    // console.log(matches);

    await db
      .firestore()
      .collection(user.league.league_id.toString())

      .where("jornada", "array-contains", today)
      .onSnapshot(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          setToday(doc.data().jornada[0]);
          let onlyGames = doc.data().jornada;

          setMatches(onlyGames);
        });
      });

    setTimeout(() => {
      scrollToRef(myRef);
    }, 1000);
  };
  // if (!isAuthenticated) {
  //   history.push("/");
  // }

  useEffect(() => {
    if (user) {
      getMatches();
    }
  }, [user]);

  const addLike = async (indexMatch, team) => {
    let updateUser = user;
    let matchesToUpdate = matches;
    if (user.likes.includes(today)) {
      user.likes.pop();
      updateUser.likes = user.likes;
      //  setUser(updateUser);
      matchesToUpdate[indexMatch + 1].match[team].score -= 1;
    } else {
      let todayLike = [today, ...user.likes];
      matchesToUpdate[indexMatch + 1].match[team].score += 1;
      updateUser.likes = todayLike;

      // setUser(updateUser);
    }

    const querySnapshot = await db
      .firestore()
      .collection(user.league.league_id.toString())
      .where("jornada", "array-contains", new Date().toDateString())
      .get();
    querySnapshot.forEach(async doc => {
      await doc.ref.update({ jornada: matchesToUpdate });
    });

    const userDB = await db
      .firestore()
      .collection("users")
      .doc(user.id)
      .get();
    userDB.ref.update(updateUser);
  };
  const getGamesOnly = () => {
    return matches.slice(1);
  };
  if (!isAuthenticated) {
    return <Redirect to="/" />;
  }
  return (
    <div>
      {matches.length === 0 ? (
        <Loader />
      ) : (
        <div className={classes.root}>
          <AppBar position="static" color="default">
            <Tabs
              TabIndicatorProps={{ style: { background: "#6db33f" } }}
              value={value}
              onChange={handleChange}
              //   indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              aria-label="full width tabs example"
            >
              <Tab label={new Date().toDateString()} {...a11yProps(0)} />
              <Tab label="All Rents" {...a11yProps(1)} />
            </Tabs>
          </AppBar>
          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={value}
            onChangeIndex={handleChangeIndex}
          >
            <TabPanel value={value} index={0} dir={theme.direction}>
              <div className={classes.cardsContainer}>
                {getGamesOnly().map((game, i) => (
                  <SingleMatch
                    refToGet={
                      game.match[0].team_name === user.team.team_name ||
                      game.match[1].team_name === user.team.team_name
                        ? myRef
                        : null
                    }
                    match={game.match}
                    index={i}
                    addLike={addLike}
                    user={user}
                    key={i}
                  />
                ))}
              </div>
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}></TabPanel>
          </SwipeableViews>
        </div>
      )}
    </div>
  );
}
