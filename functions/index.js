const express = require("express");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");

admin.initializeApp();

const authorization = require("./authorization")(admin);
const validation = require("./validation");

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
  const snapshot = await admin
    .firestore()
    .collection("phrases")
    .get();
  const phrases = snapshot.docs.map(doc => doc.data());

  res.send({
    data: phrases,
    meta: { total: phrases.length }
  });
});

exports.kotoba = functions.region("europe-west2").https.onRequest(app);
