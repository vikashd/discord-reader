import { Attachment, Link as LinkIcon, MicrophoneSolid } from "iconoir-react";
import { getMessages } from "@/app/_actions/getMessages";
import { Discord } from "@/app/chats/_types/Discord";
import { getLinks } from "./content/getLinks";
import { type LinkTypes, getType } from "./content/isLinkType";
import { EmbedList, type EmbedListProps } from "./EmbedList";

interface MessagesContentLinks {
  attachments?: Discord.Attachment[];
  calls?: Discord.Message["call"][];
  contentLinks: Map<LinkTypes, { messageId: string; url: string }[]>;
}

export function MessagesContentLinks({
  attachments,
  calls,
  contentLinks,
}: MessagesContentLinks) {
  return (
    <>
      {!!attachments?.length && (
        <>
          <h2 className="flex items-center gap-1 text-[11px] pl-2 mb-2">
            <Attachment width={14} />
            Attachments
          </h2>
          <EmbedList
            items={attachments.map(({ id, content_type, filename }) => {
              let type: LinkTypes = "href";

              if (content_type.match(/^audio/)) {
                type = "audio";
              }

              if (content_type.match(/^video/)) {
                type = "video";
              }

              if (content_type.match(/^image/)) {
                type = "image";

                if (getType({ url: filename }) === "gif") {
                  type = "gif";
                }
              }

              return {
                id,
                name: filename,
                type,
              };
            })}
          />
        </>
      )}
      {!!contentLinks.size && (
        <>
          <h2 className="flex items-center gap-1 text-[11px] pl-2 mb-2">
            <LinkIcon width={14} />
            Links
          </h2>
          <EmbedList
            items={Array.from(contentLinks).reduce<EmbedListProps["items"]>(
              (acc, [type, links]) => {
                return acc.concat(
                  links.map(({ messageId: id, url }) => {
                    return { id, type, name: url };
                  })
                );
              },
              []
            )}
          />
        </>
      )}
      {!!calls?.length && (
        <>
          <h2 className="flex items-center gap-1 text-[11px] pl-2 mb-2">
            <MicrophoneSolid width={14} />
            Calls
          </h2>
          <div className="flex flex-col flex-wrap gap-1 pb-2 text-[9px]">
            <div className="inline-flex gap-1 items-center rounded-xl bg-slate-500 text-slate-200 px-2 py-1 h-6 mr-auto">
              <MicrophoneSolid />
              {calls.length} call(s)
            </div>
          </div>
        </>
      )}
    </>
  );
}

export async function MessageContentLinksWithSuspense({
  channel,
  page,
  query,
}: {
  channel: string;
  page: string;
  query?: string;
}) {
  const response = await getMessages({ channel, page, query });

  const {
    attachments,
    calls,
    data: [[, messages]],
  } = response;

  const contentLinks = getLinks(messages);

  return (
    <>
      <div className="overflow-y-auto max-h-[415px] pr-4">
        <MessagesContentLinks
          attachments={attachments}
          calls={calls}
          contentLinks={contentLinks}
        />
      </div>
    </>
  );
}
