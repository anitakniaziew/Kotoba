import React from "react";
import { Link } from "react-router-dom";
import styles from "./Nav.module.css";

class Nav extends React.Component {
  render() {
    return (
      <nav>
        <Link to="/">Dom</Link>
        <Link to="/learn">Ucz się</Link>
        <Link to="/admin">Słownik</Link>
        <button className={styles.logOut} onClick={() => this.props.signOut()}>
          Wyloguj
        </button>
      </nav>
    );
  }
}

export default Nav;
