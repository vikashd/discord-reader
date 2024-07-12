import { Suspense } from "react";
import { Controls } from "@/app/chats/_components/Controls";
import { ControlsWithSuspense } from "@/app/chats/_components/ControlsWithSuspense";
import { Loading } from "@/app/chats/_components/Loading";
import { MessageContentLinksWithSuspense } from "@/app/chats/_components/MessagesContentLinks";
import { MessagesListLoadingSkeleton } from "@/app/chats/_components/MessagesListLoadingSkeleton";
import { MessagesWithSuspense } from "@/app/chats/_components/MessagesWithSuspense";
import { PagesNav } from "@/app/chats/_components/PagesNav";
import { Search } from "@/app/chats/_components/Search";

export default async function Discord({
  params: { channel, page },
  searchParams: { query },
}: {
  params: { channel: string; page: string };
  searchParams: { query?: string };
}) {
  const key = `${page}_${query}`;

  return (
    <>
      <div className="px-4 my-2">
        <PagesNav channel={channel} current={Number(page)} />
      </div>
      <div className="container mx-auto max-w-[800px]">
        <div className="px-4 my-4 max-w-[225px]">
          <Search />
        </div>
      </div>
      <div className="container mx-auto max-w-[800px]">
        <Suspense key={key} fallback={<MessagesListLoadingSkeleton />}>
          <MessagesWithSuspense channel={channel} page={page} query={query} />
        </Suspense>
      </div>

      <div className="fixed flex flex-col gap-1 left-0 bottom-5 p-4">
        <Suspense key={key}>
          <MessageContentLinksWithSuspense
            channel={channel}
            page={page}
            query={query}
          />
        </Suspense>
        <Controls />
        <div className="pt-2 h-[20px]">
          <Suspense key={key} fallback={<Loading />}>
            <ControlsWithSuspense channel={channel} page={page} query={query} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
