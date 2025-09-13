"use client";

import { toastUtil } from "@/common/utils/toast.util";
import { Check, Copy } from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";
import { useState } from "react";

type HighlighterProps = {
  content: string;
  language: string;
};

export default function Highlighter({ content, language }: HighlighterProps) {
  const [copiedLines, setCopiedLines] = useState<Set<number>>(new Set());

  const copyLine = async (lineNumber: number, lineContent: string) => {
    try {
      await navigator.clipboard.writeText(lineContent);
      setCopiedLines(prev => new Set([...prev, lineNumber]));
      toastUtil.pasteCopied(lineContent);

      setTimeout(() => {
        setCopiedLines(prev => {
          const newSet = new Set(prev);
          newSet.delete(lineNumber);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      toastUtil.error("Failed to copy line");
    }
  };

  return (
    <div className="relative w-full">
      <Highlight theme={themes.oneDark} code={content} language={language}>
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <pre
            style={{
              ...style,
              background: "none",
              padding: 0,
              margin: 0,
              overflowX: "auto",
              fontSize: "12px",
              lineHeight: "1.5",
            }}
            className="font-mono w-full"
          >
            {tokens.map((line, i) => {
              const lineContent = line.map(token => token.content).join("");
              const isCopied = copiedLines.has(i);

              return (
                <div
                  key={i}
                  {...getLineProps({ line })}
                  className="group relative flex w-full hover:bg-[#161b22] transition-colors"
                  style={{ minHeight: "24px" }}
                >
                  {/* Line Number */}
                  <span
                    className="flex-shrink-0 w-16 pr-4 text-right text-[#7d8590] select-none font-mono text-xs"
                    style={{
                      lineHeight: "24px",
                      fontVariantNumeric: "tabular-nums",
                      letterSpacing: "-0.025em",
                    }}
                  >
                    {i + 1}
                  </span>

                  {/* Line Content */}
                  <span
                    className="flex-1 min-w-0 w-full"
                    style={{ lineHeight: "24px" }}
                  >
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </span>

                  {/* Copy Button */}
                  <button
                    onClick={() => copyLine(i, lineContent)}
                    className="opacity-0 group-hover:opacity-100 absolute right-2 top-0 h-6 w-6 flex items-center justify-center rounded hover:bg-[#30363d] transition-all duration-200"
                    title="Copy line"
                  >
                    {isCopied ? (
                      <Check className="w-3 h-3 text-[#3fb950]" />
                    ) : (
                      <Copy className="w-3 h-3 text-[#7d8590] hover:text-white" />
                    )}
                  </button>
                </div>
              );
            })}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
