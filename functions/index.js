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

app.get("/phrasesToLearn", async (req, res) => {
  const limit = 10;
  const firestore = admin.firestore();

  const reviewsQuery = firestore
    .collection("userProgress")
    .where("uid", "==", req.decodedIdToken.uid);

  const reviewsSnapshot = await reviewsQuery
    .where("askAt", "<=", new Date())
    .get();

  const reviewPhrases = reviewsSnapshot.docs.map(doc => doc.get("phrase"));

  const progressSnapshot = await reviewsQuery.get();
  const progressPhrases = progressSnapshot.docs.map(doc => doc.get("phrase"));

  const phrasesSnapshot = await firestore.collection("phrases").get();
  const allPhrases = phrasesSnapshot.docs.map(doc => doc.data());

  const newPhrases = allPhrases.filter(
    phrase =>
      !progressPhrases.some(
        progress => progress.JP === phrase.JP && progress.PL === phrase.PL
      )
  );

  const phrasesToLearn = reviewPhrases.concat(newPhrases).slice(0, limit);

  res.send({
    data: phrasesToLearn,
    meta: { total: phrasesToLearn.length }
  });
});

exports.kotoba = functions.region("europe-west2").https.onRequest(app);

exports.onAnswer = functions
  .region("europe-west2")
  .firestore.document("answers/{answerId}")
  .onCreate(processAnswer);
