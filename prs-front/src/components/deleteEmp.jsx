import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { withSnackbar } from "notistack";

class DeleteEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emp_name: ""
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
          this.props.enqueueSnackbar(result["data"]["message"], {
            variant: "success"
          });
        } else {
          // Some error (Client side or server side)
          this.props.enqueueSnackbar(result["data"]["statusText"], {
            variant: "error"
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

  inputChangeListener = event => {
    const { name, value } = event.target;
    this.setState({ emp_name: value });
  };

  render() {
    return (
      <div className="card">
        <h2>Delete Employee</h2>
        <div className="cnt-input">
          <input
            className="input-box"
            type="text"
            name="name"
            value={this.state.emp_name}
            placeholder="liam"
            onChange={event => this.inputChangeListener(event)}
          />
          <button
            className="btn text-btn card-btn red-btn"
            onClick={this.handleRequest}
          >
            Delete
          </button>
        </div>
        <br />
        <br />
        <hr />
      </div>
    );
  }
}

DeleteEmployee.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired
};

export default withSnackbar(DeleteEmployee);
