import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";

import LandingPage from "./pages/landingPage";
import AdminPage from "./pages/adminPage";
import NotFoundPage from "./pages/notFoundPage";

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/">
            <SnackbarProvider
              maxSnack={3}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center"
              }}
            >
              <LandingPage />
            </SnackbarProvider>
          </Route>
          <Route path="/admin">
            <SnackbarProvider
              maxSnack={3}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center"
              }}
            >
              <AdminPage />
            </SnackbarProvider>
          </Route>
          <Route>
            <NotFoundPage />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
