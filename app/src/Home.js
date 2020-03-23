import React from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";

class Home extends React.Component {
  render() {
    return (
      <div className={styles.home}>
        <div>
          <h1>Cześć!</h1>
        </div>
        <nav>
          <button>
            <Link to="/learn">Ucz się</Link>
          </button>
          <button>
            <Link to="/admin">Dodaj słowa</Link>
          </button>
        </nav>
      </div>
    );
  }
}

export default Home;
