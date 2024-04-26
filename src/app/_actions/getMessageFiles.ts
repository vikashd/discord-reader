import { promises as fs } from "fs";
import { unstable_cache } from "next/cache";

export const getMessageFiles = unstable_cache(async (folder: string) => {
  const dir = `${process.cwd()}/src/app/_messages/${folder}`;

  const pages = (await fs.readdir(dir)).sort(
    (a, b) => parseInt(a, 10) - parseInt(b, 10)
  );

  return { pages, total: pages.length };
});
