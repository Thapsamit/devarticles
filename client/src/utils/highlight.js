// Highlights code blocks on the reading page.
//
// Tiptap's editor highlighting is a ProseMirror decoration, so `getHTML()`
// stores plain `<pre><code class="language-x">…</code></pre>`. This re-applies
// highlighting when the article is rendered. Quill's output uses
// `<pre class="ql-syntax">` with no language class and is left untouched.
import hljs from "highlight.js/lib/core";

import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import python from "highlight.js/lib/languages/python";
import java from "highlight.js/lib/languages/java";
import cpp from "highlight.js/lib/languages/cpp";
import csharp from "highlight.js/lib/languages/csharp";
import go from "highlight.js/lib/languages/go";
import rust from "highlight.js/lib/languages/rust";
import php from "highlight.js/lib/languages/php";
import ruby from "highlight.js/lib/languages/ruby";
import sql from "highlight.js/lib/languages/sql";
import json from "highlight.js/lib/languages/json";
import xml from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import scss from "highlight.js/lib/languages/scss";
import bash from "highlight.js/lib/languages/bash";
import yaml from "highlight.js/lib/languages/yaml";
import markdown from "highlight.js/lib/languages/markdown";
import dockerfile from "highlight.js/lib/languages/dockerfile";
import diff from "highlight.js/lib/languages/diff";
import plaintext from "highlight.js/lib/languages/plaintext";

const LANGS = {
  javascript,
  typescript,
  python,
  java,
  cpp,
  csharp,
  go,
  rust,
  php,
  ruby,
  sql,
  json,
  xml,
  css,
  scss,
  bash,
  yaml,
  markdown,
  dockerfile,
  diff,
  plaintext,
};

Object.entries(LANGS).forEach(([name, def]) => hljs.registerLanguage(name, def));
hljs.registerAliases(["js", "jsx", "mjs"], { languageName: "javascript" });
hljs.registerAliases(["ts", "tsx"], { languageName: "typescript" });
hljs.registerAliases(["html", "svg"], { languageName: "xml" });
hljs.registerAliases(["sh", "shell", "zsh"], { languageName: "bash" });
hljs.registerAliases(["py"], { languageName: "python" });
hljs.registerAliases(["md"], { languageName: "markdown" });

export const highlightWithin = (root) => {
  if (!root) return;
  root
    .querySelectorAll('pre code[class*="language-"]:not([data-highlighted])')
    .forEach((block) => {
      try {
        hljs.highlightElement(block);
      } catch (err) {
        // a code block in an unknown language should never break the page
        console.log(err);
      }
      block.setAttribute("data-highlighted", "true");
    });
};

export default hljs;
