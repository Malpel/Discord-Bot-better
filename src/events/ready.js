const { initializeApplicationContext } = require("../util");

const execute = (client) => {
  initializeApplicationContext(client);
  console.log(`Logged in as ${client.user.tag}!`);
};

module.exports = {
  name: "ready",
  once: true,
  execute,
};
