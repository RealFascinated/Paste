import { NotepadTextIcon } from "lucide-react";

export function PasteLanguageIcon({
  ext,
  formattedLang,
}: {
  ext: string;
  formattedLang: string;
}) {
  return ext == "txt" ? (
    <NotepadTextIcon className="w-[14px] h-[14px]" />
  ) : (
    <img
      src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${formattedLang.toLowerCase()}/${formattedLang.toLowerCase()}-original.svg`}
      width={14}
      height={14}
      alt={formattedLang}
    />
  );
}
