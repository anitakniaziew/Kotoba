import React from "react";
import styles from "./Loader.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

class Loading extends React.Component {
  render() {
    return this.props.isLoading ? (
      <FontAwesomeIcon
        className={styles.spinner}
        icon={faSpinner}
        size={this.props.size}
        pulse
      />
    ) : (
      this.props.children
    );
  }
}

Loading.defaultProps = {
  size: "6x"
};

export default Loading;
