import React from "react";
import "./App.css";
import EmployeeDetails from "./components/empDetails";
import AddEmployee from "./components/addEmp";
import ALlEmployeeDetails from "./components/allEmpDetails";
import RecentRecords from "./components/recentRecords";

function App() {
  return (
    <div className="App">
      {/* <EmployeeDetails /> */}
      {/* <AddEmployee /> */}
      {/* <ALlEmployeeDetails /> */}
      <RecentRecords />
    </div>
  );
}

export default App;
