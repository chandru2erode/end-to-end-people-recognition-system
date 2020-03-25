import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import { withSnackbar } from "notistack";

import { faRedoAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
        this.props.enqueueSnackbar("Results reloaded!", { variant: "success" });
      })
      .catch(error => {
        console.log(error);
        this.props.enqueueSnackbar("Looks like Network Error", {
          variant: "error"
        });
      });
  };

  createList = () => {
    var row = 1,
      column = 0;
    return Object.keys(this.state.response).map(key => {
      column = column + 1;
      if (column == 4) {
        row = row + 1;
        column = 1;
      }
      // let photo_path = "file://" + this.state.response[key]["photo_path"];
      /* let photo_path =
        "../../../" +
        this.state.response[key]["photo_path"].split(
          "end-to-end-people-recognition-system/"
        )[1]; */
      // var image = require(this.state.response[key]["photo_path"]);
      return (
        <div
          className="grid-item"
          key={key}
          style={{ gridColumn: column, gridRow: row }}
        >
          {this.state.response[key]["name"]}
        </div>
      );
    });
  };

  render() {
    return (
      <div>
        <div className="cnt-head">
          <h2>List of all employees</h2>
          <button className="btn icon-btn" onClick={this.handleRequest}>
            <FontAwesomeIcon
              icon={faRedoAlt}
              color="rgb(3, 167, 39)"
              size="2x"
            />
          </button>
        </div>
        <div className="cnt-grid">{this.createList()}</div>
      </div>
    );
  }
}

ALlEmployeeDetails.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired
};

export default withSnackbar(ALlEmployeeDetails);
