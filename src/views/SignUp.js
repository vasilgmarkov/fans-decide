import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import IconButton from "@material-ui/core/IconButton";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { createUser } from "../store/actions/userActions";
import { useHistory } from "react-router-dom";
import MenuItem from "@material-ui/core/MenuItem";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import Select from "@material-ui/core/Select";
import Avatar from "@material-ui/core/Avatar";
import db from "../config/fbConfig";
import { Redirect } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {
    "& label.Mui-focused": {
      color: "green"
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "green"
    },
    display: "flex",
    flexWrap: "wrap"
  },
  margin: {
    margin: theme.spacing(1)
  },
  withoutLabel: {
    marginTop: theme.spacing(3)
  },
  textField: {
    width: "25ch"
  },
  imgageDisplay: {
    width: 100,
    height: 100,
    borderRadius: 50
  },
  captureBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  delButton: {
    alignSelf: "flex-end"
  },
  teamSelect: {
    "& div": {
      display: "flex",
      alignItems: "center"
    }
  },
  teamLogo: {
    "& img": {
      width: "50%",
      height: "50%"
    }
  }
}));
function SignUp() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { isAuthenticated, error } = useSelector(state => state.user);
  const [values, setValues] = useState({
    username: "",
    password: "",
    email: "",
    showPassword: false,
    league: null,
    team: null,
    file: null
  });
  const [leagues, setLeagues] = useState([]);
  const [teams, setTeams] = useState([]);
  const history = useHistory();

  const handleChange = prop => event => {
    if (prop === "file") {
      if (!event.target.files[0]) {
        alert("no image");
      } else {
        let imageSize = event.target.files[0].size / 1000000;
        if (imageSize > 5) {
          alert("Image to big");
        } else {
          setValues({
            ...values,
            [prop]: event.target.files[0]
          });
        }
      }
    } else {
      setValues({ ...values, [prop]: event.target.value });
      if (prop === "league") {
        getTeams(event.target.value.league_id);
      }
    }
  };
  const handleSubmit = event => {
    event.preventDefault();
    let send = true;
    for (let [key, value] of Object.entries(values)) {
      console.log(`${key}: ${value}`);
      if (value === null || "") {
        send = false;
        break;
      }
    }
    if (send) {
      dispatch(createUser(values));
    } else {
      alert("Wrong data!");
    }
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  const getLeagues = async () => {
    const snapshot = await db
      .firestore()
      .collection("leagues")
      .get();
    let leaguesDB = [];
    snapshot.docs.map(doc => {
      leaguesDB.push(doc.data());
    });
    setLeagues(leaguesDB);
  };

  const getTeams = async leagueId => {
    const snapshot = await db
      .firestore()
      .collection("standings")
      .where("league_id", "==", leagueId)
      .where("season", "==", 1)
      .get();

    snapshot.docs.map(doc => {
      setTeams(doc.data().teams);
    });
  };

  useEffect(() => {
    getLeagues();
  }, []);

  //RENDER
  if (isAuthenticated) {
    return <Redirect to="/home" />;
  }
  return (
    <div id="signUp">
      <div>
        <form
          className={classes.root}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <label htmlFor="file" className={classes.captureBox}>
            {values.file ? (
              [
                <IconButton
                  className={classes.delButton}
                  onClick={e => {
                    e.preventDefault();
                    setValues({ ...values, ["file"]: null });
                  }}
                >
                  <DeleteForeverIcon />
                </IconButton>,
                <img
                  className={classes.imgageDisplay}
                  src={URL.createObjectURL(values.file)}
                  alt="profile"
                />
              ]
            ) : (
              <span> Click to capture</span>
            )}
          </label>
          <input type="file" hidden onChange={handleChange("file")} id="file" />
          <TextField
            id="outlined-email"
            label="Email"
            type="text"
            variant="outlined"
            onChange={handleChange("email")}
            error={error && error.error.includes("email")}
            helperText={
              error && error.error.includes("email") ? error.error : null
            }
          />
          <TextField
            id="outlined-user"
            label="User Name"
            type="text"
            variant="outlined"
            onChange={handleChange("username")}
            error={error && error.error.includes("username")}
            helperText={
              error && error.error.includes("username") ? error.error : null
            }
          />

          <FormControl
            className={clsx(classes.margin, classes.textField)}
            variant="outlined"
          >
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={values.showPassword ? "text" : "password"}
              value={values.password}
              onChange={handleChange("password")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              labelWidth={70}
              error={error && error.error.includes("password")}
              helperText={
                error && error.error.includes("password") ? error.error : null
              }
            />
          </FormControl>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label2">
              Select a league
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label2"
              id="demo-simple-select-outlined2"
              value={values.league}
              onChange={handleChange("league")}
              label="Select a league"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {leagues.map(league => (
                <MenuItem value={league} key={league.league_id}>
                  {league.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {values.league ? (
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="demo-simple-select-outlined-label">
                Pick a team
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={values.team}
                onChange={handleChange("team")}
                label="Pick a team"
                className={classes.teamSelect}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>

                {teams.map(team => (
                  <MenuItem value={team} key={team.team_key}>
                    <Avatar
                      className={classes.teamLogo}
                      src={team.team_badge}
                    />
                    {team.team_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : null}

          <Button variant="outlined" color="primary" type="submit">
            SignUp
          </Button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
