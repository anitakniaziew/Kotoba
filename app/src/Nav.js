import React from "react";
import { Link } from "react-router-dom";
import styles from "./Nav.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBook,
  faUserGraduate,
  faBookReader,
  faDoorOpen
} from "@fortawesome/free-solid-svg-icons";

class Nav extends React.Component {
  render() {
    return (
      <nav>
        <Link to="/">
          <FontAwesomeIcon className={styles.icon} icon={faHome} size="2x" />
          <h1 className={styles.navButton}>Start</h1>
        </Link>
        <Link to="/learn">
          <FontAwesomeIcon
            className={styles.icon}
            icon={faUserGraduate}
            size="2x"
          />
          <h1 className={styles.navButton}>Ucz się</h1>
        </Link>
        <Link to="/review">
          <FontAwesomeIcon
            className={styles.icon}
            icon={faBookReader}
            size="2x"
          />
          <h1 className={styles.navButton}>Powtarzaj</h1>
        </Link>
        <Link to="/admin">
          <FontAwesomeIcon className={styles.icon} icon={faBook} size="2x" />
          <h1 className={styles.navButton}>Dodaj słowa</h1>
        </Link>
        <button className={styles.logOut} onClick={() => this.props.signOut()}>
          <FontAwesomeIcon
            className={styles.icon}
            icon={faDoorOpen}
            size="2x"
          />
          <h1 className={styles.navButton}>Wyloguj</h1>
        </button>
      </nav>
    );
  }
}

export default Nav;
