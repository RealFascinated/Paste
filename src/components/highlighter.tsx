"use client";

import { calculateLineNumberWidth } from "@/common/utils/line-number.util";
import { Highlight, themes } from "prism-react-renderer";

type HighlighterProps = {
  content: string;
  language: string;
};

export default function Highlighter({ content, language }: HighlighterProps) {
  const lineCountWidth = calculateLineNumberWidth(content.split("\n").length);

  return (
    <div className="relative w-full" style={{ padding: 0, margin: 0 }}>
      {/* Vertical Line Separator */}
      <div
        className="absolute top-0 bottom-0 w-px bg-[#30363d] z-10 pointer-events-none"
        style={{ left: `${lineCountWidth}px` }}
      />

      <Highlight theme={themes.oneDark} code={content} language={language}>
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <pre
            style={{
              ...style,
              background: "none",
              padding: 0,
              margin: 0,
              overflow: "visible",
              fontSize: "12px",
              lineHeight: "1.5",
              minHeight: "auto",
              height: "auto",
            }}
            className="font-mono w-full"
          >
            {tokens.map((line, i) => {
              return (
                <div
                  key={i}
                  {...getLineProps({ line })}
                  className="group relative flex w-full hover:bg-[#161b22] transition-colors"
                  style={{
                    minHeight: "18px",
                    margin: 0,
                    padding: 0,
                    ...(i === tokens.length - 1 && {
                      marginBottom: 0,
                      paddingBottom: 0,
                    }),
                  }}
                >
                  {/* Line Number */}
                  <span
                    className="flex-shrink-0 pl-1 pr-2 text-right text-[#7d8590] select-none font-mono text-xs"
                    style={{
                      width: `${lineCountWidth}px`,
                      lineHeight: "1.5",
                      fontVariantNumeric: "tabular-nums",
                      letterSpacing: "-0.025em",
                    }}
                  >
                    {i + 1}
                  </span>

                  {/* Line Content */}
                  <span
                    className="flex-1 min-w-0 w-full pl-2"
                    style={{ lineHeight: "1.5" }}
                  >
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              );
            })}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
