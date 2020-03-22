import React, { Component } from "react";
import axios from "axios";

class RecentRecords extends Component {
  constructor(props) {
    super(props);
    this.state = {
      n: 4,
      response: {}
    };
  }

  handleRequest = () => {
    axios
      .get("http://127.0.0.1:5000/get_n_last_entries", {
        params: {
          n: this.state.n
        }
      })
      .then(result => {
        console.log(result);
        this.setState({ response: result["data"] });
      })
      .catch(error => console.log(error));
  };

  inputChangeListener = event => {
    const { name, value } = event.target;
    this.setState({ n: value });
  };

  createList = () => {
    var response = this.state.response;
    return Object.keys(response).map(record => {
      /* let arrival_picture =
        "../../" +
        response[record]["arrival_picture"].split(
          "end-to-end-people-recognition-system/"
        )[1]; */
      return (
        <li key={record} style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ flex: 1 }}>
            <span>Name: {response[record]["name"]}</span>
            <br />
            <span>Date: {response[record]["date"]}</span>
            <br />
            <span>Arrival Time: {response[record]["arrival_time"]}</span>
            <br />
            <span>Departure Time: {response[record]["departure_time"]}</span>
            <br />
          </div>
          <div style={{ flex: 1 }}>
            {/* <span>Arrival</span>
            <img
              src={require(response[record]["arrival_picture"])}
              alt="arrival picture"
            />
            <br />
            <span>Departure</span>
            <img
              src={response[record]["departure_picture"]}
              alt="departure picture"
            /> */}
          </div>
        </li>
      );
    });
  };

  render() {
    return (
      <div>
        <div>
          <h2 className="title">Get last 'n' records</h2>
          <input
            type="number"
            value={this.state.n}
            onChange={event => this.inputChangeListener(event)}
          />
          <input
            type="button"
            value="Fetch Details"
            onClick={this.handleRequest}
          />
        </div>
        <div>
          <ol>{this.createList()}</ol>
        </div>
        <hr />
      </div>
    );
  }
}

export default RecentRecords;
