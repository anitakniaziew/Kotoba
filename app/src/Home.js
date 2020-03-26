import React from "react";
import styles from "./Home.module.css";

class Home extends React.Component {
  render() {
    return (
      <div className={styles.home}>
        <main>
          <h1>Witaj, w Kotoba</h1>
          <p>Pozostało Ci 0 słów do nauki</p>
        </main>
      </div>
    );
  }
}

export default Home;
