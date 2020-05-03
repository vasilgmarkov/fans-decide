import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./views/Home";
import Login from "./views/Login";
import Dashboard from "./views/Dashboard";
import SignUp from "./views/SignUp";
import LandingPage from "./views/LandingPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/home" component={Home} />
          <Route path="/kickoff" component={Dashboard} />
          <Route path="/login" component={Login} />
          <Route path="/signUp" component={SignUp} />
        </Switch>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
