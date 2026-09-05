import React, { useEffect, useState } from "react";
import Articles from "../Articles/Articles.js";
import Search from "../Search/Search.js";

import categories from "../../categories.json";
import { useHistory, Link, useLocation } from "react-router-dom";
import {
  HiOutlinePencilAlt,
  HiOutlineSparkles,
  HiOutlineViewGrid,
  HiOutlineViewList,
  HiOutlineBookmark,
  HiOutlineSearch,
  HiOutlineCollection,
} from "react-icons/hi";

import { useDispatch, useSelector } from "react-redux";
import {
  getArticles,
  getArticlesByCategory,
  getArticlesBySearch,
} from "../../actions/articles.js";
import { CATEGORY_ICONS } from "../../utils/article";
import { useAuthModal } from "../../context/AuthModalContext";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const VIEW_KEY = "devarticles:feedView";

const Home = () => {
  const query = useQuery();
  const category = query.get("category");
  const searchQuery = query.get("searchQuery");

  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const { openAuth } = useAuthModal();

  const { articles, isLoading } = useSelector((state) => state.articles);
  const user = JSON.parse(localStorage.getItem("profile"));

  const isSearchView = location.pathname.includes("/articles/search");
  const isBookmarksView = location.pathname.includes("/bookmarks");
  const isCategoryView = Boolean(category);
  const isFeed = !isSearchView && !isBookmarksView && !isCategoryView;

  const [search, setSearch] = useState(
    isSearchView && searchQuery && searchQuery !== "none" ? searchQuery : "",
  );

  const [view, setView] = useState(
    () => localStorage.getItem(VIEW_KEY) || "grid",
  );

  const changeView = (next) => {
    setView(next);
    localStorage.setItem(VIEW_KEY, next);
  };

  const searchArticle = () => {
    if (search.trim()) {
      dispatch(getArticlesBySearch({ search }));
      history.push(`/articles/search?searchQuery=${search || "none"}`);
    } else {
      history.push("/articles");
    }
  };

  const clearSearch = () => {
    setSearch("");
    history.push("/articles");
  };

  useEffect(() => {
    if (category) {
      dispatch(getArticlesByCategory(category));
    } else if (isSearchView && searchQuery && searchQuery !== "none") {
      dispatch(getArticlesBySearch({ search: searchQuery }));
    } else {
      dispatch(getArticles());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, category, searchQuery, isSearchView]);

  /* ---------- per-view copy ---------- */
  let heading = "Latest articles";
  let subheading = "Fresh writing from the community, newest first.";
  let HeadingIcon = HiOutlineCollection;

  if (isCategoryView) {
    heading = category;
    subheading = `Everything published under ${category}.`;
    HeadingIcon = HiOutlineCollection;
  } else if (isSearchView) {
    heading =
      searchQuery && searchQuery !== "none" ? `“${searchQuery}”` : "Search";
    subheading = "Results matching your search.";
    HeadingIcon = HiOutlineSearch;
  } else if (isBookmarksView) {
    heading = "Bookmarks";
    subheading = "Articles you saved for later.";
    HeadingIcon = HiOutlineBookmark;
  }

  const count = (articles || []).length;

  return (
    <section className="pb-6">
      {/* ================= HERO ================= */}
      {isFeed && (
        <div className="relative overflow-hidden border-b border-hair/[0.07]">
          <div className="pointer-events-none absolute inset-0 bg-grid bg-gridcell opacity-60" />
          <div className="pointer-events-none absolute -left-24 -top-28 h-80 w-80 rounded-full bg-accent-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 top-4 h-80 w-80 rounded-full bg-violet2/20 blur-3xl" />

          <div className="box relative py-14 sm:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <span className="badge animate-fadeUp">
                <HiOutlineSparkles className="h-3.5 w-3.5" />
                Developer community
              </span>

              <h1 className="animate-fadeUp mt-6 font-display text-[34px] font-extrabold leading-[1.08] tracking-tight text-primaryText4 sm:text-[52px]">
                Read, write and share
                <br />
                <span className="gradient-text">what you build.</span>
              </h1>

              <p className="animate-fadeUp mx-auto mt-5 max-w-xl text-[15.5px] leading-relaxed text-primaryText1 sm:text-[16.5px]">
                Deep dives, quick notes and hard-won debugging stories — written
                by developers, for developers.
              </p>

              <div className="animate-fadeUp mt-8 flex flex-wrap items-center justify-center gap-3">
                {user?.result ? (
                  <Link to="/writeArticle">
                    <button className="btn-primary btn-lg">
                      <HiOutlinePencilAlt className="h-[18px] w-[18px]" />
                      Write an article
                    </button>
                  </Link>
                ) : (
                  <button
                    onClick={() => openAuth("signup")}
                    className="btn-primary btn-lg"
                  >
                    <HiOutlinePencilAlt className="h-[18px] w-[18px]" />
                    Start writing
                  </button>
                )}
                <a href="#feed">
                  <button className="btn-ghost btn-lg">Browse articles</button>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= STICKY TOOLBAR ================= */}
      <div className="sticky top-16 z-30 border-b border-hair/[0.07] bg-ink-900/85 backdrop-blur-xl">
        <div className="box py-4">
          <div className="flex items-center gap-2.5">
            <div className="min-w-0 flex-1">
              <Search
                value={search}
                onChange={setSearch}
                onSubmit={searchArticle}
                onClear={clearSearch}
              />
            </div>

            {/* view toggle */}
            <div className="hidden shrink-0 items-center gap-1 rounded-xl2 border border-hair/[0.09] bg-hair/[0.04] p-1 sm:flex">
              <button
                onClick={() => changeView("grid")}
                aria-label="Grid view"
                title="Grid view"
                className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                  view === "grid"
                    ? "bg-accent-500/[0.16] text-accent-300"
                    : "text-primaryText1 hover:text-primaryText4"
                }`}
              >
                <HiOutlineViewGrid className="h-[18px] w-[18px]" />
              </button>
              <button
                onClick={() => changeView("list")}
                aria-label="List view"
                title="List view"
                className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                  view === "list"
                    ? "bg-accent-500/[0.16] text-accent-300"
                    : "text-primaryText1 hover:text-primaryText4"
                }`}
              >
                <HiOutlineViewList className="h-[18px] w-[18px]" />
              </button>
            </div>
          </div>

          {/* category rail */}
          <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 sm:-mx-6 sm:px-6">
            <Link to="/articles" className="shrink-0">
              <span
                className={`chip whitespace-nowrap ${
                  isFeed ? "chip-active" : ""
                }`}
              >
                <HiOutlineCollection className="h-4 w-4" />
                All
              </span>
            </Link>

            {user?.result && (
              <Link to="/bookmarks" className="shrink-0">
                <span
                  className={`chip whitespace-nowrap ${
                    isBookmarksView ? "chip-active" : ""
                  }`}
                >
                  <HiOutlineBookmark className="h-4 w-4" />
                  Saved
                </span>
              </Link>
            )}

            {categories.categories.map((c) => (
              <Link
                key={c}
                to={`/articles/categories?category=${c.split(" ").join("+")}`}
                className="shrink-0"
              >
                <span
                  className={`chip whitespace-nowrap ${
                    category === c ? "chip-active" : ""
                  }`}
                >
                  <span>{CATEGORY_ICONS[c] || "✨"}</span>
                  {c}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ================= FEED ================= */}
      <div id="feed" className="box scroll-mt-32 pt-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl2 border border-hair/[0.08] bg-brandSoft text-accent-300">
              <HeadingIcon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h2 className="section-title break-words">{heading}</h2>
              <p className="mt-1 text-[13.5px] text-primaryText1">
                {subheading}
              </p>
            </div>
          </div>

          {!isLoading && (
            <span className="chip shrink-0">
              {count} {count === 1 ? "article" : "articles"}
            </span>
          )}
        </div>

        <Articles
          view={view}
          showFeatured={isFeed}
          emptyIcon={isBookmarksView ? "🔖" : isSearchView ? "🔍" : "📝"}
          emptyTitle={
            isBookmarksView
              ? "No bookmarks yet"
              : isSearchView
                ? "No results found"
                : "Nothing here yet"
          }
          emptyDescription={
            isBookmarksView
              ? "Save an article from the feed and it will show up here."
              : isSearchView
                ? "Try a different keyword, or browse by category instead."
                : "Be the first to publish an article in this space."
          }
        />

        {/* ---------- logged-out CTA ---------- */}
        {!user?.result && !isLoading && count > 0 && (
          <div className="surface mt-10 flex flex-col items-center gap-4 bg-brandSoft p-7 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <h3 className="font-display text-[18px] font-bold text-primaryText4">
                Got something to share?
              </h3>
              <p className="mt-1.5 text-[14px] text-primaryText1">
                Create a free account to publish articles, save bookmarks and
                join the discussion.
              </p>
            </div>
            <button
              onClick={() => openAuth("signup")}
              className="btn-primary shrink-0"
            >
              Get started
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Home;
