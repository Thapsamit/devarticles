import React, { useState } from "react";
import {
  HiOutlineThumbUp,
  HiOutlineTrash,
  HiThumbUp,
  HiOutlineClock,
  HiOutlineArrowRight,
} from "react-icons/hi";

import { BsBookmarkPlus, BsPencilSquare } from "react-icons/bs";
import { MdOutlineInsertComment } from "react-icons/md";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { useDispatch } from "react-redux";
import {
  deleteArticle,
  likeArticle,
  addingBookmark,
} from "../../../actions/articles";
import Avatar from "../../UI/Avatar";
import { useAuthModal } from "../../../context/AuthModalContext";
import {
  excerpt,
  readTime,
  toTagList,
  CATEGORY_ICONS,
} from "../../../utils/article";

const Article = ({ article, variant = "grid" }) => {
  const [likes, setLikes] = useState(article?.likes || []);
  const history = useHistory();
  const dispatch = useDispatch();
  const { openAuth } = useAuthModal();

  const user = JSON.parse(localStorage.getItem("profile"));
  const userId = user?.result?._id || user?.result?.sub;
  const hasLiked = likes.find((like) => like === userId);
  const isAuthor =
    user?.result?._id === article?.author ||
    user?.result?.sub === article?.author;

  const tags = toTagList(article.tags);
  const preview = excerpt(article.articleBody, variant === "list" ? 180 : 130);
  const minutes = readTime(article.articleBody);

  const openArticle = () => history.push(`/articles/${article._id}`);

  const stop = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const addBookmark = (e) => {
    stop(e);
    if (!user?.result) return openAuth("signin");
    dispatch(addingBookmark(article._id));
  };

  const handleLikeClick = (e) => {
    stop(e);
    if (!user?.result) return openAuth("signin");

    dispatch(likeArticle(article._id));
    if (hasLiked) {
      setLikes(likes.filter((id) => id !== userId));
    } else {
      setLikes([...likes, userId]);
    }
  };

  /* ---------------- shared pieces ---------------- */

  const Cover = ({ className = "" }) => (
    <div className={`relative overflow-hidden ${className}`}>
      {article.selectedFile ? (
        <img
          src={article.selectedFile}
          alt={article.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.07]"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-brandSoft">
          <span className="font-mono text-[26px] font-semibold text-accent-400/60">
            {"</>"}
          </span>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-scrim/70 via-transparent to-transparent" />

      {article.category && (
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-scrim/70 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
          <span>{CATEGORY_ICONS[article.category] || "✨"}</span>
          {article.category}
        </span>
      )}

      <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-scrim/70 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
        <HiOutlineClock className="h-3.5 w-3.5" />
        {minutes} min
      </span>
    </div>
  );

  const AuthorRow = () => (
    <div className="flex min-w-0 items-center gap-2.5">
      <Avatar name={article.name} size="xs" />
      <div className="min-w-0 text-[12px] leading-tight">
        <p className="truncate font-semibold text-primaryText3">
          {article.name}
        </p>
        <p className="text-primaryText1">
          {moment(article.createdAt).fromNow()}
        </p>
      </div>
    </div>
  );

  const Actions = () => (
    <div className="flex items-center gap-0.5">
      <button
        onClick={handleLikeClick}
        title={user?.result ? "Like" : "Sign in to like"}
        className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 transition-colors duration-200 hover:bg-hair/[0.06] ${
          hasLiked
            ? "text-accent-400"
            : "text-primaryText1 hover:text-accent-300"
        }`}
      >
        {hasLiked ? (
          <HiThumbUp className="h-[16px] w-[16px]" />
        ) : (
          <HiOutlineThumbUp className="h-[16px] w-[16px]" />
        )}
        <span className="text-[12.5px] font-medium">{likes.length}</span>
      </button>

      <button
        onClick={(e) => {
          stop(e);
          openArticle();
        }}
        title="Comments"
        className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-primaryText1 transition-colors duration-200 hover:bg-hair/[0.06] hover:text-amber2"
      >
        <MdOutlineInsertComment className="h-[16px] w-[16px]" />
        <span className="text-[12.5px] font-medium">
          {article?.comments?.length || 0}
        </span>
      </button>

      <button
        onClick={addBookmark}
        title="Bookmark"
        className="rounded-lg px-2 py-1.5 text-primaryText1 transition-colors duration-200 hover:bg-hair/[0.06] hover:text-mint"
      >
        <BsBookmarkPlus className="h-[15px] w-[15px]" />
      </button>

      {isAuthor && (
        <>
          <button
            onClick={(e) => {
              stop(e);
              history.push(`/editArticle/${article._id}`);
            }}
            title="Edit"
            className="rounded-lg px-2 py-1.5 text-primaryText1 transition-colors duration-200 hover:bg-hair/[0.06] hover:text-accent-300"
          >
            <BsPencilSquare className="h-[15px] w-[15px]" />
          </button>
          <button
            onClick={(e) => {
              stop(e);
              dispatch(deleteArticle(article._id));
            }}
            title="Delete"
            className="rounded-lg px-2 py-1.5 text-primaryText1 transition-colors duration-200 hover:bg-red-500/[0.12] hover:text-dangerText"
          >
            <HiOutlineTrash className="h-[16px] w-[16px]" />
          </button>
        </>
      )}
    </div>
  );

  const Tags = ({ max }) =>
    tags.length ? (
      <div className="flex flex-wrap gap-y-2">
        {tags.slice(0, max).map((tag, idx) => (
          <span key={idx} className="tags">
            #{tag}
          </span>
        ))}
        {tags.length > max && (
          <span className="tags">+{tags.length - max}</span>
        )}
      </div>
    ) : null;

  /* ---------------- list variant ---------------- */

  if (variant === "list") {
    return (
      <article
        onClick={openArticle}
        className="group surface animate-fadeUp flex cursor-pointer flex-col gap-5 overflow-hidden p-4 transition-all duration-300 ease-smooth hover:-translate-y-1 hover:border-hair/[0.14] hover:shadow-cardHover sm:flex-row sm:p-5"
      >
        <Cover className="h-44 w-full shrink-0 rounded-xl2 border border-hair/[0.07] sm:h-[140px] sm:w-[220px]" />

        <div className="flex min-w-0 flex-1 flex-col">
          <h3 className="clamp-2 font-display text-[18px] font-bold leading-snug text-primaryText4 transition-colors duration-200 group-hover:text-accent-300 sm:text-[19.5px]">
            {article.title}
          </h3>

          {preview && (
            <p className="clamp-2 mt-2 text-[14px] leading-relaxed text-primaryText1">
              {preview}
            </p>
          )}

          <div className="mt-3">
            <Tags max={4} />
          </div>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
            <AuthorRow />
            <Actions />
          </div>
        </div>
      </article>
    );
  }

  /* ---------------- grid variant ---------------- */

  return (
    <article
      onClick={openArticle}
      className="group surface animate-fadeUp flex h-full cursor-pointer flex-col overflow-hidden transition-all duration-300 ease-smooth hover:-translate-y-1.5 hover:border-hair/[0.14] hover:shadow-cardHover"
    >
      <Cover className="aspect-[16/9] w-full border-b border-hair/[0.07]" />

      <div className="flex flex-1 flex-col p-5">
        <h3 className="clamp-2 font-display text-[17.5px] font-bold leading-snug text-primaryText4 transition-colors duration-200 group-hover:text-accent-300">
          {article.title}
        </h3>

        {preview && (
          <p className="clamp-3 mt-2.5 text-[13.5px] leading-relaxed text-primaryText1">
            {preview}
          </p>
        )}

        <div className="mt-3.5">
          <Tags max={3} />
        </div>

        <div className="mt-5 flex items-center gap-1.5 text-[13px] font-semibold text-accent-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Read article
          <HiOutlineArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-hair/[0.07] pt-4">
          <AuthorRow />
          <Actions />
        </div>
      </div>
    </article>
  );
};

export default Article;
