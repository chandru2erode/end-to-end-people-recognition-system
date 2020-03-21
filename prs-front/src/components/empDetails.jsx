import React, { Component } from "react";

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
    fetch("http://127.0.0.1:5000/get_employee?name=" + this.state.emp_name, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(result => {
        // console.log(
        //   JSON.stringify(result) !==
        //     JSON.stringify({ error: "User not found..." })
        // );
        if (
          result !== {} &&
          JSON.stringify(result) !==
            JSON.stringify({ error: "User not found..." })
        ) {
          this.setState({ isLoaded: true, response: result });
          console.log(result);
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
    }

    return (
      <div>
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
      </div>
    );
  }
}
function newFunction() {
  return this;
}

export default EmployeeDetails;
