import { NotepadTextIcon } from "lucide-react";

export function PasteLanguageIcon({
  ext,
  language,
}: {
  ext: string;
  language: string;
}) {
  return ext == "txt" || language.toLowerCase() == "unknown" ? (
    <NotepadTextIcon className="w-[14px] h-[14px]" />
  ) : (
    <img
      src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${language.toLowerCase()}/${language.toLowerCase()}-original.svg`}
      width={14}
      height={14}
      alt={language}
    />
  );
}
