import "server-only";
import { promises as fs } from "fs";
import { Discord } from "@/app/chats/_types/Discord";

export const getChannelAuthors = async () => {
  const dir = `${process.cwd()}/src/app/_messages`;
  const files = await fs.readdir(dir, { withFileTypes: true });

  const channels = files
    .filter((file) => {
      if (file.isFile()) {
        return file.name.match(/(.*)\.json$/);
      }
    })
    .map(({ name }) => {
      const channel = (name.match(/(.*)\.json$/) || [])[1];

      return channel;
    });

  const data: Promise<Discord.Message[]>[] = channels.map(async (channel) => {
    const filepath = `${dir}/${channel}/1/data.json`;

    const data = await fs.readFile(filepath, {
      encoding: "utf-8",
      flag: "r",
    });

    return JSON.parse(data);
  });

  const firstPages = await Promise.all(data);

  return firstPages.map((messages, i) => {
    const authors = messages.reduce((acc, { author }) => {
      if (!acc.get(author.id)) {
        acc.set(author.id, author);
      }

      return acc;
    }, new Map<string, Discord.Author>());

    return { channel: channels[i], authors };
  });
};
