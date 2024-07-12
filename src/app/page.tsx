import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { getChannelAuthors } from "@/app/_actions/getChannelAuthors";

export default async function Home() {
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
                      <div key={authorId} className={clsx({ "-ml-3": i > 0 })}>
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
