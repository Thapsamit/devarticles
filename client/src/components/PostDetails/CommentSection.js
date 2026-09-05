import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { HiOutlinePaperAirplane, HiOutlineChatAlt2 } from "react-icons/hi";
import { commentArticle } from "../../actions/articles";
import { useAuthModal } from "../../context/AuthModalContext";
import Avatar from "../UI/Avatar";

/** Comments are stored as "Author Name:comment text" — split on the first colon only. */
const parseComment = (raw = "") => {
  const at = raw.indexOf(":");
  if (at === -1) return { author: "Anonymous", text: raw.trim() };
  return {
    author: raw.slice(0, at).trim() || "Anonymous",
    text: raw.slice(at + 1).trim(),
  };
};

const CommentSection = ({ article, commentsCount, setCommentsCount }) => {
  const [Comments, setComments] = useState(article?.comments || []);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);

  const dispatch = useDispatch();
  const { openAuth } = useAuthModal();
  const user = JSON.parse(localStorage.getItem("profile"));

  const handleClick = async () => {
    if (!comment.trim()) return;
    setSending(true);
    const formattedComment = `${user?.result?.name}:${comment}`;
    const newComments = await dispatch(
      commentArticle(formattedComment, article._id),
    );

    setComments(newComments);
    setComment("");
    setCommentsCount(commentsCount + 1);
    setSending(false);
  };

  useEffect(() => {
    if (article) {
      setCommentsCount(article?.comments?.length || 0);
    }
  }, [article, setCommentsCount]);

  return (
    <div className="mt-5">
      {/* ---------- composer ---------- */}
      {user?.result?.name ? (
        <div className="surface-soft p-4">
          <div className="flex items-start gap-3">
            <Avatar
              name={user?.result?.name}
              src={user?.result?.picture || undefined}
              size="sm"
            />
            <div className="min-w-0 flex-1">
              <input
                type="text"
                className="custom-input py-2.5"
                placeholder="Share your thoughts…"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleClick()}
              />
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-[12px] text-primaryText1">
                  Commenting as{" "}
                  <span className="text-primaryText3">{user.result.name}</span>
                </p>
                <button
                  className="btn-primary btn-sm"
                  onClick={handleClick}
                  disabled={!comment.trim() || sending}
                >
                  <HiOutlinePaperAirplane className="h-4 w-4 rotate-90" />
                  {sending ? "Posting…" : "Post"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="surface-soft flex flex-wrap items-center justify-between gap-3 p-4">
          <p className="text-[14px] text-primaryText2">
            Sign in to join the discussion.
          </p>
          <button
            onClick={() => openAuth("signin")}
            className="btn-outline btn-sm"
          >
            Sign in
          </button>
        </div>
      )}

      {/* ---------- list ---------- */}
      <div className="mt-6 space-y-3">
        {Comments && Comments.length ? (
          Comments.map((com, ind) => {
            const { author, text } = parseComment(com);
            return (
              <div
                key={ind}
                className="animate-fadeIn flex items-start gap-3 rounded-xl2 border border-hair/[0.06] bg-hair/[0.025] p-4 transition-colors hover:border-hair/[0.11]"
              >
                <Avatar name={author} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-semibold text-primaryText4">
                    {author}
                  </p>
                  <p className="mt-1 break-words text-[14px] leading-relaxed text-primaryText2">
                    {text}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl2 border border-dashed border-hair/[0.09] py-10 text-center">
            <HiOutlineChatAlt2 className="h-7 w-7 text-primaryText1" />
            <p className="mt-3 text-[14px] font-medium text-primaryText2">
              No comments yet
            </p>
            <p className="mt-1 text-[13px] text-primaryText1">
              Be the first to start the conversation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
