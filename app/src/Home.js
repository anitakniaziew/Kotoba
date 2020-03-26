import React from "react";
import styles from "./Home.module.css";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      beingLearned: null,
      toReview: null
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
          beingLearned: response.data.phrasesBeingLearned
        });
      })
      .catch(err => console.log(err));
  }

  componentDidMount() {
    this.phrasesToReview();
  }

  render() {
    return (
      <div className={styles.home}>
        <main>
          <h1>Cześć, {this.props.currentUser.displayName}!</h1>
          <p>Masz {this.state.toReview} słówek do powtórzenia.</p>
          <p>Nauczyłeś się juz {this.state.beingLearned} słów.</p>
        </main>
      </div>
    );
  }
}

export default Home;
