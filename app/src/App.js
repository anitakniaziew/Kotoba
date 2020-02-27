import React from "react";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.wordsList = [];
    this.state = {
      lang: "PL",
      answerLang: "JP",
      answer: "",
      currentWord: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.compareValue = this.compareValue.bind(this);
    this.toggleLang = this.toggleLang.bind(this);
  }

  loadWords() {
    fetch(
      "https://europe-west2-kotoba-c36b8.cloudfunctions.net/kotoba/phrasesToLearn"
    )
      .then(response => response.json())
      .then(response => {
        this.wordsList = response.data;
        this.setState({
          currentWord: this.drawWord()
        });
      })
      .catch(err => console.log(err));
  }

  componentDidMount() {
    this.loadWords();
  }

  drawWord() {
    if (this.endList()) this.loadWords();
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
    this.state.answer === this.state.currentWord[this.state.answerLang]
      ? console.log("Y")
      : console.log("N");
    this.drawNext();
  }

  drawNext() {
    this.setState({
      answer: "",
      currentWord: this.drawWord()
    });
  }

  toggleLang() {
    this.state.lang === "PL"
      ? this.setState({ lang: "JP", answerLang: "PL" })
      : this.setState({ lang: "PL", answerLang: "JP" });
    this.drawNext();
    // document.getElementById("userAnswer").focus();
  }

  render() {
    return (
      <div className="App">
        <button className="lang" onClick={this.toggleLang}>
          {this.state.lang}
        </button>
        <p>
          {!this.state.currentWord
            ? "Loading word..."
            : this.state.currentWord[this.state.lang]}
        </p>
        <input
          autoFocus
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
