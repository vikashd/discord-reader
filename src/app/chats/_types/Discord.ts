export namespace Discord {
  interface Embed {
    url: string;
    title: string;
    type: "gifv" | "image" | "video" | "rich" | "article" | "link";
    provider: {
      name: string;
      url?: string;
    };
    thumbnail: {
      url: string;
      width: number;
      height: number;
      proxy_url: string;
    };
    description: string;
    content_scan_version?: number;
  }

  type GifEmbed = {
    type: "gifv";
    video: {
      width: number;
      height: number;
      url: string;
      proxy_url: string;
    };
  } & Omit<Embed, "description | content_scan_version">;

  type ImageEmbed = {
    type: "image";
  } & Omit<Embed, "description | content_scan_version" | "provider" | "title">;

  type VideoEmbed = {
    type: "video";
    color: number;
    author: {
      name: string;
      url: string;
    };
    video: {
      width: number;
      height: number;
      url: string;
      proxy_url: string;
    };
  } & Embed;

  type ArticleEmbed = {
    type: "article";
  } & Embed;

  type Link = {
    type: "link";
    provider: { name: string };
  } & Omit<Embed, "content_scan_version">;

  type RichEmbed = {
    type: "rich";
    color: number;
    timestamp: string;
    author: {
      name: string;
      url: string;
      icon_url: string;
      proxy_icon_url: string;
    };
    fields: { name: "Likes" | "Retweets"; value: number; inline: boolean }[];
    video: {
      url: string;
      width: number;
      height: number;
    };
    footer: {
      text: string;
      icon_url: string;
      proxy_icon_url: string;
    };
  } & Omit<Embed, "provider">;

  export interface Message {
    id: string;
    author: Author;
    content: string;
    attachments: Attachment[];
    timestamp: string;
    edited_timestamp: string | null;
    message_reference?: {
      channel_id: string;
      message_id: string;
    };
    call?: {
      ended_timestamp: string;
      participants: string[];
    };
    sticker_items?: {
      id: string;
      name: string; // https://media.discordapp.net/stickers/983769920317821028.webp?size=320
      format_type: number;
    }[];
    embeds?: (GifEmbed | ImageEmbed | VideoEmbed | ArticleEmbed | RichEmbed)[];
    reactions?: {
      emoji: {
        id: string | null;
        name: string;
      };
      count: number;
      count_details: {
        burst: number;
        normal: number;
      };
      burst_colors: [];
      me_burst: boolean;
      burst_me: boolean;
      me: boolean;
      burst_count: number;
    }[];
    page: string;
  }

  export interface Author {
    id: string;
    username: string;
    global_name: string;
    avatar: string;
  }

  export interface Attachment {
    id: string;
    filename: string;
    size: number;
    url: string;
    proxy_url: string;
    width: number;
    height: number;
    content_type:
      | "image/jpeg"
      | "image/png"
      | "audio/x-wav"
      | "application/pdf"
      | "video/mp4";
  }
}
