import React, { useEffect, useRef } from "react";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CharacterCount from "@tiptap/extension-character-count";
import Typography from "@tiptap/extension-typography";
import { HiOutlineCode, HiOutlineLink, HiOutlineTrash } from "react-icons/hi";

import lowlight from "./lowlight";
import TiptapToolbar from "./TiptapToolbar";

const TiptapEditor = ({ articleData, setArticleData }) => {
  // remembers what we last pushed upward, so external updates (loading an
  // article to edit) can be told apart from our own onUpdate echoes
  const lastHtml = useRef(articleData.articleBody || "");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // replaced by the lowlight version below
        heading: { levels: [1, 2, 3, 4] },
      }),
      Underline,
      Typography,
      Placeholder.configure({
        placeholder:
          "Write something here… try typing '## ' for a heading or '```' for a code block",
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer nofollow" },
      }),
      Image.configure({ allowBase64: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: "plaintext",
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({ nested: true }),
      CharacterCount,
    ],
    content: articleData.articleBody || "",
    editorProps: {
      attributes: {
        class: "article-prose tt-content",
        spellcheck: "true",
      },
    },
    onUpdate: ({ editor: ed }) => {
      const html = ed.isEmpty ? "" : ed.getHTML();
      lastHtml.current = html;
      setArticleData((prev) => ({ ...prev, articleBody: html }));
    },
  });

  // pull in content that arrived from outside (e.g. the edit route resolving)
  useEffect(() => {
    if (!editor) return;
    const incoming = articleData.articleBody || "";
    if (incoming !== lastHtml.current) {
      lastHtml.current = incoming;
      editor.commands.setContent(incoming, false);
    }
  }, [articleData.articleBody, editor]);

  const words = editor?.storage.characterCount.words() ?? 0;
  const chars = editor?.storage.characterCount.characters() ?? 0;

  return (
    <div className="tt-shell">
      <TiptapToolbar editor={editor} />

      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{
            duration: 120,
            appendTo: () => document.body,
            zIndex: 60,
          }}
          shouldShow={({ editor: ed, from, to }) =>
            from !== to && !ed.isActive("codeBlock") && !ed.isActive("image")
          }
        >
          <div className="bubble-toolbar !static !transform-none">
            <button
              type="button"
              title="Bold"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`bubble-btn font-extrabold ${
                editor.isActive("bold") ? "bubble-btn-active" : ""
              }`}
            >
              B
            </button>
            <button
              type="button"
              title="Italic"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`bubble-btn font-serif italic ${
                editor.isActive("italic") ? "bubble-btn-active" : ""
              }`}
            >
              I
            </button>
            <button
              type="button"
              title="Underline"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`bubble-btn underline ${
                editor.isActive("underline") ? "bubble-btn-active" : ""
              }`}
            >
              U
            </button>
            <button
              type="button"
              title="Strikethrough"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`bubble-btn line-through ${
                editor.isActive("strike") ? "bubble-btn-active" : ""
              }`}
            >
              S
            </button>

            <span className="bubble-sep" />

            <button
              type="button"
              title="Inline code"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={`bubble-btn ${
                editor.isActive("code") ? "bubble-btn-active" : ""
              }`}
            >
              <HiOutlineCode className="h-[17px] w-[17px]" />
            </button>
            <button
              type="button"
              title="Link"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                if (editor.isActive("link"))
                  return editor.chain().focus().unsetLink().run();
                // eslint-disable-next-line no-alert
                const url = window.prompt("Link URL", "https://");
                if (url && url.trim() && url.trim() !== "https://")
                  editor
                    .chain()
                    .focus()
                    .setLink({ href: url.trim(), target: "_blank" })
                    .run();
              }}
              className={`bubble-btn ${
                editor.isActive("link") ? "bubble-btn-active" : ""
              }`}
            >
              <HiOutlineLink className="h-[16px] w-[16px]" />
            </button>

            <span className="bubble-sep" />

            <button
              type="button"
              title="Heading 2"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={`bubble-btn ${
                editor.isActive("heading", { level: 2 })
                  ? "bubble-btn-active"
                  : ""
              }`}
            >
              H2
            </button>
            <button
              type="button"
              title="Heading 3"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={`bubble-btn ${
                editor.isActive("heading", { level: 3 })
                  ? "bubble-btn-active"
                  : ""
              }`}
            >
              H3
            </button>
            <button
              type="button"
              title="Quote"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`bubble-btn ${
                editor.isActive("blockquote") ? "bubble-btn-active" : ""
              }`}
            >
              ”
            </button>
            <button
              type="button"
              title="Bullet list"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`bubble-btn ${
                editor.isActive("bulletList") ? "bubble-btn-active" : ""
              }`}
            >
              •
            </button>

            <span className="bubble-sep" />

            <button
              type="button"
              title="Clear formatting"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() =>
                editor.chain().focus().unsetAllMarks().clearNodes().run()
              }
              className="bubble-btn"
            >
              <HiOutlineTrash className="h-[15px] w-[15px]" />
            </button>
          </div>
        </BubbleMenu>
      )}

      <EditorContent editor={editor} />

      <div className="tt-footer">
        <span className="badge">Tiptap</span>
        <span>
          {words} {words === 1 ? "word" : "words"} · {chars} characters
        </span>
        <span className="ml-auto hidden sm:inline">
          Markdown shortcuts: <code>## </code> <code>- </code> <code>&gt; </code>{" "}
          <code>```</code>
        </span>
      </div>
    </div>
  );
};

export default TiptapEditor;
