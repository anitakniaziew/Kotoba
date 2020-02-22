import React from "react";
import "./App.css";
import Inputs from "./Inputs";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.dict = [];
    this.state = {
      inputDisabled: false,
      JP: "",
      PL: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.addWords = this.addWords.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const name = target.name;
    this.setState({ [name]: target.value });
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
    await fetch(
      "https://europe-west2-kotoba-c36b8.cloudfunctions.net/phrases",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8"
        },
        body: data
      }
    );
    this.setState({
      inputDisabled: false,
      JP: "",
      PL: ""
    });
  }

  render() {
    return (
      <div className="App">
        <h1>Kotoba words</h1>
        <Inputs
          name="JP"
          placeholder="JP"
          value={this.state.JP}
          onChange={this.handleChange}
          disabled={this.state.inputDisabled}
        />
        <Inputs
          name="PL"
          placeholder="PL"
          value={this.state.PL}
          onChange={this.handleChange}
          disabled={this.state.inputDisabled}
        />
        <br />
        <button
          className="Add"
          onClick={this.addWords}
          disabled={this.state.inputDisabled}
        >
          Dodaj słowa
        </button>
      </div>
    );
  }
}

export default App;
