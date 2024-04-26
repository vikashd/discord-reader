import { getMessages } from "@/app/_actions/getMessages";
import { MessagesContextProvider } from "@/app/chats/_components/MessagesContext";

export default async function Layout({
  children,
  params: { channel, page },
}: Readonly<{
  children: React.ReactNode;
  params: { channel: string; page: string };
}>) {
  const data = await getMessages(channel, page);
  const { authors1, total } = data;

  return (
    <MessagesContextProvider
      authors={new Map(authors1)}
      channel={channel}
      totalPages={total}
    >
      {children}
    </MessagesContextProvider>
  );
}
