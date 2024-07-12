import clsx from "clsx";
import Link from "next/link";
import { EmbedProps } from "./Embed";

export const Gif: EmbedProps = ({ message, options }) => {
  return (message.embeds || []).map((props) => {
    if (props.type !== "gifv") {
      return null;
    }

    const {
      url,
      video: { width, height, url: videoUrl },
    } = props;

    return (
      <div
        key={url}
        className={clsx("flex mt-2 mb-1 max-w-[300px]", {
          "ml-auto justify-end": options?.align === "right",
        })}
      >
        <Link href={url} target="_blank">
          <video
            width={width}
            height={height}
            autoPlay
            muted
            loop
            onContextMenu={(e) => {
              e.preventDefault();
            }}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        </Link>
      </div>
    );
  });
};
