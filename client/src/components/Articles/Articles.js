import React from "react";
import { useHistory } from "react-router-dom";
import Article from "./Article/Article";
import FeaturedArticle from "./FeaturedArticle";
import { useSelector } from "react-redux";
import { ArticleGridSkeleton, ArticleListSkeleton } from "../Loader/Loader";
import EmptyState from "../UI/EmptyState";

const Articles = ({
  view = "grid",
  showFeatured = false,
  emptyIcon = "🔍",
  emptyTitle = "No articles found",
  emptyDescription = "Nothing matches this view just yet. Try another category, or be the first to publish something here.",
}) => {
  const { articles, isLoading } = useSelector((state) => state.articles);
  const history = useHistory();
  const list = articles || [];

  if (isLoading) {
    return view === "list" ? (
      <ArticleListSkeleton count={4} />
    ) : (
      <ArticleGridSkeleton count={6} />
    );
  }

  if (!list.length) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
        action={
          <button
            className="btn-primary"
            onClick={() => history.push("/writeArticle")}
          >
            Write an article
          </button>
        }
      />
    );
  }

  // Spotlight the newest article, then flow the rest into the grid.
  const useFeatured = showFeatured && view === "grid" && list.length >= 3;
  const featured = useFeatured ? list[0] : null;
  const rest = useFeatured ? list.slice(1) : list;

  return (
    <>
      {featured && <FeaturedArticle article={featured} />}

      {view === "list" ? (
        <div className="flex w-full flex-col gap-5">
          {rest.map((article) => (
            <Article key={article._id} article={article} variant="list" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {rest.map((article) => (
            <Article key={article._id} article={article} variant="grid" />
          ))}
        </div>
      )}
    </>
  );
};

export default Articles;
