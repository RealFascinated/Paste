"use client";

import { getLanguage } from "@/common/utils/lang.util";
import { Highlight, themes } from "prism-react-renderer";
import { useEffect, useRef, useState } from "react";

type CodeEditorProps = {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export function CodeEditor({
  content,
  onChange,
  placeholder = "",
  disabled = false,
  className = "",
}: CodeEditorProps) {
  const [detectedLanguage, setDetectedLanguage] = useState<string>("text");
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  // Detect language when content changes
  useEffect(() => {
    if (content.trim().length > 10) {
      setIsDetecting(true);
      getLanguage(content)
        .then(lang => {
          setDetectedLanguage(lang);
        })
        .catch(() => {
          setDetectedLanguage("text");
        })
        .finally(() => {
          setIsDetecting(false);
        });
    } else {
      setDetectedLanguage("text");
    }
  }, [content]);

  // Ensure scroll sync on mount and content changes
  useEffect(() => {
    handleScroll();
  }, [content]);

  // Sync scroll between textarea and line numbers/highlight
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current && highlightRef.current) {
      const scrollTop = textareaRef.current.scrollTop;
      const scrollLeft = textareaRef.current.scrollLeft;
      lineNumbersRef.current.scrollTop = scrollTop;
      highlightRef.current.scrollTop = scrollTop;
      highlightRef.current.scrollLeft = scrollLeft;
    }
  };

  // Handle textarea changes
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  // Handle textarea selection to sync with highlight
  const handleSelectionChange = () => {
    if (textareaRef.current && highlightRef.current) {
      const textarea = textareaRef.current;

      // Sync scroll position
      highlightRef.current.scrollTop = textarea.scrollTop;
      highlightRef.current.scrollLeft = textarea.scrollLeft;
    }
  };

  const lines = content.split("\n");
  const lineCount = lines.length;

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Line Numbers */}
      <div
        ref={lineNumbersRef}
        className="absolute left-0 top-0 bottom-0 w-10 sm:w-16 pr-1 sm:pr-4 text-right text-[#7d8590] select-none font-mono text-xs z-10 pointer-events-none overflow-hidden"
        style={{
          lineHeight: "1.5",
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.025em",
        }}
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i} style={{ minHeight: "18px" }}>
            {i + 1}
          </div>
        ))}
      </div>

      {/* Syntax Highlighting Background */}
      <div
        ref={highlightRef}
        className="absolute left-10 sm:left-16 right-0 top-0 bottom-0 overflow-hidden pointer-events-none z-0"
        style={{ lineHeight: "1.5" }}
      >
        <Highlight
          theme={themes.oneDark}
          code={content}
          language={detectedLanguage}
        >
          {({ style, tokens, getLineProps, getTokenProps }) => (
            <pre
              style={{
                ...style,
                background: "none",
                padding: 0,
                margin: 0,
                fontSize: "12px",
                lineHeight: "1.5",
              }}
              className="font-mono w-full"
            >
              {tokens.map((line, i) => (
                <div
                  key={i}
                  {...getLineProps({ line })}
                  style={{ minHeight: "18px" }}
                >
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleChange}
        onScroll={handleScroll}
        onSelect={handleSelectionChange}
        onKeyUp={handleSelectionChange}
        onMouseUp={handleSelectionChange}
        placeholder={placeholder}
        disabled={disabled}
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        autoComplete="off"
        className="absolute left-10 sm:left-16 right-0 top-0 bottom-0 text-transparent bg-transparent resize-none outline-none font-mono text-xs overflow-auto px-0 z-20 caret-white"
        style={{
          lineHeight: "1.5",
          fontFamily: "inherit",
          height: "100%",
          width: "100%",
        }}
      />

      {/* Language Detection Indicator */}
      {isDetecting && (
        <div className="absolute top-2 right-2 z-30">
          <div className="bg-muted/80 text-muted-foreground text-xs px-2 py-1 rounded-md">
            Detecting language...
          </div>
        </div>
      )}
    </div>
  );
}
