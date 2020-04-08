import React from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import Loader from "./Loader";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      beingLearned: null,
      toReview: null,
      toLearn: null,
      isLoading: true
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
          toLearn: response.data.phrasesToLearn,
          isLoading: false
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
          <Loader isLoading={this.state.isLoading}>
            <h1 className={styles.greater}>
              Cześć, {this.props.currentUser.displayName}!
            </h1>
            <table>
              <tr>
                <td>Słówka do powtórzenia</td>
                <td className={styles.num}>{this.state.toReview}</td>
              </tr>
              <tr>
                <td>Słówka nauczone</td>
                <td className={styles.num}>{this.state.beingLearned}</td>
              </tr>
              <tr>
                <td>Słówka do nauki</td>
                <td className={styles.num}>{this.state.toLearn}</td>
              </tr>
            </table>
          </Loader>
        </main>
      </div>
    );
  }
}

export default Home;
