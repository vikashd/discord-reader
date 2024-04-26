import dynamic from "next/dynamic";
import { Discord } from "../_types/Discord";

const MessagesList = dynamic(
  () => import("./MessagesList").then((mod) => mod.MessagesList),
  {
    loading: () => <div />,
    ssr: false,
  }
);

export const MessagesListWrapper = ({
  messages,
}: {
  messages: Discord.Message[];
}) => {
  return <MessagesList messages={messages} />;
};
