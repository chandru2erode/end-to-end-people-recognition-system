import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { withSnackbar } from "notistack";

import "../App.css";

import AddEmployee from "../components/addEmp";
import DeleteEmployee from "../components/deleteEmp";
import AllEmployeeDetails from "../components/allEmpDetails";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

class AdminPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App cnt-admin-cmpnt">
        <Link className="btn nav-btn icon-btn home-btn" to="/">
          <FontAwesomeIcon icon={faHome} size="2x" />
        </Link>
        <div className="cnt-cards">
          <AddEmployee />
          <DeleteEmployee />
        </div>
        <div className="cnt-cards">
          <AllEmployeeDetails />
        </div>
      </div>
    );
  }
}

AdminPage.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired
};

export default withSnackbar(AdminPage);
