import React from "react";
import styles from "./Learn.module.css";
import Hiragana from "./hiragana";
import Loader from "./Loader";
import LearnForm from "./LearnForm";

class Learn extends React.Component {
  constructor(props) {
    super(props);
    this.wordsList = [];
    this.state = {
      lang: "PL",
      answerLang: "JP",
      answer: "",
      isLoading: false,
      currentWord: null,
      wrongAnswer: false,
      bottomButtonTxt: "sprawdź"
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.compareValue = this.compareValue.bind(this);
    this.sendUserAnswer = this.sendUserAnswer.bind(this);
    this.toggleLang = this.toggleLang.bind(this);
  }

  async maybeLoadWords() {
    this.setState({
      isLoading: true
    });

    const idToken = await this.props.currentUser.getIdToken();

    const url =
      "https://europe-west2-kotoba-c36b8.cloudfunctions.net/kotoba/" +
      this.props.phraseCollection;

    fetch(url, {
      headers: {
        Authorization: "Bearer " + idToken
      }
    })
      .then(response => response.json())
      .then(response => {
        this.wordsList = response.data;
        this.wordsList.length === 0
          ? this.setState({
              currentWord: null,
              isLoading: false
            })
          : this.setState({
              currentWord: this.drawWord(),
              isLoading: false
            });
      })
      .catch(err => console.log(err));
  }

  componentDidMount() {
    this.maybeLoadWords();
  }

  drawWord() {
    if (this.endList()) this.maybeLoadWords();
    const index = Math.floor(Math.random() * this.wordsList.length);
    let [word] = this.wordsList.splice(index, 1);
    return word;
  }

  handleChange(event) {
    let value = event.target.value;
    if (this.state.lang === "PL") {
      Hiragana.forEach(pair => {
        value = value.replace(pair[0], pair[1]);
      });
    }
    this.setState({ answer: value });
  }

  handleKeyPress(event) {
    if (event.key === "Enter" && this.state.bottomButtonTxt === "sprawdź") {
      this.compareValue();
      this.sendUserAnswer();
    } else if (this.state.bottomButtonTxt === "dalej") {
      this.drawNext();
    }
  }

  endList() {
    return this.wordsList.length === 0;
  }

  compareValue() {
    if (this.state.answer === this.state.currentWord[this.state.answerLang]) {
      this.drawNext();
    } else {
      this.setState({
        wrongAnswer: true,
        answer: this.state.currentWord[this.state.answerLang],
        bottomButtonTxt: "dalej"
      });
    }
  }

  async sendUserAnswer() {
    const data = JSON.stringify({
      data: [
        {
          question: this.state.currentWord[this.state.lang],
          answer: this.state.answer,
          language: this.state.lang
        }
      ]
    });

    const idToken = await this.props.currentUser.getIdToken();

    await fetch(
      "https://europe-west2-kotoba-c36b8.cloudfunctions.net/kotoba/answers",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          Authorization: "Bearer " + idToken
        },
        body: data
      }
    );
  }

  drawNext() {
    this.setState({
      answer: "",
      wrongAnswer: false,
      currentWord: this.drawWord(),
      bottomButtonTxt: "sprawdź"
    });
    document.querySelector("#userAnswer").focus();
  }

  toggleLang() {
    this.state.lang === "PL"
      ? this.setState({ lang: "JP", answerLang: "PL" })
      : this.setState({ lang: "PL", answerLang: "JP" });
    this.drawNext();
  }

  render() {
    return (
      <div className="wrapper">
        <Loader isLoading={this.state.isLoading}>
          <LearnForm currentWord={this.state.currentWord}>
            <button className={styles.lang} onClick={this.toggleLang}>
              {this.state.lang}
            </button>
            <p className="currentWord">
              {this.state.currentWord
                ? this.state.currentWord[this.state.lang]
                : null}
            </p>
            <input
              autoFocus
              id="userAnswer"
              value={this.state.answer}
              type="text"
              autoComplete="off"
              className={this.state.wrongAnswer ? styles.err : null}
              onChange={this.handleChange}
              onKeyPress={this.handleKeyPress}
            />
            <button className="mainButton" onClick={this.compareValue}>
              {this.state.bottomButtonTxt}
            </button>
          </LearnForm>
        </Loader>
      </div>
    );
  }
}

export default Learn;
