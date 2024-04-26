let messagesAll = [];

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

const downloadChannelMessages = async ({
  channel,
  before = null,
  limit = 100,
  options,
}) => {
  const data = await getMessagesBefore({ channel, before, limit, options });
  messagesAll = messagesAll.concat(data);
  console.clear();
  console.log(messagesAll.length, data.length);

  if (data.length) {
    const last = data[data.length - 1];

    downloadChannelMessages({ channel, before: last.id, limit, options });
  } else {
    console.log(messagesAll);
  }
};
