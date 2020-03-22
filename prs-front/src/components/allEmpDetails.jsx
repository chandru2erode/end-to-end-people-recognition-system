import React, { Component } from "react";
import axios from "axios";

class ALlEmployeeDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: {}
    };
    this.handleRequest();
  }

  handleRequest = () => {
    axios
      .get("http://127.0.0.1:5000/get_employee_list")
      .then(result => {
        console.log(result);
        this.setState({ response: result["data"] });
      })
      .catch(error => console.log(error));
  };

  createList = () => {
    return Object.keys(this.state.response).map(key => {
      return <li key={key}>{this.state.response[key]}</li>;
    });
  };

  render() {
    return (
      <div>
        <h2>List of all employees</h2>
        <input type="button" value="Refresh" onClick={this.handleRequest} />
        <ul>{this.createList()}</ul>
        <hr />
      </div>
    );
  }
}

export default ALlEmployeeDetails;
