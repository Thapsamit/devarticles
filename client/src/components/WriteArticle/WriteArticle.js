import FileBase64 from "react-file-base64";
import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { createArticle, updateArticle } from "../../actions/articles";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import {
  HiOutlineTrash,
  HiOutlineArrowLeft,
  HiOutlineEye,
  HiOutlinePencilAlt,
  HiOutlineX,
  HiOutlineCheckCircle,
  HiOutlineRefresh,
  HiOutlineClock,
  HiOutlineUpload,
} from "react-icons/hi";
import categories from "../../categories.json";
import TextEditor from "../TextEditor/TextEditor";
import EmptyState from "../UI/EmptyState";
import Avatar from "../UI/Avatar";
import { toTagList, stripHtml, CATEGORY_ICONS } from "../../utils/article";
import { useAuthModal } from "../../context/AuthModalContext";

const TiptapEditor = lazy(() => import("../TextEditor/TiptapEditor"));

const EDITOR_KEY = "devarticles:editor";

const emptyArticle = {
  title: "",
  articleBody: "",
  tags: "",
  selectedFile: "",
  category: "",
};

const WriteArticle = () => {
  const [isLoad, setIsLoad] = useState(false);
  const [tab, setTab] = useState("write");
  const [tagDraft, setTagDraft] = useState("");
  const [editorKind, setEditorKind] = useState(
    () => localStorage.getItem(EDITOR_KEY) || "quill"
  );

  const changeEditor = (kind) => {
    setEditorKind(kind);
    localStorage.setItem(EDITOR_KEY, kind);
  };

  const { id } = useParams();

  const article = useSelector((state) =>
    id ? state.articles.articles.find((p) => p._id === id) : null
  );

  const [articleData, setArticleData] = useState(
    article ? { ...article } : emptyArticle
  );

  const dispatch = useDispatch();
  const history = useHistory();
  const { openAuth } = useAuthModal();
  const user = JSON.parse(localStorage.getItem("profile"));
  const titleRef = useRef(null);
  const previewRef = useRef(null);

  const update = (patch) => setArticleData((prev) => ({ ...prev, ...patch }));

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsLoad(true);

    if (id) {
      await dispatch(
        updateArticle(id, { ...articleData, name: user?.result?.name })
      );
    } else {
      await dispatch(
        createArticle({ ...articleData, name: user?.result?.name })
      );
    }
    setArticleData(emptyArticle);
    history.push("/articles");
  };

  const clear = (e) => {
    if (e) e.preventDefault();
    setArticleData(emptyArticle);
    setTagDraft("");
    setTab("write");
  };

  const getFiles = (files) => update({ selectedFile: files.base64 });

  useEffect(() => {
    if (article) setArticleData(article);
  }, [article]);

  // the preview should look exactly like the published article, so code
  // blocks get the same on-demand highlighting pass as the reading page
  useEffect(() => {
    const root = previewRef.current;
    if (tab !== "preview" || !root) return;
    if (!root.querySelector('pre code[class*="language-"]')) return;

    let cancelled = false;
    import("../../utils/highlight").then(({ highlightWithin }) => {
      if (!cancelled) highlightWithin(root);
    });
    return () => {
      cancelled = true;
    };
  }, [tab, articleData.articleBody]);

  // keep the borderless title field sized to its content
  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [articleData.title, tab]);

  /* ---------------- derived ---------------- */

  const tags = toTagList(articleData.tags);
  const plainBody = stripHtml(articleData.articleBody);
  const wordCount = plainBody.split(" ").filter(Boolean).length;
  const minutes = Math.max(1, Math.round(wordCount / 200));
  const canPublish = Boolean(articleData.title.trim()) && wordCount > 0;

  const checklist = [
    { label: "Add a title", done: Boolean(articleData.title.trim()) },
    { label: "Write the content", done: wordCount > 0 },
    { label: "Pick a category", done: Boolean(articleData.category) },
    { label: "Add a cover image", done: Boolean(articleData.selectedFile) },
    { label: "Add at least one tag", done: tags.length > 0 },
  ];
  const readyCount = checklist.filter((c) => c.done).length;

  /* ---------------- tags ---------------- */

  const commitTags = (raw) => {
    const incoming = raw
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter(Boolean);
    if (!incoming.length) return;

    const merged = [...tags];
    incoming.forEach((t) => {
      if (!merged.some((x) => x.toLowerCase() === t.toLowerCase()))
        merged.push(t);
    });
    update({ tags: merged });
    setTagDraft("");
  };

  const removeTag = (tag) => update({ tags: tags.filter((t) => t !== tag) });

  const onTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commitTags(tagDraft);
    } else if (e.key === "Backspace" && !tagDraft && tags.length) {
      update({ tags: tags.slice(0, -1) });
    }
  };

  /* ---------------- gate ---------------- */

  if (!user?.result?.name) {
    return (
      <div className="box my-16">
        <EmptyState
          icon="🔒"
          title="Sign in to write"
          description="You need an account before you can publish an article on DevArticles."
          action={
            <button className="btn-primary" onClick={() => openAuth("signin")}>
              Sign in
            </button>
          }
        />
      </div>
    );
  }

  /* ---------------- view ---------------- */

  return (
    <form onSubmit={handleSubmit}>
      {/* ================= STUDIO BAR ================= */}
      <div className="sticky top-16 z-30 border-b border-hair/[0.07] bg-ink-900/85 backdrop-blur-xl">
        <div className="box flex h-16 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => history.push("/articles")}
              className="icon-btn h-9 w-9 shrink-0"
              title="Back to articles"
            >
              <HiOutlineArrowLeft className="h-[17px] w-[17px]" />
            </button>
            <div className="min-w-0">
              <p className="truncate font-display text-[15px] font-bold text-primaryText4">
                {id ? "Editing article" : "New article"}
              </p>
              <p className="hidden text-[12px] text-primaryText1 sm:flex sm:items-center sm:gap-2">
                <span>
                  {wordCount} {wordCount === 1 ? "word" : "words"}
                </span>
                <span className="text-primaryText1/50">•</span>
                <span className="flex items-center gap-1">
                  <HiOutlineClock className="h-3.5 w-3.5" />
                  {minutes} min read
                </span>
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {/* write / preview */}
            <div className="flex items-center gap-1 rounded-xl2 border border-hair/[0.09] bg-hair/[0.04] p-1">
              <button
                type="button"
                onClick={() => setTab("write")}
                title="Write"
                className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-medium transition-colors ${
                  tab === "write"
                    ? "bg-accent-500/[0.16] text-accent-300"
                    : "text-primaryText1 hover:text-primaryText4"
                }`}
              >
                <HiOutlinePencilAlt className="h-4 w-4" />
                <span className="hidden sm:inline">Write</span>
              </button>
              <button
                type="button"
                onClick={() => setTab("preview")}
                title="Preview"
                className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-medium transition-colors ${
                  tab === "preview"
                    ? "bg-accent-500/[0.16] text-accent-300"
                    : "text-primaryText1 hover:text-primaryText4"
                }`}
              >
                <HiOutlineEye className="h-4 w-4" />
                <span className="hidden sm:inline">Preview</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoad || !canPublish}
              title={
                canPublish ? undefined : "Add a title and some content first"
              }
              className="btn-primary btn-sm"
            >
              {isLoad ? "Publishing…" : id ? "Save" : "Publish"}
            </button>
          </div>
        </div>
      </div>

      {/* ================= CANVAS ================= */}
      <div className="box py-8">
        <div className="mx-auto max-w-[860px]">
          {/* ---------- cover ---------- */}
          {articleData.selectedFile ? (
            <div className="relative overflow-hidden rounded-2xl border border-hair/[0.09]">
              <img
                src={articleData.selectedFile}
                alt="Cover"
                className="h-52 w-full object-cover sm:h-72"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-scrim/60 to-transparent" />
              <div className="absolute right-3 top-3 flex items-center gap-2">
                <div className="file-picker">
                  <span className="btn btn-sm border border-white/20 bg-scrim/70 text-white backdrop-blur">
                    <HiOutlineRefresh className="h-4 w-4" />
                    Replace
                  </span>
                  <FileBase64 multiple={false} onDone={getFiles} />
                </div>
                <button
                  type="button"
                  onClick={() => update({ selectedFile: "" })}
                  className="btn btn-sm border border-red-400/40 bg-scrim/70 text-red-200 backdrop-blur"
                >
                  <HiOutlineTrash className="h-4 w-4" />
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="file-picker flex h-40 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-hair/[0.12] bg-hair/[0.02] text-center transition-colors hover:border-accent-500/40 hover:bg-hair/[0.035] sm:h-48">
              <HiOutlineUpload className="h-7 w-7 text-primaryText1" />
              <p className="mt-2.5 text-[14px] font-semibold text-primaryText2">
                Add a cover image
              </p>
              <p className="mt-1 text-[12.5px] text-primaryText1">
                Click to upload · landscape (16:9) looks best
              </p>
              <FileBase64 multiple={false} onDone={getFiles} />
            </div>
          )}

          {/* ---------- title ---------- */}
          <div className="mt-8">
            <textarea
              ref={titleRef}
              rows={1}
              className="title-input"
              placeholder="Article title…"
              value={articleData.title}
              onChange={(e) => update({ title: e.target.value })}
            />
          </div>

          {/* ---------- author line ---------- */}
          <div className="mt-5 flex items-center gap-3">
            <Avatar
              name={user?.result?.name}
              src={user?.result?.picture || undefined}
              size="sm"
            />
            <p className="text-[13px] text-primaryText1">
              by{" "}
              <span className="font-semibold text-primaryText3">
                {user?.result?.name}
              </span>
            </p>
          </div>

          <div className="divider my-7" />

          {/* ---------- category ---------- */}
          <div>
            <p className="customHeadings">Category</p>
            <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
              {categories.categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() =>
                    update({ category: articleData.category === c ? "" : c })
                  }
                  className={`chip shrink-0 whitespace-nowrap ${
                    articleData.category === c ? "chip-active" : ""
                  }`}
                >
                  <span>{CATEGORY_ICONS[c] || "✨"}</span>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* ---------- tags ---------- */}
          <div className="mt-6">
            <p className="customHeadings">Tags</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl2 border border-hair/[0.09] bg-ink-850/80 px-3 py-2.5 transition-colors focus-within:border-accent-500/70">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 rounded-full border border-accent-500/30 bg-accent-500/[0.12] py-1 pl-2.5 pr-1.5 text-[12.5px] font-medium text-accent-200"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    aria-label={`Remove ${tag}`}
                    className="rounded-full p-0.5 text-accent-300 transition-colors hover:bg-accent-500/25 hover:text-primaryText4"
                  >
                    <HiOutlineX className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagDraft}
                onChange={(e) => setTagDraft(e.target.value)}
                onKeyDown={onTagKeyDown}
                onBlur={() => commitTags(tagDraft)}
                placeholder={
                  tags.length ? "Add another…" : "react, hooks, javascript"
                }
                className="min-w-[140px] flex-1 bg-transparent text-[14px] text-primaryText4 outline-none placeholder:text-[13.5px] placeholder:text-primaryText1"
              />
            </div>
            <p className="mt-2 text-[12px] text-primaryText1">
              Press Enter or comma to add a tag · Backspace removes the last one
            </p>
          </div>

          <div className="divider my-7" />

          {/* ---------- editor / preview ---------- */}
          {tab === "write" ? (
            <div>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <p className="customHeadings">Content</p>

                <div className="flex items-center gap-3">
                  <span className="text-[12px] text-primaryText1">
                    {wordCount} {wordCount === 1 ? "word" : "words"}
                  </span>

                  {/* temporary: compare the two editors side by side */}
                  <div className="flex items-center gap-1 rounded-xl2 border border-hair/[0.09] bg-hair/[0.04] p-1">
                    <button
                      type="button"
                      onClick={() => changeEditor("quill")}
                      className={`h-7 rounded-lg px-2.5 text-[12px] font-medium transition-colors ${
                        editorKind === "quill"
                          ? "bg-accent-500/[0.16] text-accent-300"
                          : "text-primaryText1 hover:text-primaryText4"
                      }`}
                    >
                      Quill
                    </button>
                    <button
                      type="button"
                      onClick={() => changeEditor("tiptap")}
                      className={`h-7 rounded-lg px-2.5 text-[12px] font-medium transition-colors ${
                        editorKind === "tiptap"
                          ? "bg-accent-500/[0.16] text-accent-300"
                          : "text-primaryText1 hover:text-primaryText4"
                      }`}
                    >
                      Tiptap ✨
                    </button>
                  </div>
                </div>
              </div>

              {editorKind === "tiptap" ? (
                <Suspense
                  fallback={
                    <div className="flex h-[340px] items-center justify-center rounded-xl2 border border-hair/[0.09] bg-ink-850 text-[13.5px] text-primaryText1">
                      Loading the Tiptap editor…
                    </div>
                  }
                >
                  <TiptapEditor
                    articleData={articleData}
                    setArticleData={setArticleData}
                  />
                </Suspense>
              ) : (
                <TextEditor
                  articleData={articleData}
                  setArticleData={setArticleData}
                  id={id}
                />
              )}
            </div>
          ) : (
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="badge">
                  <HiOutlineEye className="h-3.5 w-3.5" />
                  Preview
                </span>
                <span className="text-[12.5px] text-primaryText1">
                  This is how your article will read.
                </span>
              </div>

              <div className="surface p-6 sm:p-8">
                {articleData.category && (
                  <span className="badge mb-4">
                    <span>{CATEGORY_ICONS[articleData.category] || "✨"}</span>
                    {articleData.category}
                  </span>
                )}

                <h1 className="font-display text-[26px] font-extrabold leading-tight tracking-tight text-primaryText4 sm:text-[34px]">
                  {articleData.title || "Untitled article"}
                </h1>

                <div className="mt-5 flex items-center gap-3">
                  <Avatar
                    name={user?.result?.name}
                    src={user?.result?.picture || undefined}
                    size="sm"
                  />
                  <p className="flex items-center gap-2 text-[12.5px] text-primaryText1">
                    <span className="font-semibold text-primaryText3">
                      {user?.result?.name}
                    </span>
                    <span className="text-primaryText1/50">•</span>
                    <span className="flex items-center gap-1">
                      <HiOutlineClock className="h-3.5 w-3.5" />
                      {minutes} min read
                    </span>
                  </p>
                </div>

                {!!tags.length && (
                  <div className="mt-5 flex flex-wrap gap-y-2">
                    {tags.map((tag) => (
                      <span key={tag} className="tags">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="divider my-6" />

                {wordCount ? (
                  <div className="article-prose" ref={previewRef}>
                    <div
                      className="ql-editor"
                      dangerouslySetInnerHTML={{
                        __html: articleData.articleBody,
                      }}
                    />
                  </div>
                ) : (
                  <p className="py-8 text-center text-[14px] text-primaryText1">
                    Nothing to preview yet — switch back to Write and start
                    typing.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ---------- publish panel ---------- */}
          <div className="surface mt-10 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hair/[0.07] px-6 py-4">
              <div>
                <h3 className="font-display text-[16px] font-bold text-primaryText4">
                  {id ? "Save your changes" : "Ready to publish?"}
                </h3>
                <p className="mt-0.5 text-[13px] text-primaryText1">
                  {readyCount} of {checklist.length} recommended steps done
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={clear}
                  className="btn-gray btn-sm"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  disabled={isLoad || !canPublish}
                  className="btn-primary btn-sm"
                >
                  {isLoad
                    ? "Publishing…"
                    : id
                    ? "Save changes"
                    : "Publish article"}
                </button>
              </div>
            </div>

            <ul className="grid gap-x-6 gap-y-3 p-6 sm:grid-cols-2">
              {checklist.map((item) => (
                <li
                  key={item.label}
                  className={`flex items-center gap-2.5 text-[13.5px] transition-colors ${
                    item.done ? "text-primaryText3" : "text-primaryText1"
                  }`}
                >
                  <HiOutlineCheckCircle
                    className={`h-[18px] w-[18px] shrink-0 ${
                      item.done ? "text-mint" : "text-primaryText1/50"
                    }`}
                  />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </form>
  );
};

export default WriteArticle;
