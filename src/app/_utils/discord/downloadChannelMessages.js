require("@dotenvx/dotenvx").config({
  path: `${__dirname}/../../../../.env.local`,
});
const fs = require("fs");
const { MESSAGES_DIR } = require("./config");
const { writeFilesFromData } = require("./splitMessages");

const downloadChannelMessages = async ({
  channel,
  before = null,
  limit = 100,
  options,
}) => {
  let messagesAll = await getMessagesBefore({
    channel,
    before,
    limit,
    options,
  });

  if (messagesAll.length) {
    const last = messagesAll[messagesAll.length - 1];
    console.log(`Downloading ${limit} messages before ${last.id}`);

    const latestMessages = await downloadChannelMessages({
      channel,
      before: last.id,
      limit,
      options,
    });

    messagesAll = messagesAll.concat(latestMessages);
  }

  return messagesAll;
};

const getMessagesBefore = async ({
  channel,
  before = null,
  limit = 100,
  options,
}) => {
  let url = `https://discord.com/api/v9/channels/${channel}/messages?limit=${limit}`;

  if (before) {
    url = `${url}&before=${before}`;
  }

  const response = await fetch(url, options);
  const data = await response.json();

  // message data is returned in descending date order (latest to first)

  return data.map((item) => {
    const {
      id,
      author,
      attachments,
      content,
      timestamp,
      edited_timestamp,
      call,
      message_reference,
      sticker_items,
      embeds,
      reactions,
    } = item;
    return {
      id,
      author,
      attachments,
      content,
      timestamp,
      edited_timestamp,
      call,
      message_reference,
      sticker_items,
      embeds,
      reactions,
    };
  });
};

async function run() {
  const [, , ...args] = process.argv;

  const argsMaps = new Map(args.map((arg) => arg.split("=")));
  const channel = argsMaps.get("channel");
  const target = argsMaps.get("target") || channel;
  const skip = argsMaps.has("skip"); // skip saving all messages to one file

  if (!channel) {
    console.error("\x1b[31mError: Specify a channel", "\n\x1b[0m");
    return;
  }

  const messages = await downloadChannelMessages({
    channel,
    options: {
      headers: {
        accept: "*/*",
        "accept-language": "en-GB,en-AU;q=0.9,en-US;q=0.8,en;q=0.7,th;q=0.6",
        authorization: process.env.DISCORD_AUTHORIZATION,
        "cache-control": "no-cache",
        pragma: "no-cache",
        "sec-ch-ua":
          '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-debug-options": "bugReporterEnabled",
        "x-discord-locale": "en-GB",
        "x-discord-timezone": "Asia/Bangkok",
        "x-super-properties": process.env.DISCORD_TOKEN,
      },
      referrer: process.env.DISCORD_REFERRER,
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "GET",
      mode: "cors",
      credentials: "include",
    },
  });

  if (!skip) {
    try {
      fs.writeFileSync(
        `${MESSAGES_DIR}/${target}.json`,
        JSON.stringify(messages)
      );

      console.log(`Saved to file '${target}.json'`);
    } catch (e) {
      console.log(e.message);
      return;
    }
  }

  const data = messages.reverse();

  writeFilesFromData({ data, target });
}

run();

// node downloadChannelMessages channel= [target=] [skip]
