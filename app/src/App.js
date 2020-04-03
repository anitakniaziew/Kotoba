import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Learn from "./Learn";
import Home from "./Home";
import Admin from "./Admin";
import Nav from "./Nav";
import styles from "./App.module.css";

import { StyledFirebaseAuth } from "react-firebaseui";
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBMIXdcFo2Vh39JEqlKLG3HCmu6IaPEsjA",
  authDomain: "kotoba-c36b8.firebaseapp.com",
  databaseURL: "https://kotoba-c36b8.firebaseio.com",
  projectId: "kotoba-c36b8",
  storageBucket: "kotoba-c36b8.appspot.com",
  messagingSenderId: "485785121406",
  appId: "1:485785121406:web:f5000dfHomeab142db5db25e2f",
  measurementId: "G-PPJSE9HPG5"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: firebase.auth().currentUser
    };
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
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
      this.setState({ currentUser: user });
    });
  }

  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  render() {
    return this.state.currentUser ? (
      <Router>
        <div className={styles.app}>
          <Switch>
            <Route exact path="/">
              <Home currentUser={this.state.currentUser} />
            </Route>
            <Route path="/learn" key="learn">
              <Learn
                currentUser={this.state.currentUser}
                phraseCollection="phrasesToLearn"
              />
            </Route>
            <Route path="/review" key="review">
              <Learn
                currentUser={this.state.currentUser}
                phraseCollection="phrasesToReview"
              />
            </Route>
            <Route path="/admin">
              <Admin currentUser={this.state.currentUser} />
            </Route>
          </Switch>
          <Nav signOut={() => firebase.auth().signOut()} />
        </div>
      </Router>
    ) : (
      <StyledFirebaseAuth
        uiConfig={this.uiConfig}
        firebaseAuth={firebase.auth()}
      />
    );
  }
}
