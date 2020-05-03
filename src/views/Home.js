import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Loader from "../components/Loader";
import db from "../config/fbConfig";

const useStyles = makeStyles({
  table: {
    minWidth: "100%",
    marginTop: 55,
    marginBottom: 55
  },
  logo: {
    width: "20%"
  },
  teamName: {
    verticalAlign: "super"
  },
  highLightTr: {
    backgroundColor: "#387f3275"
  }
});

export default function Home() {
  const classes = useStyles();

  const [rows, setRows] = useState([]);
  const { user, isAuthenticated } = useSelector(state => state.user);

  let myRef = useRef(user ? user.team.team_name : null);

  const scrollToRef = ref => {
    ref.current.scrollIntoView({
      block: "center",
      behavior: "smooth"
    });
    ref.current.classList.add(classes.highLightTr);
    return true;
  };
  useEffect(() => {
    const getStanding = async () => {
      await db
        .firestore()
        .collection("standings")
        .where("league_id", "==", user.league.league_id)
        .where("season", "==", 1)
        .onSnapshot(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            let onlyGames = doc.data();

            setRows(onlyGames.teams.sort((t1, t2) => t2.points - t1.points));
          });
        });

      setTimeout(() => {
        scrollToRef(myRef);
      }, 1000);
    };

    if (user) {
      getStanding();
    }
  }, [user]);
  if (!isAuthenticated) {
    return <Redirect to="/" />;
  }
  return (
    <TableContainer component={Paper}>
      {rows.length === 0 ? (
        <Loader />
      ) : (
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Pos</TableCell>
              <TableCell>Team</TableCell>
              <TableCell width="50px" align="right">
                Avg
                <span role="img" aria-label="like emoji">
                  👍
                </span>
              </TableCell>

              <TableCell align="right">Pts.</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow
                ref={row.team_name === user.team.team_name ? myRef : null}
                key={i}
              >
                <TableCell>{i + 1}</TableCell>
                <TableCell component="th" scope="row">
                  <img
                    className={classes.logo}
                    src={row.team_badge}
                    alt="team logo"
                  />
                  <span className={classes.teamName}>{row.team_name}</span>
                </TableCell>
                {/* <TableCell align="right">{row.likes ? row.likes : 0}</TableCell> */}
                {/* <TableCell align="right">
                {row.disLikes ? row.disLikes : 0}
              </TableCell> */}
                <TableCell align="center">
                  {row.favLikes ? row.favLikes : 0}
                </TableCell>

                <TableCell align="center">
                  {row.points ? row.points : 0}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
}
