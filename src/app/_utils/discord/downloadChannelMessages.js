const fs = require("fs");
const { MESSAGES_DIR } = require("./config");
const copyAttachments = require("./copyAttachments");
const downloadAttachments = require("./downloadAttachments");
const { writeFilesFromData } = require("./splitMessages");

const MAX_MESSAGES = 260000;

const downloadChannelMessages = async ({
  channel,
  before = null,
  messagesAll = [],
  limit = 100,
  options,
}) => {
  let messages = await getMessagesBefore({
    channel,
    before,
    limit,
    options,
  });

  messagesAll = messagesAll.concat(messages);

  const last = messages.length ? messages[messages.length - 1] : undefined;
  console.clear();
  console.log(`Total downloaded: ${messagesAll.length}`);

  if (messagesAll.length <= MAX_MESSAGES && last) {
    console.log(`Downloading ${limit} messages before ${last.id}`);

    return await downloadChannelMessages({
      channel,
      before: last.id,
      messagesAll,
      limit,
      options,
    });
  }

  if (messagesAll.length >= MAX_MESSAGES) {
    console.log(
      `Reached limit of messages to download - ${messagesAll.length} in total`
    );

    if (last) {
      console.log(`Downloaded up to message with id '${last.id}'`);
    }
  }

  return messagesAll;
};

const getMessagesBefore = async ({ channel, before = null, limit = 100 }) => {
  let url = `https://discord.com/api/v9/channels/${channel}/messages?limit=${limit}`;

  if (before) {
    url = `${url}&before=${before}`;
  }

  const response = await fetch(url, {
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
  });
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

  const messages = await downloadChannelMessages({ channel });

  if (!skip) {
    fs.writeFile(
      `${MESSAGES_DIR}/${target}.json`,
      JSON.stringify(messages),
      undefined,
      (err) => {
        if (err) {
          console.log(err.message);
          return;
        }

        console.log(`Saved to file '${target}.json'`);
      }
    );
  }

  const data = messages.reverse();

  await writeFilesFromData({ data, target });
  await downloadAttachments({ channel, target });
  await copyAttachments({ src: target });

  console.log(`Messages downloaded for channel '${channel}'`);
}

run();

// node downloadChannelMessages channel= [target=] [skip]
