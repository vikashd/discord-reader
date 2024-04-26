import { Discord } from "@/app/chats/_types/Discord";

export interface EmbedProps {
  ({
    message,
    options,
  }: {
    message: Discord.Message;
    options?: { align?: "left" | "right" };
  }): React.ReactNode[];
}
