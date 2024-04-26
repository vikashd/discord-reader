import { Discord } from "@/app/chats/_types/Discord";

export interface LinkTypeFunction {
  ({ message, url }: { message?: Discord.Message; url?: string }):
    | LinkTypes
    | false;
}

export type LinkTypes =
  | "image"
  | "video"
  | "youtube"
  | "twitch"
  | "audio"
  | "instagram"
  | "twitter"
  | "gif"
  | "href";

export const getUrls = (url: string) => {
  return url.match(
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi
  );
};

const isOfType =
  (validate: (url: string) => boolean) =>
  (func: LinkTypeFunction) =>
  ({
    message,
    url,
  }: {
    message?: Discord.Message;
    url?: string;
  }): ReturnType<typeof func> => {
    if (url && !validate(url)) {
      return "href";
    }

    return func({ message, url });
  };

const isOfTypeWithValidUrl = isOfType((url) => !!getUrls(url));

export const getType = ({
  message,
  url,
  checks = [isImage, isYouTube, isTwitch, isTwitter, isInstagram, isTenorGif],
}: {
  message?: Discord.Message;
  url?: string;
  checks?: LinkTypeFunction[];
}): LinkTypes => {
  for (let i = 0; i < checks.length; i++) {
    const type = isOfTypeWithValidUrl(checks[i])({ message, url });

    if (type) {
      return type;
    }
  }

  return "href";
};

export const isImage: LinkTypeFunction = ({ url }) => {
  if (url && !url.endsWith("~~")) {
    const { pathname } = new URL(url);

    return pathname.match(/\.(gif|jpe?g|png|webp)$/)?.length ? "image" : false;
  }

  return false;
};

export const isTenorGif: LinkTypeFunction = isOfTypeWithValidUrl(({ url }) => {
  return url ? (url.match(/tenor\.com/) ? "gif" : false) : false;
});

export const isYouTube: LinkTypeFunction = ({ url }) => {
  return url ? (url.match(/youtu\.?be/)?.length ? "youtube" : false) : false;
};

export const isTwitter: LinkTypeFunction = ({ url }) => {
  return url
    ? url.match(/twitter.com|x.com/)?.length
      ? "twitter"
      : false
    : false;
};

export const isInstagram: LinkTypeFunction = ({ url }) => {
  return url ? (url.match(/instagram\.com/) ? "instagram" : false) : false;
};

export const isTwitch: LinkTypeFunction = ({ url }) => {
  return url ? (url.match(/twitch.tv/)?.length ? "twitch" : false) : false;
};

export const isAudio: LinkTypeFunction = ({ url }) => {
  return url ? (url.match(/\.mp4$/)?.length ? "audio" : false) : false;
};

export const CONTENT_TYPES = new Map<LinkTypes, LinkTypeFunction>([
  ["audio", isAudio],
  ["gif", isTenorGif],
  ["image", isImage],
  ["instagram", isInstagram],
]);
