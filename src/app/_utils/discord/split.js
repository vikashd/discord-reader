const { split } = require("./splitMessages");

function run() {
  const [, , ...args] = process.argv;
  const argsMaps = new Map(args.map((arg) => arg.split("=")));
  const channel = argsMaps.get("channel");
  const target = argsMaps.get("target");
  const messagesPerPage = argsMaps.get("messages");

  split({ channel, target, messagesPerPage });
}

run();

// node splitMessages [channel=] [target=] [messagesPerPage=]
