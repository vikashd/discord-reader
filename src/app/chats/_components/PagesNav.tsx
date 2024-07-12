import clsx from "clsx";
import { Home } from "iconoir-react";
import Link from "next/link";
import { getMessageFiles } from "@/app/_actions/getMessageFiles";

interface PageNavProps {
  channel: string;
  current: number;
}

export async function PagesNav({ channel, current }: PageNavProps) {
  const response = await getMessageFiles(channel);

  const { total } = response;

  return (
    <div id="top" className="flex flex-wrap flex-shrink gap-1 mr-auto">
      <Link
        href="/"
        className="flex grow-0 shrink-0 items-center justify-center rounded-full bg-slate-500 w-6 h-6 hover:bg-white hover:text-slate-500"
      >
        <Home width={14} height={14} />
      </Link>
      {new Array(total).fill(1).map((_, index) => {
        return (
          <Link
            key={index}
            href={`/chats/${channel}/${index + 1}`}
            className={clsx(
              "flex flex-shrink-0 items-center justify-center rounded-full bg-slate-500 text-slate-200 w-6 h-6 text-[8px] hover:bg-white hover:text-slate-500",
              {
                "bg-white text-slate-500": index + 1 === current,
              }
            )}
          >
            {index + 1}
          </Link>
        );
      })}
    </div>
  );
}
