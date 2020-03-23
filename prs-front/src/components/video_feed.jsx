import React, { Component, Fragment } from "react";

import "../App.css";

export default class VideoFeed extends Component {
  render() {
    return (
      <div className="cmpnt">
        <img
          src="http://127.0.0.1:5000/video_feed"
          alt="Stream cannot be displayed"
          style={{ height: "48vh" }}
        />
      </div>
    );
  }
}
