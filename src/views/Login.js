import React from "react";
import { Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Button from "@material-ui/core/Button";
import { login } from "../store/actions/userActions";
import Avatar from "@material-ui/core/Avatar";

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
  error: {
    color: "red"
  }
}));

export default function Login() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { isAuthenticated, error } = useSelector(state => state.user);

  const [values, setValues] = React.useState({
    email: "",
    password: "",
    showPassword: false
  });

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  const handleSubmit = event => {
    event.preventDefault();
    dispatch(
      login({
        email: values.email,
        password: values.password
      })
    );
  };

  if (isAuthenticated) {
    return <Redirect to="/home" />;
  } else {
    return (
      <div id="login" className={classes.root}>
        <div>
          <p className={classes.error}>{error ? error : null} </p>
          <form
            className={classes.root}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <TextField
              id="outlined-user"
              label="Email"
              type="text"
              variant="outlined"
              onChange={handleChange("email")}
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
              />
            </FormControl>
            <Button variant="contained" color="primary" type="submit">
              Login
            </Button>
          </form>

          {/* <Button
            variant="contained"
            color="primary"
            className={classes.button}
            startIcon={
              <Avatar
                src={"https://img.icons8.com/doodle/48/000000/facebook-new.png"}
              />
            }
          >
            <span>FACEBOOK LOGIN</span>
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            startIcon={
              <Avatar
                src={"https://img.icons8.com/doodle/48/000000/google-logo.png"}
              />
            }
          >
            <span>GOOGLE LOGIN</span>
          </Button> */}
        </div>
      </div>
    );
  }
}
