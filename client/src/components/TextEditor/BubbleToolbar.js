import React from "react";
import {
  HiOutlineLink,
  HiOutlineCode,
  HiOutlineTrash,
} from "react-icons/hi";

/**
 * The formatting popover that follows the text selection.
 * Buttons use onMouseDown + preventDefault so the editor never loses its
 * selection when one is pressed.
 */
const BubbleToolbar = ({
  position,
  below,
  formats,
  onFormat,
  onLink,
  onClear,
}) => {
  const press = (fn) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    fn();
  };

  const Btn = ({ active, title, onPress, children, className = "" }) => (
    <button
      type="button"
      title={title}
      onMouseDown={press(onPress)}
      className={`bubble-btn ${active ? "bubble-btn-active" : ""} ${className}`}
    >
      {children}
    </button>
  );

  const header = formats.header;

  return (
    <div
      className={`bubble-toolbar ${below ? "bubble-toolbar-below" : ""}`}
      style={{ top: position.top, left: position.left }}
      onMouseDown={(e) => e.preventDefault()}
    >
      <Btn
        title="Bold"
        active={!!formats.bold}
        onPress={() => onFormat("bold", !formats.bold)}
        className="font-extrabold"
      >
        B
      </Btn>
      <Btn
        title="Italic"
        active={!!formats.italic}
        onPress={() => onFormat("italic", !formats.italic)}
        className="italic font-serif"
      >
        I
      </Btn>
      <Btn
        title="Underline"
        active={!!formats.underline}
        onPress={() => onFormat("underline", !formats.underline)}
        className="underline"
      >
        U
      </Btn>
      <Btn
        title="Strikethrough"
        active={!!formats.strike}
        onPress={() => onFormat("strike", !formats.strike)}
        className="line-through"
      >
        S
      </Btn>

      <span className="bubble-sep" />

      <Btn
        title="Inline code"
        active={!!formats.code}
        onPress={() => onFormat("code", !formats.code)}
      >
        <HiOutlineCode className="h-[17px] w-[17px]" />
      </Btn>
      <Btn title="Link" active={!!formats.link} onPress={onLink}>
        <HiOutlineLink className="h-[16px] w-[16px]" />
      </Btn>

      <span className="bubble-sep" />

      <Btn
        title="Heading 2"
        active={header === 2}
        onPress={() => onFormat("header", header === 2 ? false : 2)}
      >
        H2
      </Btn>
      <Btn
        title="Heading 3"
        active={header === 3}
        onPress={() => onFormat("header", header === 3 ? false : 3)}
      >
        H3
      </Btn>
      <Btn
        title="Quote"
        active={!!formats.blockquote}
        onPress={() => onFormat("blockquote", !formats.blockquote)}
      >
        ”
      </Btn>
      <Btn
        title="Bullet list"
        active={formats.list === "bullet"}
        onPress={() =>
          onFormat("list", formats.list === "bullet" ? false : "bullet")
        }
      >
        •
      </Btn>

      <span className="bubble-sep" />

      <Btn title="Clear formatting" onPress={onClear}>
        <HiOutlineTrash className="h-[15px] w-[15px]" />
      </Btn>
    </div>
  );
};

export default BubbleToolbar;
