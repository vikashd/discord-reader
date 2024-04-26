import cx from "classnames";
import { YouTubeEmbed } from "react-social-media-embed";
import { EmbedProps } from "./Embed";

export const YouTube: EmbedProps = ({ message, options }) => {
  return (message.embeds || []).map((props) => {
    if (props.type !== "video" || props.provider.name !== "YouTube") {
      return null;
    }

    const { url } = props;

    return (
      <div
        key={url}
        className={cx(
          "flex mt-2 mb-1 md:max-w-[50%] w-full aspect-[640/360] [&>*>div]:h-full [&_.youtube-iframe]:h-full",
          {
            "ml-auto": options?.align === "right",
          }
        )}
      >
        <YouTubeEmbed url={url} width="100%" height="100%" />
      </div>
    );
  });
};
