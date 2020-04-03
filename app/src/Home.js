import React from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      beingLearned: null,
      toReview: null,
      toLearn: null
    };
  }
  async phrasesToReview() {
    const idToken = await this.props.currentUser.getIdToken();

    fetch(
      "https://europe-west2-kotoba-c36b8.cloudfunctions.net/kotoba/phrasesCount",
      {
        headers: {
          Authorization: "Bearer " + idToken
        }
      }
    )
      .then(response => response.json())
      .then(response => {
        this.setState({
          toReview: response.data.phrasesToReview,
          beingLearned: response.data.phrasesBeingLearned,
          toLearn: response.data.phrasesToLearn
        });
      })
      .catch(err => console.log(err));
  }

  componentDidMount() {
    this.phrasesToReview();
  }

  render() {
    return (
      <div className="wrapper">
        <main className={styles.main}>
          <h1 className={styles.greater}>
            Cześć, {this.props.currentUser.displayName}!
          </h1>
          <table>
            <tr>
              <td>Słówka do powtórzenia</td>
              <Link to="/review">
                <td className={styles.num}>{this.state.toReview}</td>
              </Link>
            </tr>
            <tr>
              <td>Słówka nauczone</td>
              <td className={styles.num}>{this.state.beingLearned}</td>
            </tr>
            <tr>
              <td>Słówka do nauki</td>
              <Link to="/learn">
                <td className={styles.num}>{this.state.toLearn}</td>
              </Link>
            </tr>
          </table>
        </main>
      </div>
    );
  }
}

export default Home;
