import React from "react";
import styles from "./Admin.module.css";
import Hiragana from "./hiragana";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.jpInputRef = React.createRef();
    this.dict = [];
    this.state = {
      inputDisabled: false,
      inputErr: false,
      JP: "",
      PL: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.addWords = this.addWords.bind(this);
    this.handleKeyEvent = this.handleKeyEvent.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const name = target.name;
    let value = target.value;
    if (name === "JP") {
      Hiragana.forEach(pair => {
        value = value.replace(pair[0], pair[1]);
      });
    }
    this.setState({ [name]: value, inputErr: false });
  }

  handleKeyEvent(event) {
    if (event.key === "Enter") {
      this.addWords();
    }
  }

  async addWords() {
    this.setState({
      inputDisabled: true
    });
    const { JP, PL } = this.state;
    const data = JSON.stringify({
      data: [
        {
          JP,
          PL
        }
      ]
    });
    const idToken = await this.props.currentUser.getIdToken();
    const res = await fetch(
      "https://europe-west2-kotoba-c36b8.cloudfunctions.net/kotoba/phrases",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          Authorization: "Bearer " + idToken
        },

        body: data
      }
    );

    this.setState({
      inputDisabled: false,
      JP: "",
      PL: ""
    });

    if (!res.ok) {
      this.setState({
        inputErr: true
      });
    }

    this.jpInputRef.current.focus();
  }

  render() {
    return (
      <div className={styles.app}>
        <div className={styles.form}>
          <div className={styles.formInputs}>
            <input
              className={this.state.inputErr ? styles.error : null}
              name="JP"
              placeholder="JP"
              value={this.state.JP}
              onChange={this.handleChange}
              disabled={this.state.inputDisabled}
              autoComplete="off"
              autoFocus={true}
              ref={this.jpInputRef}
              onKeyDown={this.handleKeyEvent}
            />
            <input
              className={this.state.inputErr ? styles.error : null}
              name="PL"
              placeholder="PL"
              value={this.state.PL}
              onChange={this.handleChange}
              disabled={this.state.inputDisabled}
              autoComplete="off"
              onKeyDown={this.handleKeyEvent}
            />
          </div>
          <button
            className={styles.add}
            onClick={this.addWords}
            disabled={this.state.inputDisabled}
          >
            Dodaj słowa
          </button>
        </div>
      </div>
    );
  }
}

export default App;
