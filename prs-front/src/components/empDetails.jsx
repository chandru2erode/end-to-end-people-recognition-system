import React, { Component } from "react";

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
        }
      })
      .catch(error => console.log(error));
  };

  render() {
    // var component;
    if (this.state.isLoaded) {
      console.log(this.state.response);
      var len = Object.keys(this.state.response).length;
      console.log("Size: " + len);
      var component = (
        <div>
          <span>name: {this.state.response[len - 1]["name"]}</span>
          <br />
          <span>date: {this.state.response[len - 1]["date"]}</span>
          <br />
          <span>
            arrival_time: {this.state.response[len - 1]["arrival_time"]}
          </span>
          <br />
          <span>
            departure_time: {this.state.response[len - 1]["departure_time"]}
          </span>
        </div>
      );
    } else if (Object.keys(this.state.response).length === 1) {
      var component = <div>{this.state.response["error"]}</div>;
    }

    return (
      <div>
        <hr />
        <h2>Attendance details of Employee</h2>
        <input
          type="text"
          name="employee_name"
          onChange={event => {
            this.inputChangeListener(event);
          }}
        />
        <input
          type="button"
          value="Fetch Details"
          onClick={this.handleRequest}
        />
        {component}
        <hr />
      </div>
    );
  }
}

export default EmployeeDetails;
