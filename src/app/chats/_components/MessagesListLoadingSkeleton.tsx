export function MessagesListLoadingSkeleton() {
  return (
    <div className="flex flex-col gap-5 mt-8 px-4">
      <div className="animate-pulse flex flex-col py-3">
        <div className="flex gap-2 items-center mb-2">
          <div className="rounded-full bg-slate-700 h-10 w-10"></div>
          <div className="w-16 h-2 bg-slate-700 rounded"></div>
        </div>
        <div className="flex-1 space-y-6 py-1">
          <div className="grid grid-cols-3 space-y-3">
            <div className="grid grid-cols-3 col-span-3 gap-4">
              <div className="h-2 bg-slate-700 rounded col-span-2"></div>
              <div className="h-2 bg-slate-700 rounded col-span-1"></div>
            </div>
            <div className="h-2 bg-slate-700 rounded col-span-1"></div>
          </div>
        </div>
      </div>
      <div className="animate-pulse flex flex-col py-3">
        <div className="flex flex-row-reverse gap-2 items-center mb-2">
          <div className="rounded-full bg-slate-700 h-10 w-10"></div>
          <div className="w-16 h-2 bg-slate-700 rounded"></div>
        </div>
        <div dir="rtl" className="flex-1 space-y-6 py-1">
          <div className="grid grid-cols-3 space-y-3">
            <div className="grid grid-cols-3 col-span-3 gap-4">
              <div className="h-2 bg-slate-700 rounded col-span-2"></div>
              <div className="h-2 bg-slate-700 rounded col-span-1"></div>
            </div>
            <div className="h-2 bg-slate-700 rounded col-span-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
