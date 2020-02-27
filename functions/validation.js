const Ajv = require("ajv");
const schemas = require("./schemas");

module.exports = async (req, res, next) => {
  const schemaName = [
    req.method.toLowerCase(),
    req.path.replace(/[^a-zA-Z]/g, "")
  ].join("-");

  const schema = schemas[`${schemaName}.json`];

  if (schema) {
    const ajv = new Ajv();
    const valid = ajv.validate(schema, req.body);

    if (!valid) {
      res.status(422).send({ errors: ajv.errors });
      return;
    }
  }

  next();
};
