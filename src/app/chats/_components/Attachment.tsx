import { EmptyPage } from "iconoir-react";
import Link from "next/link";
import Image from "next/image";
import { Discord } from "@/app/chats/_types/Discord";

interface AttachmentProps {
  attachment: Discord.Attachment;
}

export function Attachment({ attachment }: AttachmentProps) {
  const { id, content_type, width, height, url, filename } = attachment;

  if (content_type.match(/^image/)) {
    return (
      <Link
        id={id}
        href={url}
        className="inline-flex my-1 max-w-[300px]"
        target="_blank"
      >
        <Image
          src={url}
          width={width}
          height={height}
          className="max-w-full"
          alt=""
        />
      </Link>
    );
  }

  if (content_type.match(/^audio/)) {
    return (
      <div id={id} className="mt-2 mb-1">
        <audio controls>
          <source src={url} type={content_type} />
        </audio>
      </div>
    );
  }

  if (content_type.match(/^video/)) {
    return (
      <div id={id} className="mt-2 mb-1 max-w-[300px]">
        <video controls>
          <source src={url} type="video/mp4" />
        </video>
      </div>
    );
  }

  if (content_type.match(/^application/)) {
    return (
      <Link
        id={id}
        href={url}
        className="inline-flex gap-1 my-1 text-blue-400"
        target="_blank"
      >
        <EmptyPage width={16} height={16} /> {filename}
      </Link>
    );
  }
}
