import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  HiOutlineThumbUp,
  HiOutlineTrash,
  HiThumbUp,
  HiOutlineClock,
  HiOutlineArrowLeft,
  HiOutlineLink,
  HiOutlineCheck,
  HiOutlinePencilAlt,
  HiOutlineCalendar,
  HiOutlineViewList,
} from "react-icons/hi";
import { BsBookmarkPlus } from "react-icons/bs";
import { MdOutlineInsertComment } from "react-icons/md";
import moment from "moment";
import { useHistory, useParams, Link } from "react-router-dom";
import {
  getArticle,
  getArticles,
  likeArticle,
  deleteArticle,
  addingBookmark,
} from "../../actions/articles";

import CommentSection from "./CommentSection";
import Avatar from "../UI/Avatar";
import EmptyState from "../UI/EmptyState";
import Article from "../Articles/Article/Article";
import { useAuthModal } from "../../context/AuthModalContext";
import { readTime, toTagList, CATEGORY_ICONS } from "../../utils/article";

import { ArticleDetailSkeleton } from "../Loader/Loader";

/**
 * Adds stable ids to the headings inside the stored article HTML so the
 * table of contents can link into the body.
 */
const buildContents = (html = "") => {
  if (!html || typeof window === "undefined") return { html, toc: [] };

  try {
    const doc = new DOMParser().parseFromString(
      `<div id="root">${html}</div>`,
      "text/html",
    );
    const root = doc.getElementById("root");
    const nodes = root.querySelectorAll("h1, h2, h3");
    const toc = [];

    nodes.forEach((node, index) => {
      const text = (node.textContent || "").trim();
      if (!text) return;
      const id = `section-${index}-${text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 40)}`;
      node.setAttribute("id", id);
      toc.push({ id, text, level: Number(node.tagName.substring(1)) });
    });

    return { html: root.innerHTML, toc };
  } catch (err) {
    return { html, toc: [] };
  }
};

