const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true, credentials: true });
const Ajv = require("ajv");
const schemas = require("./schemas");

const https = functions.region("europe-west2").https;

admin.initializeApp();

const isUnauthorized = async authorizationHeader => {
  if (!authorizationHeader) return true;
  if (!authorizationHeader.startsWith("Bearer ")) return true;
  const token = authorizationHeader.substring(7);
  try {
    await admin.auth().verifyIdToken(token);
    return false;
  } catch (e) {
    return true;
  }
};

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
    if (req.method !== "POST") {
      res.sendStatus(404);
      return;
    }

    if (await isUnauthorized(req.headers.authorization)) {
      res.sendStatus(401);
      return;
    }

    const ajv = new Ajv();
    const valid = ajv.validate(schemas["post-phrases.json"], req.body);

    if (!valid) {
      res.status(422).send({ errors: ajv.errors });
      return;
    }

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
  });
});
