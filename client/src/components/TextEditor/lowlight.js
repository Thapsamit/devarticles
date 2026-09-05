// Curated syntax-highlighting set for the Tiptap code blocks.
// Registering languages explicitly (instead of importing all ~190 from
// lowlight) keeps the bundle small and gives us a known list for the picker.
import { lowlight } from "lowlight/lib/core";

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

const REGISTRY = [
  ["javascript", "JavaScript", javascript],
  ["typescript", "TypeScript", typescript],
  ["xml", "HTML / XML", xml],
  ["css", "CSS", css],
  ["scss", "SCSS", scss],
  ["json", "JSON", json],
  ["python", "Python", python],
  ["java", "Java", java],
  ["cpp", "C / C++", cpp],
  ["csharp", "C#", csharp],
  ["go", "Go", go],
  ["rust", "Rust", rust],
  ["php", "PHP", php],
  ["ruby", "Ruby", ruby],
  ["sql", "SQL", sql],
  ["bash", "Bash / Shell", bash],
  ["yaml", "YAML", yaml],
  ["markdown", "Markdown", markdown],
  ["dockerfile", "Dockerfile", dockerfile],
  ["diff", "Diff", diff],
  ["plaintext", "Plain text", plaintext],
];

REGISTRY.forEach(([name, , definition]) => {
  lowlight.registerLanguage(name, definition);
});

lowlight.registerAlias("javascript", ["js", "jsx", "mjs"]);
lowlight.registerAlias("typescript", ["ts", "tsx"]);
lowlight.registerAlias("xml", ["html", "svg"]);
lowlight.registerAlias("bash", ["sh", "shell", "zsh"]);
lowlight.registerAlias("python", ["py"]);
lowlight.registerAlias("markdown", ["md"]);

export const LANGUAGES = REGISTRY.map(([value, label]) => ({ value, label }));
export default lowlight;