const PostDetails = () => {
  const { article, articles, isLoading } = useSelector(
    (state) => state.articles,
  );

  const history = useHistory();
  const { openAuth } = useAuthModal();
  const user = JSON.parse(localStorage.getItem("profile"));
  const userId = user?.result?._id || user?.result?.sub;

  const { id } = useParams();
  const dispatch = useDispatch();

  const [commentsCounts, setCommentsCounts] = useState(
    article?.comments?.length || 0,
  );
  const [likes, setLikes] = useState(article?.likes || []);
  const [copied, setCopied] = useState(false);
  const proseRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const hasLiked = likes?.find((like) => like === userId);
  const recommendedPosts = (articles || []).filter(({ _id }) => _id !== id);
  const isAuthor =
    user?.result?._id === article?.author ||
    user?.result?.sub === article?.author;

  const tags = toTagList(article?.tags);
  const minutes = readTime(article?.articleBody);

  const { html: bodyHtml, toc } = useMemo(
    () => buildContents(article?.articleBody),
    [article?.articleBody],
  );

  const handleLike = async () => {
    if (!user?.result) return openAuth("signin");
    await dispatch(likeArticle(article._id));
    if (hasLiked) {
      setLikes(likes.filter((likeId) => likeId !== userId));
    } else {
      setLikes([...likes, userId]);
    }
  };

  const handleBookmark = () => {
    if (!user?.result) return openAuth("signin");
    dispatch(addingBookmark(article._id));
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    dispatch(getArticles());
    dispatch(getArticle(id));
  }, [dispatch, id]);

  useEffect(() => {
    setLikes(article?.likes || []);
  }, [article]);

  // code blocks are stored unhighlighted; highlight.js is loaded on demand
  // and only for articles that actually contain a fenced language block
  useEffect(() => {
    const root = proseRef.current;
    if (!root || !root.querySelector('pre code[class*="language-"]')) return;

    let cancelled = false;
    import("../../utils/highlight").then(({ highlightWithin }) => {
      if (!cancelled) highlightWithin(root);
    });
    return () => {
      cancelled = true;
    };
  }, [bodyHtml]);

  useEffect(() => {
    const onScroll = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (isLoading) return <ArticleDetailSkeleton />;

  if (!article) {
    return (
      <div className="box my-16">
        <EmptyState
          icon="🧭"
          title="Article not found"
          description="This article may have been removed, or the link is incorrect."
          action={
            <Link to="/articles">
              <button className="btn-primary">Back to articles</button>
            </Link>
          }
        />
      </div>
    );
  }

  /* ---------------- reusable actions ---------------- */

  const RailButton = ({ onClick, active, title, children, danger }) => (
    <button
      onClick={onClick}
      title={title}
      className={`flex h-11 w-11 flex-col items-center justify-center rounded-xl2 border transition-all duration-200 ${
        active
          ? "border-accent-500/[0.45] bg-accent-500/[0.14] text-accent-300"
          : danger
            ? "border-hair/[0.08] bg-hair/[0.04] text-primaryText1 hover:border-red-500/30 hover:bg-red-500/[0.12] hover:text-dangerText"
            : "border-hair/[0.08] bg-hair/[0.04] text-primaryText1 hover:bg-hair/[0.09] hover:text-primaryText4"
      }`}
    >
      {children}
    </button>
  );

  const ActionSet = ({ layout = "rail" }) => (
    <div
      className={
        layout === "rail" ? "flex flex-col gap-2" : "flex flex-wrap gap-2"
      }
    >
      <RailButton
        onClick={handleLike}
        active={!!hasLiked}
        title={user?.result ? "Like this article" : "Sign in to like"}
      >
        {hasLiked ? (
          <HiThumbUp className="h-[18px] w-[18px]" />
        ) : (
          <HiOutlineThumbUp className="h-[18px] w-[18px]" />
        )}
        <span className="mt-0.5 text-[10.5px] font-semibold">
          {likes?.length || 0}
        </span>
      </RailButton>

      <RailButton
        onClick={() =>
          document
            .getElementById("comments")
            ?.scrollIntoView({ behavior: "smooth", block: "start" })
        }
        title="Jump to comments"
      >
        <MdOutlineInsertComment className="h-[18px] w-[18px]" />
        <span className="mt-0.5 text-[10.5px] font-semibold">
          {commentsCounts}
        </span>
      </RailButton>

      <RailButton onClick={handleBookmark} title="Bookmark">
        <BsBookmarkPlus className="h-[17px] w-[17px]" />
      </RailButton>

      <RailButton onClick={copyLink} title="Copy link" active={copied}>
        {copied ? (
          <HiOutlineCheck className="h-[18px] w-[18px]" />
        ) : (
          <HiOutlineLink className="h-[18px] w-[18px]" />
        )}
      </RailButton>

      {isAuthor && (
        <>
          <RailButton
            onClick={() => history.push(`/editArticle/${article._id}`)}
            title="Edit article"
          >
            <HiOutlinePencilAlt className="h-[18px] w-[18px]" />
          </RailButton>
          <RailButton
            danger
            title="Delete article"
            onClick={() => {
              dispatch(deleteArticle(article._id))
                .then(() => history.push("/articles"))
                .catch((err) => console.log(err));
            }}
          >
            <HiOutlineTrash className="h-[18px] w-[18px]" />
          </RailButton>
        </>
      )}
    </div>
  );

  return (
    <>
      {/* reading progress */}
      <div className="fixed left-0 top-16 z-40 h-[3px] w-full">
        <div
          className="h-full bg-brand transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ================= HERO ================= */}
      <header className="relative overflow-hidden border-b border-hair/[0.07]">
        {article.selectedFile ? (
          <>
            <img
              src={article.selectedFile}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full scale-110 object-cover opacity-25 blur-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-ink-900/70 via-ink-900/80 to-ink-900" />
          </>
        ) : (
          <>
            <div className="pointer-events-none absolute inset-0 bg-grid bg-gridcell opacity-60" />
            <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-16 top-0 h-72 w-72 rounded-full bg-violet2/20 blur-3xl" />
          </>
        )}

        <div className="box relative pb-14 pt-8 sm:pb-16">
          <button
            onClick={() => history.push("/articles")}
            className="inline-flex items-center gap-2 text-[13.5px] text-primaryText2 transition-colors hover:text-accent-300"
          >
            <HiOutlineArrowLeft className="h-4 w-4" />
            Back to articles
          </button>

          <div className="mx-auto mt-8 max-w-[820px]">
            {article.category && (
              <Link
                to={`/articles/categories?category=${article.category
                  .split(" ")
                  .join("+")}`}
              >
                <span className="badge">
                  <span>{CATEGORY_ICONS[article.category] || "✨"}</span>
                  {article.category}
                </span>
              </Link>
            )}

            <h1 className="mt-5 font-display text-[30px] font-extrabold leading-[1.13] tracking-tight text-primaryText4 sm:text-[44px]">
              {article.title}
            </h1>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
              <div className="flex items-center gap-3">
                <Avatar name={article.name} size="md" />
                <div className="text-[13px]">
                  <p className="font-semibold text-primaryText4">
                    {article.name}
                  </p>
                  <p className="mt-0.5 text-primaryText1">Author</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-primaryText1">
                <span className="flex items-center gap-1.5">
                  <HiOutlineCalendar className="h-4 w-4" />
                  {moment(article.createdAt).format("MMM D, YYYY")}
                </span>
                <span className="flex items-center gap-1.5">
                  <HiOutlineClock className="h-4 w-4" />
                  {minutes} min read
                </span>
                <span className="flex items-center gap-1.5">
                  <HiOutlineThumbUp className="h-4 w-4" />
                  {likes?.length || 0}
                </span>
                <span className="flex items-center gap-1.5">
                  <MdOutlineInsertComment className="h-4 w-4" />
                  {commentsCounts}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ================= BODY ================= */}
      <div className="box">
        <div className="mx-auto max-w-[980px]">
          {/* crisp cover, overlapping the hero */}
          {article.selectedFile && (
            <div className="animate-fadeUp -mt-8 overflow-hidden rounded-2xl border border-hair/[0.09] shadow-cardHover">
              <img
                src={article.selectedFile}
                alt={article.title}
                className="h-[220px] w-full object-cover sm:h-[400px]"
              />
            </div>
          )}

          <div className="mt-10 lg:grid lg:grid-cols-[56px_minmax(0,1fr)] lg:gap-8">
            {/* left action rail */}
            <div className="hidden lg:block">
              <div className="sticky top-28">
                <ActionSet layout="rail" />
              </div>
            </div>

            <div className="min-w-0">
              {/* mobile actions */}
              <div className="mb-7 lg:hidden">
                <ActionSet layout="row" />
              </div>

              {!!tags.length && (
                <div className="mb-7 flex flex-wrap gap-y-2">
                  {tags.map((tag, idx) => (
                    <span key={idx} className="tags">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* table of contents */}
              {toc.length >= 3 && (
                <nav className="surface-soft mb-8 p-5">
                  <h3 className="customHeadings flex items-center gap-2">
                    <HiOutlineViewList className="h-4 w-4" />
                    Contents
                  </h3>
                  <ol className="mt-3 space-y-1.5">
                    {toc.map((item) => (
                      <li
                        key={item.id}
                        style={{ paddingLeft: (item.level - 1) * 14 }}
                      >
                        <a
                          href={`#${item.id}`}
                          className="text-[13.5px] text-primaryText2 transition-colors hover:text-accent-300"
                        >
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}

              {/* article body */}
              <div className="article-prose" ref={proseRef}>
                <div
                  className="ql-editor"
                  dangerouslySetInnerHTML={{ __html: bodyHtml }}
                />
              </div>

              {/* author footer */}
              <div className="surface mt-12 flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center">
                <Avatar name={article.name} size="lg" />
                <div className="min-w-0 flex-1">
                  <p className="customHeadings">Written by</p>
                  <p className="mt-1.5 font-display text-[18px] font-bold text-primaryText4">
                    {article.name}
                  </p>
                  <p className="mt-1 text-[13.5px] text-primaryText1">
                    Published {moment(article.createdAt).fromNow()} · {minutes}{" "}
                    min read
                  </p>
                </div>
                <button
                  onClick={copyLink}
                  className="btn-ghost btn-sm shrink-0"
                >
                  {copied ? (
                    <>
                      <HiOutlineCheck className="h-4 w-4 text-mint" />
                      Copied
                    </>
                  ) : (
                    <>
                      <HiOutlineLink className="h-4 w-4" />
                      Share
                    </>
                  )}
                </button>
              </div>

              {/* comments */}
              <section id="comments" className="mt-12 scroll-mt-28">
                <h2 className="section-title text-[21px]">
                  Comments{" "}
                  <span className="text-primaryText1">({commentsCounts})</span>
                </h2>
                <CommentSection
                  article={article}
                  commentsCount={commentsCounts}
                  setCommentsCount={setCommentsCounts}
                />
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* ================= READ NEXT ================= */}
      {!!recommendedPosts.length && (
        <section className="mt-16 border-t border-hair/[0.07] bg-ink-900/40 py-14">
          <div className="box">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="section-title">Read next</h2>
                <p className="mt-1 text-[13.5px] text-primaryText1">
                  More from the DevArticles community.
                </p>
              </div>
              <Link to="/articles">
                <button className="btn-ghost btn-sm">View all</button>
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {recommendedPosts.slice(0, 3).map((post) => (
                <Article key={post._id} article={post} variant="grid" />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default PostDetails;
