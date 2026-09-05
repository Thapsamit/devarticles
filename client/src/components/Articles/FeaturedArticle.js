import React from "react";
import { useHistory } from "react-router-dom";
import moment from "moment";
import {
  HiOutlineClock,
  HiOutlineArrowRight,
  HiOutlineThumbUp,
  HiOutlineSparkles,
} from "react-icons/hi";
import { MdOutlineInsertComment } from "react-icons/md";

import Avatar from "../UI/Avatar";
import {
  excerpt,
  readTime,
  toTagList,
  CATEGORY_ICONS,
} from "../../utils/article";

/** Magazine-style spotlight card for the newest article on the feed. */
const FeaturedArticle = ({ article }) => {
  const history = useHistory();
  if (!article) return null;

  const tags = toTagList(article.tags);
  const minutes = readTime(article.articleBody);
  const preview = excerpt(article.articleBody, 240);

  const open = () => history.push(`/articles/${article._id}`);

  return (
    <article
      onClick={open}
      className="group surface animate-fadeUp mb-8 cursor-pointer overflow-hidden transition-all duration-300 ease-smooth hover:border-hair/[0.14] hover:shadow-cardHover"
    >
      <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        {/* ---------- visual ---------- */}
        <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[340px]">
          {article.selectedFile ? (
            <img
              src={article.selectedFile}
              alt={article.title}
              className="h-full w-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.05]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-brandSoft">
              <span className="font-mono text-[40px] font-semibold text-accent-400/50">
                {"</>"}
              </span>
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-scrim/80 via-scrim/10 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-ink-800/90" />

          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-accent-500/40 bg-scrim/75 px-3 py-1.5 text-[11.5px] font-semibold uppercase tracking-wide text-accent-200 backdrop-blur">
            <HiOutlineSparkles className="h-3.5 w-3.5" />
            Featured
          </span>
        </div>

        {/* ---------- content ---------- */}
        <div className="flex flex-col justify-center p-6 sm:p-8">
          {article.category && (
            <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-hair/[0.1] bg-hair/[0.04] px-3 py-1 text-[12px] font-medium text-primaryText2">
              <span>{CATEGORY_ICONS[article.category] || "✨"}</span>
              {article.category}
            </span>
          )}

          <h2 className="clamp-3 font-display text-[24px] font-extrabold leading-[1.2] tracking-tight text-primaryText4 transition-colors duration-200 group-hover:text-accent-300 sm:text-[30px]">
            {article.title}
          </h2>

          {preview && (
            <p className="clamp-3 mt-4 text-[14.5px] leading-relaxed text-primaryText1">
              {preview}
            </p>
          )}

          {!!tags.length && (
            <div className="mt-5 flex flex-wrap gap-y-2">
              {tags.slice(0, 4).map((tag, idx) => (
                <span key={idx} className="tags">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-hair/[0.07] pt-5">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar name={article.name} size="sm" />
              <div className="min-w-0 text-[12.5px] leading-tight">
                <p className="truncate font-semibold text-primaryText3">
                  {article.name}
                </p>
                <p className="mt-0.5 flex items-center gap-2 text-primaryText1">
                  <span>{moment(article.createdAt).fromNow()}</span>
                  <span className="text-primaryText1/50">•</span>
                  <span className="flex items-center gap-1">
                    <HiOutlineClock className="h-3.5 w-3.5" />
                    {minutes} min
                  </span>
                </p>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-3 text-[12.5px] text-primaryText1">
              <span className="flex items-center gap-1.5">
                <HiOutlineThumbUp className="h-4 w-4" />
                {article?.likes?.length || 0}
              </span>
              <span className="flex items-center gap-1.5">
                <MdOutlineInsertComment className="h-4 w-4" />
                {article?.comments?.length || 0}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <span className="btn-primary btn-sm">
              Read article
              <HiOutlineArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default FeaturedArticle;
