import sanitizeHtml from "sanitize-html";

// Deve espelhar os formats/toolbar liberados nos editores Quill
// (app/components/textEditor.tsx e app/components/UserTextEditor.tsx).
export function sanitizeEditorHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ["h1", "h2", "p", "br", "strong", "em", "u", "ol", "ul", "li", "a", "span"],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      span: ["style"],
    },
    allowedStyles: {
      span: {
        color: [/^#[0-9a-fA-F]{3,6}$/, /^rgb\(/],
        "background-color": [/^#[0-9a-fA-F]{3,6}$/, /^rgb\(/],
      },
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer", target: "_blank" }),
    },
  });
}
