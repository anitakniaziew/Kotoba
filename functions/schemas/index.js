const path = require("path");
const fs = require("fs");

const files = fs.readdirSync(__dirname);
const schemaFiles = files.filter(file => file.endsWith(".json"));
const schemas = schemaFiles.reduce((acc, file) => {
  acc[file] = JSON.parse(
    fs.readFileSync(path.join(__dirname, file), { encoding: "utf8" })
  );
  return acc;
}, {});

module.exports = schemas;
