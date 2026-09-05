import React from "react";

/** Bar loader — used for short, indeterminate waits. */
const Loader = ({ label }) => (
  <div className="flex flex-col items-center justify-center py-4">
    <div className="loaderContainer">
      <span className="loaderBar loaderBar1" />
      <span className="loaderBar loaderBar2" />
      <span className="loaderBar loaderBar3" />
      <span className="loaderBar loaderBar4" />
      <span className="loaderBar loaderBar5" />
    </div>
    <p className="animate-pulseSoft text-[13px] tracking-wide text-primaryText1">
      {label || "Loading…"}
    </p>
  </div>
);

/** Card-shaped placeholder that mirrors the real article card layout. */
export const ArticleCardSkeleton = () => (
  <div className="surface w-full overflow-hidden p-4 sm:p-5">
    <div className="flex flex-col gap-5 sm:flex-row">
      <div className="skeleton h-40 w-full shrink-0 rounded-xl2 sm:h-[124px] sm:w-[190px]" />
      <div className="flex w-full flex-col gap-3">
        <div className="skeleton h-5 w-4/5" />
        <div className="skeleton h-3.5 w-full" />
        <div className="skeleton h-3.5 w-11/12" />
        <div className="mt-1 flex gap-2">
          <div className="skeleton h-5 w-16 rounded-full" />
          <div className="skeleton h-5 w-20 rounded-full" />
          <div className="skeleton h-5 w-14 rounded-full" />
        </div>
        <div className="mt-2 flex items-center gap-3">
          <div className="skeleton h-9 w-9 rounded-full" />
          <div className="skeleton h-3 w-32" />
        </div>
      </div>
    </div>
  </div>
);

/** Vertical card placeholder for the grid feed. */
export const ArticleGridCardSkeleton = () => (
  <div className="surface flex h-full flex-col overflow-hidden">
    <div className="skeleton aspect-[16/9] w-full rounded-none" />
    <div className="flex flex-1 flex-col gap-3 p-5">
      <div className="skeleton h-5 w-4/5" />
      <div className="skeleton h-3.5 w-full" />
      <div className="skeleton h-3.5 w-10/12" />
      <div className="mt-1 flex gap-2">
        <div className="skeleton h-5 w-14 rounded-full" />
        <div className="skeleton h-5 w-20 rounded-full" />
      </div>
      <div className="mt-auto flex items-center gap-3 border-t border-hair/[0.07] pt-4">
        <div className="skeleton h-7 w-7 rounded-full" />
        <div className="skeleton h-3 w-28" />
      </div>
    </div>
  </div>
);

export const ArticleGridSkeleton = ({ count = 6 }) => (
  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: count }).map((_, i) => (
      <ArticleGridCardSkeleton key={i} />
    ))}
  </div>
);

export const ArticleListSkeleton = ({ count = 4 }) => (
  <div className="flex w-full flex-col gap-5">
    {Array.from({ length: count }).map((_, i) => (
      <ArticleCardSkeleton key={i} />
    ))}
  </div>
);

/** Full-page reading skeleton for the article detail view. */
export const ArticleDetailSkeleton = () => (
  <>
    <div className="border-b border-hair/[0.07] bg-ink-900/40">
      <div className="box pb-14 pt-8">
        <div className="skeleton h-4 w-32" />
        <div className="mx-auto mt-8 max-w-[820px]">
          <div className="skeleton h-6 w-28 rounded-full" />
          <div className="skeleton mt-5 h-10 w-full" />
          <div className="skeleton mt-3 h-10 w-3/4" />
          <div className="mt-7 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="skeleton h-11 w-11 rounded-full" />
              <div className="space-y-2">
                <div className="skeleton h-3.5 w-28" />
                <div className="skeleton h-3 w-16" />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="skeleton h-3.5 w-24" />
              <div className="skeleton h-3.5 w-20" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="box">
      <div className="mx-auto max-w-[980px]">
        <div className="skeleton -mt-8 h-[220px] w-full rounded-2xl sm:h-[400px]" />

        <div className="mt-10 lg:grid lg:grid-cols-[56px_minmax(0,1fr)] lg:gap-8">
          <div className="hidden lg:block">
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton h-11 w-11 rounded-xl2" />
              ))}
            </div>
          </div>

          <div className="space-y-3.5">
            <div className="flex gap-2">
              <div className="skeleton h-5 w-16 rounded-full" />
              <div className="skeleton h-5 w-20 rounded-full" />
            </div>
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`skeleton h-3.5 ${i % 4 === 3 ? "w-2/3" : "w-full"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  </>
);

export default Loader;
