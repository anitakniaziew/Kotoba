const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.phrases = functions.region('europe-west2').https.onRequest(async (req, res) => {
  const snapshot = await admin.firestore().collection('phrases').get();
  const phrases = snapshot.docs.map(doc => doc.data());

  res.send({
    data: phrases,
    meta: {total: phrases.length}
  });
});

