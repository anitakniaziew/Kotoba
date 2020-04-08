import React from "react";

export default class LearnForm extends React.Component {
  render() {
    return !this.props.currentWord ? (
      <p className="currentWord">Nie masz nic do nauki</p>
    ) : (
      this.props.children
    );
  }
}
