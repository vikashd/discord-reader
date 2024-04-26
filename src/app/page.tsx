import cx from "classnames";
import { promises as fs } from "fs";
import Image from "next/image";
import Link from "next/link";
import { Discord } from "@/app/chats/_types/Discord";

export default async function Home() {
  const getChannelAuthors = async () => {
    "use server";

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

  const files = await getChannelAuthors();

  return (
    <main className="flex min-h-screen flex-col">
      <div className="container mx-auto my-16 px-4 text-xs">
        <div className="grid gap-2">
          {files.map(({ channel, authors }) => {
            return (
              <Link
                key={channel}
                href={`/chats/${channel}/1`}
                className="mr-auto"
              >
                <div className="flex items-center">
                  {Array.from(authors).map(([authorId, author], i) => {
                    return (
                      <div key={authorId} className={cx({ "-ml-3": i > 0 })}>
                        <Image
                          src={`https://cdn.discordapp.com/avatars/${author.id}/${author.avatar}.webp?size=160`}
                          width={40}
                          height={40}
                          className="rounded-full"
                          alt={author.username}
                        />
                      </div>
                    );
                  })}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
