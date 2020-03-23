import React, { Component } from "react";
import "./App.css";
import EmployeeDetails from "./components/empDetails";
import AddEmployee from "./components/addEmp";
import ALlEmployeeDetails from "./components/allEmpDetails";
import RecentRecords from "./components/recentRecords";
import DeleteEmployee from "./components/deleteEmp";

import axios from "axios";
// import { PythonShell } from "python-shell";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: null
    };
    // this.runPythonScript();
    this.getVideoFeed();
  }

  runPythonScript = () => {
    axios.get("http://127.0.0.1:5000/run_script").then(result => {
      console.log(result);
      this.setState({ response: result["data"]["message"] });
    });
  };

  getVideoFeed = () => {
    fetch("http://127.0.0.1:5000/video_feed").then(res => {
      console.log(res);
      this.setState({ response: res["body"] });
      console.log(res["body"]);
    });
  };

  render() {
    return (
      <div className="App" style={{ margin: "2vh" }}>
        <div>
          <img
            src="http://127.0.0.1:5000/video_feed"
            height="360px"
            alt="Stream cannot be displayed"
          />
        </div>
        <EmployeeDetails />
        <AddEmployee />
        <ALlEmployeeDetails />
        <RecentRecords />
        <DeleteEmployee />
      </div>
    );
  }
}

export default App;
