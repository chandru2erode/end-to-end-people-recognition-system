import React, { Component } from "react";
import axios from "axios";

class DeleteEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emp_name: "",
      response: ""
    };
  }

  handleRequest = () => {
    axios
      .get("http://127.0.0.1:5000/delete_employee", {
        params: { name: this.state.emp_name }
      })
      .then(result => {
        console.log(result);
        if (result["status"] >= 200 && result["status"] < 300) {
          // Successful response
          this.setState({ response: result["data"]["message"] });
        } else {
          // Some error (Client side or server side)
          this.setState({ response: result["statusText"] });
        }
      })
      .catch(error => console.log(error));
  };

  inputChangeListener = event => {
    const { name, value } = event.target;
    this.setState({ emp_name: value });
  };

  render() {
    return (
      <div>
        <input
          type="text"
          name="name"
          value={this.state.emp_name}
          onChange={event => this.inputChangeListener(event)}
        />
        <input type="button" value="Delete" onClick={this.handleRequest} />
        <br />
        {this.state.response}
      </div>
    );
  }
}

export default DeleteEmployee;
