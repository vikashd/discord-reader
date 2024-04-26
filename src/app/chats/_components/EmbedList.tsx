import Link from "next/link";
import {
  GifFormat,
  Instagram,
  Link as LinkIcon,
  MediaImage,
  MediaVideo,
  SoundHigh,
  X,
  Youtube,
} from "iconoir-react";
import { LinkTypes } from "./content/isLinkType";

export interface EmbedListProps {
  items: { id: string; name: string; type: LinkTypes }[];
}

export function EmbedList({ items }: EmbedListProps) {
  const icons = new Map<LinkTypes, React.ReactNode>([
    ["audio", <SoundHigh key="audio" width={14} height={14} />],
    ["image", <MediaImage key="image" width={14} height={14} />],
    ["gif", <GifFormat key="youtube" width={14} height={14} />],
    ["href", <LinkIcon key="other" width={14} height={14} />],
    ["instagram", <Instagram key="other" width={14} height={14} />],
    ["twitch", <MediaVideo key="twitch" width={14} height={14} />],
    ["twitter", <X key="twitter" width={14} height={14} />],
    ["video", <MediaVideo key="video" width={14} height={14} />],
    ["youtube", <Youtube key="youtube" width={14} height={14} />],
  ]);

  return (
    <div className="flex flex-col flex-wrap gap-1 pb-2 text-[9px]">
      {items.map(({ id, type, name }) => {
        const icon = icons.get(type);

        return (
          <Link
            key={id}
            href={`#${id}`}
            className="inline-flex gap-1 items-center rounded-xl bg-slate-500 text-slate-200 px-2 py-1 h-6 mr-auto max-w-48 whitespace-nowrap overflow-hidden hover:bg-white hover:text-slate-500"
          >
            {icon && <span>{icon}</span>}
            <span className="overflow-hidden text-ellipsis">{name}</span>
          </Link>
        );
      })}
    </div>
  );
}
