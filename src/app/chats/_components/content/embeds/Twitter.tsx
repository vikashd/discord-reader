import cx from "classnames";
import { XEmbed } from "react-social-media-embed";
import { isTwitter } from "@/app/chats/_components/content/isLinkType";
import { EmbedProps } from "./Embed";

export const Twitter: EmbedProps = ({ message, options }) => {
  return (message.embeds || []).map((props) => {
    if (props.type !== "rich" || !isTwitter({ url: props.url })) {
      return null;
    }

    const { url } = props;

    return (
      <div
        key={url}
        className={cx("flex mt-2 mb-1 md:max-w-[50%]", {
          "ml-auto": options?.align === "right",
        })}
      >
        <XEmbed url={url} width="100%" />
      </div>
    );
  });
};
