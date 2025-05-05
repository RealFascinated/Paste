import { GuessLang } from "@ray-d-song/guesslang-js";
import ky from "ky";
import YAML from "yaml";

let guessLangInstance: GuessLang | null = null;
let languagesCache: Record<string, {
  type: string;
  color: string;
  extensions: string[];
  tm_scope: string;
  ace_mode: string;
  language_id: number;
}> | null = null;

function getGuessLangInstance(): GuessLang {
  if (!guessLangInstance) {
    guessLangInstance = new GuessLang();
  }
  return guessLangInstance;
}

// Map of common file extensions to language IDs
const extensionToLanguage: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  py: "python",
  java: "java",
  cpp: "cpp",
  cs: "csharp",
  php: "php",
  rb: "ruby",
  go: "go",
  rs: "rust",
  swift: "swift",
  kt: "kotlin",
  sql: "sql",
  sh: "bash",
  yml: "yaml",
  yaml: "yaml",
  json: "json",
  md: "markdown",
  html: "html",
  css: "css",
};

/**
 * Gets the language of the given content.
 *
 * @param content The content to get the language of.
 * @param filename Optional filename to help with detection
 * @returns The language of the content.
 */
export async function getLanguage(content: string, filename?: string): Promise<string> {
  // Try to detect from filename extension
  if (filename) {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (ext && extensionToLanguage[ext]) {
      return extensionToLanguage[ext];
    }
  }

  // Fall back to ML-based detection
  const guessLang = getGuessLangInstance();
  const response = await guessLang.runModel(content);
  if (!response || response.length === 0) {
    return "txt";
  }

  // Sort by confidence and get the highest
  const sortedResponse = response.sort((a, b) => b.confidence - a.confidence);
  return sortedResponse[0].languageId;
}

/**
 * Gets the language name for a given extension.
 *
 * @param extension The extension of the language (e.g., ".js", ".py").
 * @returns The language name, or "Unknown" if not found.
 */
export async function getLanguageName(extension: string) {
  if (extension == "txt") {
    return "Text";
  }

  const languages = await getLanguages();
  if (extension && languages) {
    extension = !extension.startsWith(".") ? `.${extension}` : extension;
    for (const [languageName, data] of Object.entries(languages)) {
      if (data.extensions && data.extensions.includes(extension)) {
        return languageName;
      }
    }
  }
  return "Unknown";
}

export async function getLanguages(): Promise<Record<
  string,
  {
    type: string;
    color: string;
    extensions: string[];
    tm_scope: string;
    ace_mode: string;
    language_id: number;
  }
> | null> {
  if (languagesCache) {
    return languagesCache;
  }

  console.log("Getting languages...");
  const response = await ky
    .get(
      "https://raw.githubusercontent.com/github-linguist/linguist/refs/heads/main/lib/linguist/languages.yml"
    )
    .text();
  if (response == null) {
    return null;
  }
  languagesCache = YAML.parse(response.split("---")[1]);
  return languagesCache;
}
