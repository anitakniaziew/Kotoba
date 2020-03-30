const express = require("express");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");

admin.initializeApp();

const authorization = require("./authorization")(admin);
const validation = require("./validation");
const processAnswer = require("./processAnswer")(admin);

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(authorization);
app.use(validation);

app.post("/answers", async (req, res) => {
  const collection = admin.firestore().collection("answers");

  await Promise.all(
    req.body.data.map(async answer => {
      await collection.add(
        Object.assign({}, answer, { uid: req.decodedIdToken.uid })
      );
    })
  );

  res.sendStatus(202);
});

app.post("/phrases", async (req, res) => {
  const collection = admin.firestore().collection("phrases");

  await Promise.all(
    req.body.data.map(async phrase => {
      const snapshot = await collection
        .where("JP", "==", phrase.JP)
        .where("PL", "==", phrase.PL)
        .get();

      if (snapshot.empty) {
        await collection.add(phrase);
      }
    })
  );

  res.sendStatus(201);
});

const fetchPhrases = async uid => {
  const firestore = admin.firestore();

  const userProgressSnapshot = await firestore
    .collection("userProgress")
    .where("uid", "==", uid)
    .get();

  const phrasesBeingLearned = userProgressSnapshot.docs.map(doc =>
    doc.get("phrase")
  );

  const phrasesToReview = userProgressSnapshot.docs
    .filter(doc => doc.get("askAt") < new Date())
    .map(doc => doc.get("phrase"));

  const phrasesSnapshot = await firestore.collection("phrases").get();
  const allPhrases = phrasesSnapshot.docs.map(doc => doc.data());

  const phrasesToLearn = allPhrases.filter(
    phrase =>
      !phrasesBeingLearned.some(
        progress => progress.JP === phrase.JP && progress.PL === phrase.PL
      )
  );

  return {
    phrasesBeingLearned,
    phrasesToReview,
    phrasesToLearn
  };
};

const LIMIT = 10;

app.get("/phrasesToLearn", async (req, res) => {
  const { phrasesToLearn } = await fetchPhrases(req.decodedIdToken.uid);
  const learningBatch = phrasesToLearn.slice(0, LIMIT);

  res.send({
    data: learningBatch,
    meta: { total: learningBatch.length }
  });
});

app.get("/phrasesToReview", async (req, res) => {
  const { phrasesToReview } = await fetchPhrases(req.decodedIdToken.uid);
  const learningBatch = phrasesToReview.slice(0, LIMIT);

  res.send({
    data: learningBatch,
    meta: { total: learningBatch.length }
  });
});

app.get("/phrasesCount", async (req, res) => {
  const {
    phrasesBeingLearned,
    phrasesToReview,
    phrasesToLearn
  } = await fetchPhrases(req.decodedIdToken.uid);

  res.send({
    data: {
      phrasesBeingLearned: phrasesBeingLearned.length,
      phrasesToReview: phrasesToReview.length,
      phrasesToLearn: phrasesToLearn.length
    }
  });
});

exports.kotoba = functions.region("europe-west2").https.onRequest(app);

exports.onAnswer = functions
  .region("europe-west2")
  .firestore.document("answers/{answerId}")
  .onCreate(processAnswer);
