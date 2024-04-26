import { Suspense } from "react";
import { Controls } from "@/app/chats/_components/Controls";
import { ControlsWithSuspense } from "@/app/chats/_components/ControlsWithSuspense";
import { Loading } from "@/app/chats/_components/Loading";
import { MessageContentLinksWithSuspense } from "@/app/chats/_components/MessagesContentLinks";
import { MessagesListLoadingSkeleton } from "@/app/chats/_components/MessagesListLoadingSkeleton";
import { MessagesWithSuspense } from "@/app/chats/_components/MessagesWithSuspense";
import { PagesNav } from "@/app/chats/_components/PagesNav";

export default async function Discord({
  params: { channel, page },
}: {
  params: { channel: string; page: string };
}) {
  return (
    <>
      <PagesNav channel={channel} current={Number(page)} />
      <div className="container mx-auto max-w-[800px]">
        <Suspense
          key={channel + page}
          fallback={<MessagesListLoadingSkeleton />}
        >
          <MessagesWithSuspense channel={channel} page={page} />
        </Suspense>
      </div>

      <div className="fixed flex flex-col gap-1 left-0 bottom-5 p-4">
        <Suspense>
          <MessageContentLinksWithSuspense channel={channel} page={page} />
        </Suspense>
        <Controls />
        <div className="pt-2 h-[20px]">
          <Suspense fallback={<Loading />}>
            <ControlsWithSuspense channel={channel} page={page} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
