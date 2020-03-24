import React, { Component, Fragment } from "react";
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
        <div className="result-item">
          <div key={record} style={{ display: "flex", flexDirection: "row" }}>
            <div className="cnt-result" style={{ flex: 1 }}>
              <div className="cnt-result-line">
                <span className="field-name">Name: </span>
                <span>{response[record]["name"]}</span>
              </div>
              <div className="cnt-result-line">
                <span className="field-name">Date: </span>
                <span>{response[record]["date"]}</span>
              </div>
              <div className="cnt-result-line">
                <span className="field-name">Arrival Time: </span>
                <span>{response[record]["arrival_time"]}</span>
              </div>
              <div className="cnt-result-line">
                <span className="field-name">Departure Time: </span>
                <span>{response[record]["departure_time"]}</span>
              </div>
            </div>
            {/* <div style={{ flex: 1 }}>
              <span>Arrival</span>
            <img
              src={require(response[record]["arrival_picture"])}
              alt="arrival picture"
            />
            <br />
            <span>Departure</span>
            <img
              src={response[record]["departure_picture"]}
              alt="departure picture"
            />
            </div> */}
          </div>
        </div>
      );
    });
  };

  render() {
    return (
      <div style={{ padding: "10px", paddingLeft: "30px" }}>
        <h2 className="title">Get last 'n' records</h2>
        <div className="cnt-form">
          <input
            className="input-box"
            style={{ marginRight: "8px" }}
            type="number"
            value={this.state.n}
            onChange={event => this.inputChangeListener(event)}
          />
          <button
            className="btn text-btn"
            style={{ marginLeft: "8px" }}
            onClick={this.handleRequest}
          >
            Fetch Details
          </button>
        </div>
        <div>{this.createList()}</div>
      </div>
    );
  }
}

export default RecentRecords;
