require("@dotenvx/dotenvx").config({
  path: `${__dirname}/../../../../.env.local`,
});

module.exports = {
  MESSAGES_DIR: `${__dirname}/../../_messages`,
};
