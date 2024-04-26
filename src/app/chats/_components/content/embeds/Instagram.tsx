import cx from "classnames";
import { InstagramEmbed } from "react-social-media-embed";
import { isInstagram } from "@/app/chats/_components/content/isLinkType";
import { EmbedProps } from "./Embed";

export const Instagram: EmbedProps = ({ message, options }) => {
  return (message.embeds || []).map((props) => {
    if (props.type !== "rich" || !isInstagram({ url: props.url })) {
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
        <InstagramEmbed url={url} width="100%" />
      </div>
    );
  });
};
