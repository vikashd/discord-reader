"use client";

import { Search as SearchIcon, Xmark } from "iconoir-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useRef, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";

export function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>();
  const [isPending, startTransition] = useTransition();

  const onSearchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = e.target.value;

    updateRoute(searchText);
  };

  const updateRoute = useDebouncedCallback((text?: string) => {
    const params = new URLSearchParams(searchParams);

    if (text) {
      params.set("query", text);
    } else {
      params.delete("query");
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  const doSearch = useDebouncedCallback((text: string) => {
    startTransition(() => {
      updateRoute(text);
    });
  }, 300);

  const clearSearch = () => {
    if (searchRef.current) {
      searchRef.current.value = "";
    }

    updateRoute();
  };

  const hasSearchQuery = searchParams.has("query");

  return (
    <div className="flex items-center bg-slate-600 rounded-full px-3 py-1">
      <input
        type="text"
        className="w-full bg-transparent text-xs p-0 outline-none mr-1"
        placeholder="Search"
        onChange={onSearchHandler}
        defaultValue={searchParams.get("query")?.toString()}
      />
      {hasSearchQuery ? (
        <button type="button">
          <Xmark width={14} height={14} onClick={clearSearch} />
        </button>
      ) : (
        <SearchIcon width={14} height={14} />
      )}
    </div>
  );
}
