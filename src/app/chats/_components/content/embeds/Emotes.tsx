import { Discord } from "@/app/chats/_types/Discord";

export const Emotes = ({
  content,
  message,
}: {
  content: string;
  message: Discord.Message;
}) => {
  const emotes = content.match(/<\w*:*\w*:\d+>/g);

  if (!emotes) {
    return content;
  }

  const style =
    emotes
      .reduce<string>((acc, emote) => acc.replace(emote, ""), message.content)
      .trim() === ""
      ? "width: 3rem; vertical-align: middle;"
      : "width: 1rem; vertical-align: bottom;";

  return emotes.reduce<string>((acc, emote) => {
    const name = `:${emote.match(/\w+:/g)?.pop()}`;
    const extension = emote.match(/^<a:/) ? "gif" : "webp";
    const url = `https://cdn.discordapp.com/emojis/${
      emote.match(/:(\d+)/)?.[1]
    }.${extension}?size=96&quality=lossless`;

    return acc.replace(
      emote,
      `<img
          src="${url}"
          alt="${name}"
          title="${name}"
          class="inline"
          style="${style} height: auto;"
          />`
    );
  }, content);
};
