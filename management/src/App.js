import React from "react";
import "./App.css";
import Inputs from "./Inputs";
import { StyledFirebaseAuth } from "react-firebaseui";
import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBMIXdcFo2Vh39JEqlKLG3HCmu6IaPEsjA",
  authDomain: "kotoba-c36b8.firebaseapp.com",
  databaseURL: "https://kotoba-c36b8.firebaseio.com",
  projectId: "kotoba-c36b8",
  storageBucket: "kotoba-c36b8.appspot.com",
  messagingSenderId: "485785121406",
  appId: "1:485785121406:web:9ad87b02cfcac8a1b25e2f",
  measurementId: "G-0RRFFLCQRQ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.dict = [];
    this.state = {
      currentUser: firebase.auth().currentUser,
      inputDisabled: false,
      inputErr: false,
      JP: "",
      PL: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.addWords = this.addWords.bind(this);
    this.handleKeyEvent = this.handleKeyEvent.bind(this);
    this.uiConfig = {
      signInFlow: "popup",
      signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
      callbacks: {
        signInSuccessWithAuthResult: this.onLogIn.bind(this)
      }
    };
  }

  onLogIn(authResult) {
    this.setState({
      currentUser: authResult.user
    });
  }

  componentDidMount() {
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(user =>
      this.setState({
        currentUser: user
      })
    );
  }

  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  handleChange(event) {
    const target = event.target;
    const name = target.name;
    this.setState({ [name]: target.value, inputErr: false });
  }

  handleKeyEvent(event) {
    if (event.key === "Enter") this.addWords();
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
    const idToken = await this.state.currentUser.getIdToken();
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
  }

  render() {
    return (
      <div className="App">
        <button id="log-out" onClick={() => firebase.auth().signOut()}>
          Wyloguj
        </button>
        <header>Kotoba words</header>
        {!this.state.currentUser ? (
          <StyledFirebaseAuth
            uiConfig={this.uiConfig}
            firebaseAuth={firebase.auth()}
          />
        ) : (
          <div className="form">
            <div className="form-inputs">
              <Inputs
                className={this.state.inputErr ? "error" : null}
                name="JP"
                placeholder="JP"
                value={this.state.JP}
                onChange={this.handleChange}
                disabled={this.state.inputDisabled}
              />
              <Inputs
                className={this.state.inputErr ? "error" : null}
                name="PL"
                placeholder="PL"
                value={this.state.PL}
                onChange={this.handleChange}
                disabled={this.state.inputDisabled}
                onKeyDown={this.handleKeyEvent}
              />
            </div>
            <button
              className="Add"
              onClick={this.addWords}
              disabled={this.state.inputDisabled}
            >
              Dodaj słowa
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default App;
