import { Skeleton } from "@/components/ui/misc";

/** Skeleton while the tour listing streams in. */
export default function Loading() {
  return (
    <div className="container-page py-10" aria-hidden="true">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="mt-8 h-12 w-72" />
      <div className="mt-10 grid gap-8 lg:grid-cols-[18rem_1fr]">
        <Skeleton className="hidden h-[32rem] lg:block" />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-[26rem]" />
          ))}
        </div>
      </div>
    </div>
  );
}
