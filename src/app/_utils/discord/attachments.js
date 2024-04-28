const downloadAttachments = require("./downloadAttachments");

function run() {
  const [, , ...args] = process.argv;
  const argsMaps = new Map(args.map((arg) => arg.split("=")));
  const channel = argsMaps.get("channel");
  const target = argsMaps.get("target");

  downloadAttachments({ channel, target });
}

run();

// node attachments [channel=] [target=]
