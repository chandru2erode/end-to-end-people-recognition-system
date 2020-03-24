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
            <LandingPage />
          </Route>
          <Route path="/admin">
            <SnackbarProvider
              maxSnack={4}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left"
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
