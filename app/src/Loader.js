import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default class Loading extends React.Component {
  render() {
    return this.props.isLoading ? (
      <FontAwesomeIcon icon={faSpinner} size="3x" pulse />
    ) : (
      this.props.children
    );
  }
}
