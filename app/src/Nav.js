import React from "react";
import { Link } from "react-router-dom";
import styles from "./Nav.module.css";
import homeIcon from "./home.svg";
import learnIcon from "./learn.svg";
import adminIcon from "./book.svg";
import doorIcon from "./door.svg";

class Nav extends React.Component {
  render() {
    return (
      <nav>
        <Link to="/">
          {/* <div>
            Icons made by{" "}
            <a href="https://www.flaticon.com/authors/freepik" title="Freepik">
              Freepik
            </a>{" "}
            from{" "}
            <a href="https://www.flaticon.com/" title="Flaticon">
              www.flaticon.com
            </a>
          </div> */}
          <img src={homeIcon} alt="home" />
          <h1 className={styles.navButton}>Start</h1>
        </Link>
        <Link to="/learn">
          {/*<div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>*/}
          <img src={learnIcon} alt="learn" />
          <h1 className={styles.navButton}>Ucz się</h1>
        </Link>
        <Link to="/admin">
          {/* <div>Icons made by <a href="https://www.flaticon.com/authors/good-ware" title="Good Ware">Good Ware</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div> */}
          <img src={adminIcon} alt="admin" />
          <h1 className={styles.navButton}>Dodaj słowa</h1>
        </Link>
        <button className={styles.logOut} onClick={() => this.props.signOut()}>
          <img src={doorIcon} alt="logOut" />
          <h1 className={styles.navButton}>Wyloguj</h1>
          {/* <div>
            Icons made by{" "}
            <a
              href="https://www.flaticon.com/authors/good-ware"
              title="Good Ware"
            >
              Good Ware
            </a>{" "}
            from{" "}
            <a href="https://www.flaticon.com/" title="Flaticon">
              www.flaticon.com
            </a>
          </div> */}
        </button>
      </nav>
    );
  }
}

export default Nav;
