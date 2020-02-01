import React from 'react';
import './App.css';

import dict from "./dict"

function drawWord(){
  const index = Math.floor(Math.random()*dict.length);
  return dict[index];
}

let currentWord = drawWord()


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answer: ""
    }
    this.handleChange = this.handleChange.bind(this);
    this.compareValue = this.compareValue.bind(this)
  }

  handleChange(event) {
    this.setState({answer: event.target.value});
  }

  compareValue() {
    this.state.answer === currentWord.JP ? 
      console.log("Y") :
      console.log("N")
  }

  render () {
    return (
      <div className="App">
        <p>{currentWord.PL}</p>
        <input id="userAnswer" type="text" onChange={this.handleChange}></input>
        <button onClick={this.compareValue}>ZATWIERDŹ</button>
      </div>
    );
  }

}

export default App;
