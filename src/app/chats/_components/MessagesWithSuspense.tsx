import dynamic from "next/dynamic";
import { getMessages } from "@/app/_actions/getMessages";

const MessagesList = dynamic(
  () => import("./MessagesList").then(({ MessagesList }) => MessagesList),
  {
    ssr: false,
  }
);

export async function MessagesWithSuspense({
  channel,
  page,
  query,
}: {
  channel: string;
  page: string;
  query?: string;
}) {
  const response = await getMessages({ channel, page, query });

  const { data } = response;

  return <MessagesList pages={data} />;
}
