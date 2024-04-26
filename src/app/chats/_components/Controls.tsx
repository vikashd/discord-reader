"use client";

import cx from "classnames";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  EyeClosed,
  EyeSolid,
  Home,
  StarSolid,
} from "iconoir-react";
import Link from "next/link";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useContext } from "react";
import { MessagesContext } from "./MessagesContext";

interface ControlsProps {
  children?: React.ReactNode;
}

export function Controls({ children }: ControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const { blur, toggleBlur, totalPages } = useContext(MessagesContext);
  const currentIndex = Number(params.page) - 1;

  return (
    <div className="flex gap-1 items-center">
      <Link
        href="/"
        className="flex grow-0 shrink-0 items-center justify-center rounded-full bg-slate-500 w-6 h-6 hover:bg-white hover:text-slate-500"
      >
        <Home width={14} height={14} />
      </Link>
      <Link
        href="#top"
        className="flex grow-0 shrink-0 items-center justify-center rounded-full bg-slate-500 w-6 h-6 hover:bg-white hover:text-slate-500"
      >
        <ArrowUp width={14} height={14} />
      </Link>
      <Link
        href="#bottom"
        className="flex grow-0 shrink-0 items-center justify-center rounded-full bg-slate-500 w-6 h-6 hover:bg-white hover:text-slate-500"
      >
        <ArrowDown width={14} height={14} />
      </Link>
      <Link
        href={
          currentIndex === 0 ? {} : `/chats/${params.channel}/${currentIndex}`
        }
        className={cx(
          "flex grow-0 shrink-0 items-center justify-center rounded-full bg-slate-500 w-6 h-6 hover:bg-white hover:text-slate-500",
          { "pointer-events-none opacity-50": currentIndex === 0 }
        )}
      >
        <ArrowLeft width={14} />
      </Link>
      <Link
        href={
          currentIndex === totalPages - 1
            ? {}
            : `/chats/${params.channel}/${currentIndex + 2}`
        }
        className={cx(
          "flex grow-0 shrink-0 items-center justify-center rounded-full bg-slate-500 w-6 h-6 hover:bg-white hover:text-slate-500",
          { "pointer-events-none opacity-50": currentIndex === totalPages - 1 }
        )}
      >
        <ArrowRight width={14} />
      </Link>
      <button
        type="button"
        className={cx(
          "flex grow-0 shrink-0 items-center justify-center rounded-full bg-slate-500 w-6 h-6 hover:bg-white hover:text-slate-500",
          { "bg-white text-slate-400": blur }
        )}
        onClick={() => toggleBlur()}
      >
        {blur ? <EyeClosed width={14} /> : <EyeSolid width={14} />}
      </button>
      <button
        type="button"
        className={cx(
          "flex grow-0 shrink-0 items-center justify-center rounded-full bg-slate-500 w-6 h-6 hover:bg-white hover:text-slate-500",
          { "bg-white text-slate-400": searchParams.has("menu") }
        )}
        onClick={() => {
          const next = searchParams.has("menu") ? pathname : "?menu";

          router.push(`${next}`, { scroll: false });
        }}
      >
        <StarSolid width={14} height={14} />
      </button>
      {children}
    </div>
  );
}
