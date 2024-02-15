const dotenv = require("dotenv");
dotenv.config();

const getEnv = (database) => ({
  client: "postgresql",
  connection: database,
});

module.exports = {
  local: getEnv(process.env.DB_URL),
  development: getEnv(process.env.DB_URL),
  test: getEnv(process.env.DB_URL),
};
