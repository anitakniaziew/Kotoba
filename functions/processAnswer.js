const add = require("date-fns/add");

const LEVELS = [
  {
    intervalDuration: { minutes: 30 },
    expectedStreak: 5
  },
  {
    intervalDuration: { hours: 4 },
    expectedStreak: 5
  },
  {
    intervalDuration: { days: 2 },
    expectedStreak: 5
  },
  {
    intervalDuration: { weeks: 2 },
    expectedStreak: 5
  }
];

const findPhrase = async (phrasesCollection, answer) => {
  const matchingPhrases = await phrasesCollection
    .where(answer.language, "==", answer.question)
    .limit(1)
    .get();

  return matchingPhrases.empty ? null : matchingPhrases.docs[0];
};

const findUserProgress = async (progressCollection, phrase, answer) => {
  const matchingUserProgresses = await progressCollection
    .where("phrase." + answer.language, "==", phrase.get(answer.language))
    .where("uid", "==", answer.uid)
    .limit(1)
    .get();

  return matchingUserProgresses.empty ? null : matchingUserProgresses.docs[0];
};

const isCorrect = (phrase, answer) => {
  const targetLanguage = answer.language === "PL" ? "JP" : "PL";
  return phrase.get(targetLanguage) === answer.answer;
};

const processUserProgress = (userProgress, phrase, answer) => {
  const userProgressData = userProgress.data();
  const updatedProgress = Object.assign({}, userProgressData);

  if (isCorrect(phrase, answer)) {
    const { expectedStreak, intervalDuration } = LEVELS[userProgressData.level];
    updatedProgress.askAt = add(new Date(), intervalDuration);

    if (userProgressData.streak === expectedStreak) {
      updatedProgress.level = Math.min(
        LEVELS.length - 1,
        userProgressData.level + 1
      );
      updatedProgress.streak = 0;
    } else {
      updatedProgress.streak += 1;
    }
  } else {
    const lowerLevelIndex = Math.max(userProgressData.level - 1, 0);
    const lowerLevel = LEVELS[lowerLevelIndex];
    updatedProgress.level = newLevel;
    updatedProgress.streak = 0;
    updatedProgress.askAt = add(new Date(), lowerLevel.intervalDuration);
  }

  return updatedProgress;
};

const initializeUserProgress = (phrase, answer) => {
  const level = LEVELS[0];

  return {
    askAt: add(new Date(), level.intervalDuration),
    level: 0,
    phrase: phrase.data(),
    streak: isCorrect(phrase, answer) ? 1 : 0,
    uid: answer.uid
  };
};

module.exports = firebaseAdmin => async (snapshot, context) => {
  const firestore = firebaseAdmin.firestore();
  const phrasesCollection = firestore.collection("phrases");
  const progressCollection = firestore.collection("userProgress");
  const answer = snapshot.data();
  const phrase = await findPhrase(phrasesCollection, answer);

  if (phrase) {
    const userProgress = await findUserProgress(
      progressCollection,
      phrase,
      answer
    );

    if (userProgress) {
      const updatedUserProgress = processUserProgress(
        userProgress,
        phrase,
        answer
      );

      await progressCollection.doc(userProgress.id).update(updatedUserProgress);
    } else {
      const initialUserProgress = initializeUserProgress(phrase, answer);
      await progressCollection.add(initialUserProgress);
    }
  }

  await snapshot.ref.delete();
};
