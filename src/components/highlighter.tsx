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
            paddingLeft: "0.5rem",
            paddingTop: "0.5rem",
            overflowX: "auto",
          }}
        >
          {tokens.map((line, i) => (
            <div
              key={i}
              {...getLineProps({ line })}
              style={{
                display: "grid",
                gridTemplateColumns: "2rem auto", // 3rem for line numbers
                alignItems: "center",
                padding: "0 0.5rem",
              }}
            >
              {/* Line Number */}
              <span
                style={{
                  color: "rgba(255, 255, 255, 0.5)",
                  textAlign: "right",
                  paddingRight: "1rem",
                  userSelect: "none",
                }}
              >
                {i + 1}
              </span>

              {/* Line Content */}
              <span>
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
