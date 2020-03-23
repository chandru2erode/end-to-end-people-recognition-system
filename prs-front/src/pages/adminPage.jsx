import React, { Component } from "react";
import { Link } from "react-router-dom";

import AddEmployee from "../components/addEmp";
import DeleteEmployee from "../components/deleteEmp";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

class AdminPage extends Component {
  render() {
    return (
      <div className="App">
        <Link className="btn nav-btn icon-btn home-btn" to="/">
          <FontAwesomeIcon icon={faHome} size="2x" />
        </Link>
        <div className="cnt-cards">
          <AddEmployee />
          <DeleteEmployee />
        </div>
      </div>
    );
  }
}

export default AdminPage;
