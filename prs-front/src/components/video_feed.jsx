import React, { Component } from "react";
import PropTypes from "prop-types";

import "../App.css";

import { withSnackbar } from "notistack";

class VideoFeed extends Component {
  constructor(props) {
    super(props);
    this.requestVideoStream();
  }

  requestVideoStream = () => {
    fetch("http://127.0.0.1:5000/video_feed")
      .then(res => {
        this.props.enqueueSnackbar("Video Stream successful!", {
          variant: "success"
        });
      })
      .catch(error => {
        this.props.enqueueSnackbar("Looks like Network Error", {
          variant: "error"
        });
      });
  };

  render() {
    return (
      <div className="cmpnt">
        <img
          src="http://127.0.0.1:5000/video_feed"
          alt="Stream cannot be displayed"
          style={{ height: "58vh" }}
        />
      </div>
    );
  }
}

VideoFeed.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired
};

export default withSnackbar(VideoFeed);
