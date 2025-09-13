"use client";

import { Highlight, themes } from "prism-react-renderer";

type HighlighterProps = {
  content: string;
  language: string;
};

export default function Highlighter({ content, language }: HighlighterProps) {
  return (
    <Highlight theme={themes.oneDark} code={content} language={language}>
      {({ style, tokens, getLineProps, getTokenProps }) => (
        <pre
          style={{
            ...style,
            background: "none",
            paddingLeft: "0.25rem",
            paddingTop: "0.5rem",
            paddingRight: "0.25rem",
            overflowX: "auto",
          }}
          className="sm:px-2"
        >
          {tokens.map((line, i) => (
            <div
              key={i}
              {...getLineProps({ line })}
              style={{
                display: "grid",
                gridTemplateColumns: "1.5rem auto",
                alignItems: "center",
                padding: "0 0.25rem",
                minHeight: "1.25rem",
              }}
              className="sm:px-2"
            >
              {/* Line Number */}
              <span
                style={{
                  color: "rgba(255, 255, 255, 0.5)",
                  textAlign: "right",
                  paddingRight: "0.5rem",
                  userSelect: "none",
                  fontSize: "0.75rem",
                }}
                className="sm:text-sm sm:pr-4"
              >
                {i + 1}
              </span>

              {/* Line Content */}
              <span className="break-words overflow-wrap-anywhere">
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </span>
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}
