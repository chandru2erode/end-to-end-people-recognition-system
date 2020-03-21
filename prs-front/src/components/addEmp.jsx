import React, { Component } from "react";
import axios from "axios";

export default class AddEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emp_name: "",
      imageFile: null,
      isSuccess: false,
      responseString: ""
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
        this.setState({
          responseString: result["data"]["message"],
          isSuccess: true
        });
        console.log(result);
      })
      .catch(error => console.log(error));

    console.log(this.state.responseString);
  };

  render() {
    if (this.state.isSuccess) {
      var component = <div>{this.state.responseString}</div>;
    }

    return (
      <div>
        <input
          type="text"
          name="name"
          value={this.state.emp_name}
          onChange={event => this.inputChangeListener(event)}
        />
        <input
          type="file"
          name="image"
          onChange={event => this.fileChangeListener(event)}
        />
        <input type="button" value="Add" onClick={this.handleRequest} />
        {component}
      </div>
    );
  }
}
