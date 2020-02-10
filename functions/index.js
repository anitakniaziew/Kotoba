const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

admin.initializeApp();

exports.phrasesToLearn = functions.region('europe-west2').https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    const snapshot = await admin.firestore().collection('phrases').get();
    const phrases = snapshot.docs.map(doc => doc.data());

    res.send({
      data: phrases,
      meta: {total: phrases.length}
    });
  });
});

