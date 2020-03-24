import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { withSnackbar } from "notistack";

class AddEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emp_name: "",
      imageFile: null
    };
  }

  inputChangeListener = event => {
    const { name, value } = event.target;
    this.setState({ emp_name: value });
  };

  fileChangeListener = event => {
    console.log(event.target.files[0]);
    this.setState({ imageFile: event.target.files[0] });
  };

  handleRequest = () => {
    const data = new FormData();
    data.append("image", this.state.imageFile);
    data.append("nameOfEmployee", this.state.emp_name);

    // var success_string =
    //   "New employee " + this.state.emp_name + " succesfully added";

    axios
      .post("http://127.0.0.1:5000/add_employee", data, {})
      .then(result => {
        this.props.enqueueSnackbar(result["data"]["message"]);
        console.log(result);
      })
      .catch(error => {
        console.log(error);
        this.props.enqueueSnackbar(error);
      });

    console.log(this.state.responseString);
  };

  render() {
    return (
      <div className="card">
        <h2>Add Employee</h2>
        <div className="cnt-input">
          <input
            className="input-box"
            type="text"
            name="name"
            value={this.state.emp_name}
            onChange={event => this.inputChangeListener(event)}
          />
          <input
            style={{ fontSize: "0.8rem" }}
            type="file"
            name="image"
            onChange={event => this.fileChangeListener(event)}
          />

          <button
            className="btn text-btn card-btn"
            onClick={this.handleRequest}
          >
            Add
          </button>
        </div>
        <br />
        <br />
        <hr />
      </div>
    );
  }
}

AddEmployee.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired
};

export default withSnackbar(AddEmployee);
