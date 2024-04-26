import dynamic from "next/dynamic";
import { getMessages } from "@/app/_actions/getMessages";

const MessagesList = dynamic(
  () => import("./MessagesList").then((mod) => mod.MessagesList),
  {
    ssr: false,
  }
);

export async function MessagesWithSuspense({
  channel,
  page,
}: {
  channel: string;
  page: string;
}) {
  const response = await getMessages(channel, page);

  const {
    data: [messages],
  } = response;

  return <MessagesList messages={messages} />;
}
