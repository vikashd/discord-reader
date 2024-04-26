import cx from "classnames";
import { DetailedHTMLProps, ImgHTMLAttributes, useState } from "react";
import { getLinks } from "@/app/chats/_components/content/getLinks";
import { isImage } from "@/app/chats/_components/content/isLinkType";
import { EmbedProps } from "./Embed";

export const Image: EmbedProps = ({ message, options }) => {
  const links = getLinks([message], [isImage]).get("image") || [];

  return links.map(({ url }, i) => {
    return (
      <div
        key={i}
        className={cx("flex max-w-[300px]", {
          "ml-auto justify-end": options?.align === "right",
        })}
      >
        <ImageComponent
          src={url}
          alt="Image"
          loading="lazy"
          className="h-auto max-w-full my-1"
        />
      </div>
    );
  });
};

function ImageComponent(
  props: DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >
) {
  const [loadError, setLoadError] = useState(false);

  if (loadError) {
    return <div className="w-12 h-12 bg-slate-600 rounded-full">404</div>;
  }

  return <img {...props} onError={() => setLoadError(true)} />;
}
