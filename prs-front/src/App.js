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
      response: ""
    };
    this.runPythonScript();
  }

  runPythonScript = () => {
    axios.get("http://127.0.0.1:5000/run_script").then(result => {
      console.log(result);
      this.setState({ response: result["data"]["message"] });
    });

    /* PythonShell.run(
      "./backend-scripts/facial_recognition.py",
      { mode: "text" },
      function(err) {
        if (err) throw err;
        console.log("finished");
      }
    ); */
  };

  render() {
    return (
      <div className="App">
        {this.state.response}
        {/* <EmployeeDetails /> */}
        {/* <AddEmployee /> */}
        {/* <ALlEmployeeDetails /> */}
        {/* <RecentRecords /> */}
        <DeleteEmployee />
      </div>
    );
  }
}

export default App;
