import React from 'react';
import './App.css';

import dict from "./dict"

class App extends React.Component {
  constructor(props) {
    super(props);
    this.wordsList = [...dict]
    this.state = {
      answer: "",
      currentWord: this.drawWord()
    }
    this.handleChange = this.handleChange.bind(this);
    this.compareValue = this.compareValue.bind(this)
  }

  drawWord() {
    const index = Math.floor(Math.random()*this.wordsList.length)
    let [word] = this.wordsList.splice(index, 1)
    return word
  }

  handleChange(event) {
    this.setState({answer: event.target.value});
  }

  endList() {
    return (this.wordsList.length === 0);
  }

  compareValue() {
    if (this.endList()) {
      console.log("There is no more words to learn")
    } else {
      this.state.answer === this.state.currentWord.JP ? 
      console.log("Y") :
      console.log("N");
    this.drawNext()
    }
  }

  drawNext() {
    this.setState({
      answer: "",
      currentWord: this.drawWord()
    })
  }

  render () {
    return (
      <div className="App">
        <p>{this.state.currentWord.PL}</p>
        <input id="userAnswer" value={this.state.answer} type="text" onChange={this.handleChange}></input>
        <button onClick={this.compareValue}>ZATWIERDŹ</button>
      </div>
    );
  }
}

export default App;
