import { Discord } from "@/app/chats/_types/Discord";

export const Mentions = ({
  content,
  authors,
}: {
  content: string;
  authors: Map<string, Discord.Author>;
}) => {
  const mentions = content.matchAll(/<@[!]*(\d+)>/g);
  let updated = content;

  for (const mention of mentions) {
    const author = authors.get && authors.get(mention[1]);

    if (author) {
      updated = updated.replace(
        mention[0],
        `<span data-author-id="${author.id}" class="text-blue-400">@${
          author.global_name || "Unknown user"
        }</span>`
      );
    }
  }

  return updated;
};
