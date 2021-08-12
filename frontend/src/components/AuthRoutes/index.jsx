import React, { useContext } from "react";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import { Login } from "../Auth/Login";
import { Signup } from "../Auth/Signup";
import { NavBar } from "../NavBar";
import { TransactionsList } from "../Transactions/List";
import { AuthContext } from "../../contexts/AuthContext";

const AppRoutes = () => {
  const { user } = useContext(AuthContext);
  console.log("user", user);
  if (user) {
    return (
      <div className='layout'>
        <Router>
          <NavBar />
          <Switch>
            <Route exact path='/' component={TransactionsList} />
            {/* <Route path='/dashboard' component={Dashboard} />
            <Route path='/settings' component={Settings} />*/}
          </Switch>
        </Router>
      </div>
    );
  }
  return (
    <Router>
      <Switch>
        <Route path='/' component={Login} />
        <Route path='/signup' component={Signup} />
      </Switch>
    </Router>
  );
};

export { AppRoutes };
