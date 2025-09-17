"use client";

import { useEffect, useRef } from "react";
import { calculateLineNumberWidth } from "@/common/utils/line-number.util";

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
  
  const lineCount = content.split('\n').length;
  const lineCountWidth = calculateLineNumberWidth(lineCount);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Line Numbers */}
      <div
        ref={lineNumbersRef}
        className="absolute left-0 top-0 bottom-0 pl-1 pr-2 text-right text-[#7d8590] select-none font-mono text-xs z-10 pointer-events-none overflow-hidden"
        style={{
          width: `${lineCountWidth}px`,
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

      {/* Vertical Line Separator */}
      <div
        className="absolute top-0 bottom-0 w-px bg-[#30363d] z-10 pointer-events-none"
        style={{ left: `${lineCountWidth}px` }}
      />

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
        className="code-editor-textarea absolute right-0 top-0 bottom-0 text-white bg-transparent resize-none outline-none font-mono text-xs overflow-auto pl-2 z-20 caret-white"
        style={{
          left: `${lineCountWidth}px`,
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
