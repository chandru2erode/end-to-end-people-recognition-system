import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { withSnackbar } from "notistack";

import "../App.css";

import EmployeeDetails from "../components/empDetails";
import RecentRecords from "../components/recentRecords";
import VideoFeed from "../components/video_feed";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCog } from "@fortawesome/free-solid-svg-icons";

class LandingPage extends Component {
  render() {
    return (
      <div className="App">
        <div className="container">
          <Link className="btn nav-btn icon-btn admin-btn" to="/admin">
            <FontAwesomeIcon icon={faUserCog} size="2x" pull="left" />
          </Link>
          <div className="cnt-cmpnt">
            <div className="cnt-left">
              <VideoFeed />
              <EmployeeDetails />
            </div>
            <div className="cnt-right">
              <RecentRecords />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

LandingPage.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired
};

export default withSnackbar(LandingPage);
