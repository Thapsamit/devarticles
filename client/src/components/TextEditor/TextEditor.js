import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import EditorToolbar, { modules, formats } from "./EditorToolbar";
import BubbleToolbar from "./BubbleToolbar";

const BUBBLE_WIDTH = 420; // approx, used only to keep the popover on screen

const TextEditor = ({ articleData, setArticleData, id }) => {
  const quillRef = useRef(null);
  const shellRef = useRef(null);
  const rangeRef = useRef(null);

  const [bubble, setBubble] = useState(null);

  const hideBubble = useCallback(() => setBubble(null), []);

  const getEditor = () => quillRef.current?.getEditor?.() || null;

  /* ---------- track the selection and place the popover ---------- */

  useEffect(() => {
    const editor = getEditor();
    const shell = shellRef.current;
    if (!editor || !shell) return undefined;

    const place = (range) => {
      if (!range || range.length === 0) {
        rangeRef.current = null;
        return hideBubble();
      }

      rangeRef.current = range;

      const bounds = editor.getBounds(range.index, range.length);
      const shellBox = shell.getBoundingClientRect();
      const containerBox = editor.container.getBoundingClientRect();

      // getBounds is relative to .ql-container, the popover is absolute
      // inside .editor-shell — so shift by the difference.
      const dx = containerBox.left - shellBox.left;
      const dy = containerBox.top - shellBox.top;

      const half = BUBBLE_WIDTH / 2;
      const left = Math.min(
        Math.max(bounds.left + bounds.width / 2 + dx, half + 8),
        shellBox.width - half - 8
      );

      // not enough room above (selection near the top) -> hang it below,
      // otherwise `overflow: clip` on the shell would cut it off
      const rawTop = bounds.top + dy;
      const below = rawTop < 96;

      setBubble({
        top: below ? rawTop + bounds.height + 12 : rawTop - 10,
        left,
        below,
        formats: editor.getFormat(range),
      });
    };

    const onSelectionChange = (range, _old, source) => {
      if (source === "silent") return;
      place(range);
    };

    // keep the popover glued to the text while it is being reformatted
    const onTextChange = () => {
      const range = editor.getSelection();
      if (range && range.length > 0) place(range);
      else hideBubble();
    };

    editor.on("selection-change", onSelectionChange);
    editor.on("text-change", onTextChange);
    window.addEventListener("resize", hideBubble);

    return () => {
      editor.off("selection-change", onSelectionChange);
      editor.off("text-change", onTextChange);
      window.removeEventListener("resize", hideBubble);
    };
  }, [hideBubble]);

  /* ---------- actions ---------- */

  const applyFormat = (name, value) => {
    const editor = getEditor();
    const range = rangeRef.current;
    if (!editor || !range) return;

    editor.format(name, value, "user");
    editor.setSelection(range, "silent");
    setBubble((b) => (b ? { ...b, formats: editor.getFormat(range) } : b));
  };

  const applyLink = () => {
    const editor = getEditor();
    const range = rangeRef.current;
    if (!editor || !range) return;

    const current = editor.getFormat(range).link;

    if (current) {
      editor.formatText(range.index, range.length, "link", false, "user");
    } else {
      // eslint-disable-next-line no-alert
      const url = window.prompt("Link URL", "https://");
      if (url && url.trim() && url.trim() !== "https://") {
        editor.formatText(range.index, range.length, "link", url.trim(), "user");
      }
    }
    editor.setSelection(range, "silent");
    setBubble((b) => (b ? { ...b, formats: editor.getFormat(range) } : b));
  };

  const clearFormat = () => {
    const editor = getEditor();
    const range = rangeRef.current;
    if (!editor || !range) return;

    editor.removeFormat(range.index, range.length, "user");
    editor.setSelection(range, "silent");
    setBubble((b) => (b ? { ...b, formats: {} } : b));
  };

  return (
    <div ref={shellRef} className="editor-shell">
      <EditorToolbar toolbarId={"t1"} />

      <ReactQuill
        ref={quillRef}
        value={articleData.articleBody}
        onChange={(value) =>
          setArticleData((prev) => ({ ...prev, articleBody: value }))
        }
        theme="snow"
        placeholder="Write something here…"
        modules={modules("t1")}
        formats={formats}
      />

      {bubble && (
        <BubbleToolbar
          position={{ top: bubble.top, left: bubble.left }}
          below={bubble.below}
          formats={bubble.formats}
          onFormat={applyFormat}
          onLink={applyLink}
          onClear={clearFormat}
        />
      )}
    </div>
  );
};

export default TextEditor;
