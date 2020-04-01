import React, { Component } from "react";
import PropTypes from "prop-types";
import { withSnackbar } from "notistack";

import axios from "axios";

class EmployeeDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emp_name: "",
      isLoaded: false,
      response: {}
    };
  }

  inputChangeListener = event => {
    const { value, name } = event.target;
    this.setState({ emp_name: value });
  };

  handleRequest = () => {
    axios
      .get("http://127.0.0.1:5000/get_employee?name=" + this.state.emp_name)
      .then(result => {
        if (
          result !== {} &&
          JSON.stringify(result["data"]) !==
            JSON.stringify({ error: "User not found..." })
        ) {
          this.setState({ isLoaded: true, response: result["data"] });
          console.log(result);
        } else if (
          JSON.stringify(result["data"]) ===
          JSON.stringify({ error: "User not found..." })
        ) {
          this.setState({ isLoaded: false, response: result["data"] });
          this.props.enqueueSnackbar("No such Employee found...", {
            variant: "warning"
          });
        }
      })
      .catch(error => {
        console.log(error);
        this.props.enqueueSnackbar("Looks like Network Error", {
          variant: "error"
        });
      });
  };

  // correctify = name => name.replace("_", " ");

  render() {
    const response = this.state.response;
    if (this.state.isLoaded) {
      console.log(response);
      var len = Object.keys(response).length;
      console.log("Size: " + len);
      var column_names = Object.keys(response[len - 1]);
      var component = (
        <div className="cnt-result grid-item">
          <div className="cnt-result-line">
            <span className="field-name">Name: </span>
            <span>{response[len - 1]["name"]}</span>
          </div>
          <div className="cnt-result-line">
            <span className="field-name">Date: </span>
            <span>{response[len - 1]["date"]}</span>
          </div>
          <div className="cnt-result-line">
            <span className="field-name">Arrival Time: </span>
            <span>{response[len - 1]["arrival_time"]}</span>
          </div>
          <div className="cnt-result-line">
            <span className="field-name">Departure Time: </span>
            <span>{response[len - 1]["departure_time"]}</span>
          </div>
        </div>
      );
    }

    return (
      <div className="cmpnt">
        <h2>Attendance details of Employee</h2>
        <div className="cnt-form">
          <input
            className="input-box"
            style={{ marginRight: "8px" }}
            type="text"
            name="employee_name"
            onChange={event => {
              this.inputChangeListener(event);
            }}
          />
          <button
            className="btn text-btn green-btn"
            style={{ marginLeft: "8px" }}
            onClick={this.handleRequest}
          >
            Fetch Details
          </button>
        </div>
        {component}
      </div>
    );
  }
}

EmployeeDetails.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired
};

export default withSnackbar(EmployeeDetails);
