const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });
const Ajv = require("ajv");
const schemas = require("./schemas");

const https = functions.region("europe-west2").https;

admin.initializeApp();

exports.phrasesToLearn = https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
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
});

exports.phrases = https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    if (req.method === "POST") {
      const ajv = new Ajv();
      const valid = ajv.validate(schemas["post-phrases.json"], req.body);

      if (!valid) {
        res.status(422).send({ errors: ajv.errors });
      } else {
        const collection = admin.firestore().collection("phrases");

        await Promise.all(
          req.body.data.map(async phrase => {
            const snapshot = await collection
              .where("JP", "==", phrase.JP)
              .where("PL", "==", phrase.PL)
              .get();

            if (snapshot.empty) {
              collection.add(phrase);
            }
          })
        );

        res.sendStatus(201);
      }
    } else {
      res.sendStatus(404);
    }
  });
});
