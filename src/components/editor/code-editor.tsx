"use client";

import { useEffect, useRef } from "react";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // Ensure scroll sync on mount and content changes
  useEffect(() => {
    handleScroll();
  }, [content]);

  // Sync scroll between textarea and line numbers
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      const scrollTop = textareaRef.current.scrollTop;
      lineNumbersRef.current.scrollTop = scrollTop;
    }
  };

  // Handle textarea changes
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  // Handle textarea selection
  const handleSelectionChange = () => {
    // No additional logic needed for plain text editor
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
        className="code-editor-textarea absolute left-10 sm:left-16 right-0 top-0 bottom-0 text-white bg-transparent resize-none outline-none font-mono text-xs overflow-auto px-0 z-20 caret-white"
        style={{
          lineHeight: "1.5",
          fontFamily: "inherit",
          height: "100%",
          width: "100%",
          fontSize: "12px",
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.025em",
        }}
      />
    </div>
  );
}
