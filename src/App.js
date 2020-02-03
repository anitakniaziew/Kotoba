import React from "react";
import "./App.css";

import dict from "./dict";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.wordsList = [...dict];
    this.state = {
      lang: "PL",
      answer: "",
      currentWord: this.drawWord()
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.compareValue = this.compareValue.bind(this);
    this.toggleLang = this.toggleLang.bind(this);
  }

  drawWord() {
    const index = Math.floor(Math.random() * this.wordsList.length);
    let [word] = this.wordsList.splice(index, 1);
    return word;
  }

  handleChange(event) {
    this.setState({ answer: event.target.value });
  }

  handleKeyPress(event) {
    if (event.key === "Enter") {
      this.compareValue();
    }
  }

  endList() {
    return this.wordsList.length === 0;
  }

  compareValue() {
    if (this.endList()) {
      console.log("There is no more words to learn");
    } else {
      this.state.answer === this.state.currentWord.JP
        ? console.log("Y")
        : console.log("N");
      this.drawNext();
    }
  }

  drawNext() {
    this.setState({
      answer: "",
      currentWord: this.drawWord()
    });
  }

  toggleLang() {
    this.state.lang === "PL"
      ? this.setState({ lang: "JP" })
      : this.setState({ lang: "PL" });
  }

  render() {
    return (
      <div className="App">
        <button className="lang" onClick={this.toggleLang}>
          {this.state.lang}
        </button>
        <p>{this.state.currentWord[this.state.lang]}</p>
        <input
          id="userAnswer"
          value={this.state.answer}
          type="text"
          autoComplete="off"
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
        />
        <button onClick={this.compareValue}>ZATWIERDŹ</button>
      </div>
    );
  }
}

export default App;
