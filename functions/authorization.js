module.exports = firebaseAdmin => async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    res.sendStatus(401);
    return;
  }

  if (!header.startsWith("Bearer ")) {
    res.sendStatus(401);
    return;
  }

  const token = header.substring(7);

  try {
    req.decodedIdToken = await firebaseAdmin.auth().verifyIdToken(token);
  } catch (e) {
    res.sendStatus(401);
    console.log(e);
    return;
  }

  next();
};
