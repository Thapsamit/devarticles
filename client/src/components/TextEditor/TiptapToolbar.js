import React, { useRef } from "react";
import {
  HiOutlineLink,
  HiOutlineCode,
  HiOutlinePhotograph,
  HiOutlineTable,
  HiOutlineTrash,
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
  HiOutlineMinus,
} from "react-icons/hi";
import { LANGUAGES } from "./lowlight";

const Btn = ({ active, disabled, title, onClick, children, className = "" }) => (
  <button
    type="button"
    title={title}
    disabled={disabled}
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    className={`tt-btn ${active ? "tt-btn-active" : ""} ${className}`}
  >
    {children}
  </button>
);

const Sep = () => <span className="tt-sep" />;

const TiptapToolbar = ({ editor }) => {
  const fileRef = useRef(null);

  if (!editor) return null;

  const chain = () => editor.chain().focus();

  const setLink = () => {
    const existing = editor.getAttributes("link").href;
    if (existing) return chain().unsetLink().run();

    // eslint-disable-next-line no-alert
    const url = window.prompt("Link URL", "https://");
    if (url && url.trim() && url.trim() !== "https://") {
      chain().setLink({ href: url.trim(), target: "_blank" }).run();
    }
  };

  const pickImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => chain().setImage({ src: reader.result }).run();
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const inCodeBlock = editor.isActive("codeBlock");
  const inTable = editor.isActive("table");

  return (
    <div className="tt-toolbar">
      <div className="tt-row">
        {/* history */}
        <Btn
          title="Undo"
          onClick={() => chain().undo().run()}
          disabled={!editor.can().undo()}
        >
          <HiOutlineArrowLeft className="h-4 w-4" />
        </Btn>
        <Btn
          title="Redo"
          onClick={() => chain().redo().run()}
          disabled={!editor.can().redo()}
        >
          <HiOutlineArrowRight className="h-4 w-4" />
        </Btn>

        <Sep />

        {/* block type */}
        <select
          className="tt-select"
          title="Text style"
          value={
            editor.isActive("heading", { level: 1 })
              ? "h1"
              : editor.isActive("heading", { level: 2 })
              ? "h2"
              : editor.isActive("heading", { level: 3 })
              ? "h3"
              : editor.isActive("heading", { level: 4 })
              ? "h4"
              : "p"
          }
          onChange={(e) => {
            const v = e.target.value;
            if (v === "p") chain().setParagraph().run();
            else
              chain()
                .toggleHeading({ level: Number(v.replace("h", "")) })
                .run();
          }}
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
        </select>

        <Sep />

        {/* inline */}
        <Btn
          title="Bold"
          active={editor.isActive("bold")}
          onClick={() => chain().toggleBold().run()}
          className="font-extrabold"
        >
          B
        </Btn>
        <Btn
          title="Italic"
          active={editor.isActive("italic")}
          onClick={() => chain().toggleItalic().run()}
          className="font-serif italic"
        >
          I
        </Btn>
        <Btn
          title="Underline"
          active={editor.isActive("underline")}
          onClick={() => chain().toggleUnderline().run()}
          className="underline"
        >
          U
        </Btn>
        <Btn
          title="Strikethrough"
          active={editor.isActive("strike")}
          onClick={() => chain().toggleStrike().run()}
          className="line-through"
        >
          S
        </Btn>
        <Btn
          title="Inline code"
          active={editor.isActive("code")}
          onClick={() => chain().toggleCode().run()}
        >
          <HiOutlineCode className="h-4 w-4" />
        </Btn>

        <Sep />

        {/* blocks */}
        <Btn
          title="Bullet list"
          active={editor.isActive("bulletList")}
          onClick={() => chain().toggleBulletList().run()}
        >
          •
        </Btn>
        <Btn
          title="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => chain().toggleOrderedList().run()}
        >
          1.
        </Btn>
        <Btn
          title="Task list"
          active={editor.isActive("taskList")}
          onClick={() => chain().toggleTaskList().run()}
        >
          ☑
        </Btn>
        <Btn
          title="Quote"
          active={editor.isActive("blockquote")}
          onClick={() => chain().toggleBlockquote().run()}
        >
          ”
        </Btn>
        <Btn
          title="Code block"
          active={inCodeBlock}
          onClick={() => chain().toggleCodeBlock().run()}
        >
          {"{ }"}
        </Btn>
        <Btn title="Divider" onClick={() => chain().setHorizontalRule().run()}>
          <HiOutlineMinus className="h-4 w-4" />
        </Btn>

        <Sep />

        {/* insert */}
        <Btn
          title="Link"
          active={editor.isActive("link")}
          onClick={setLink}
        >
          <HiOutlineLink className="h-4 w-4" />
        </Btn>
        <Btn title="Image" onClick={() => fileRef.current?.click()}>
          <HiOutlinePhotograph className="h-4 w-4" />
        </Btn>
        <Btn
          title="Insert table"
          onClick={() =>
            chain()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
        >
          <HiOutlineTable className="h-4 w-4" />
        </Btn>

        <Sep />

        {/* alignment */}
        <Btn
          title="Align left"
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => chain().setTextAlign("left").run()}
        >
          ⇤
        </Btn>
        <Btn
          title="Align centre"
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => chain().setTextAlign("center").run()}
        >
          ↔
        </Btn>
        <Btn
          title="Align right"
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => chain().setTextAlign("right").run()}
        >
          ⇥
        </Btn>

        <Sep />

        <Btn
          title="Clear formatting"
          onClick={() => chain().unsetAllMarks().clearNodes().run()}
        >
          <HiOutlineTrash className="h-4 w-4" />
        </Btn>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={pickImage}
        />
      </div>

      {/* contextual: code block language */}
      {inCodeBlock && (
        <div className="tt-contextual">
          <span className="tt-contextual-label">Language</span>
          <select
            className="tt-select"
            value={editor.getAttributes("codeBlock").language || "plaintext"}
            onChange={(e) =>
              chain().updateAttributes("codeBlock", {
                language: e.target.value,
              }).run()
            }
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* contextual: table controls */}
      {inTable && (
        <div className="tt-contextual">
          <span className="tt-contextual-label">Table</span>
          <Btn title="Add column" onClick={() => chain().addColumnAfter().run()}>
            +Col
          </Btn>
          <Btn title="Add row" onClick={() => chain().addRowAfter().run()}>
            +Row
          </Btn>
          <Btn
            title="Delete column"
            onClick={() => chain().deleteColumn().run()}
          >
            −Col
          </Btn>
          <Btn title="Delete row" onClick={() => chain().deleteRow().run()}>
            −Row
          </Btn>
          <Btn title="Delete table" onClick={() => chain().deleteTable().run()}>
            <HiOutlineTrash className="h-4 w-4" />
          </Btn>
        </div>
      )}
    </div>
  );
};

export default TiptapToolbar;
