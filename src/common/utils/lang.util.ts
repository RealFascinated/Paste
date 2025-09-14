import { GuessLang } from "@ray-d-song/guesslang-js";
import ky from "ky";
import YAML from "yaml";
import Logger from "../logger";

let guessLangInstance: GuessLang | null = null;
let languagesCache: Record<
  string,
  {
    type: string;
    color: string;
    extensions: string[];
    tm_scope: string;
    ace_mode: string;
    language_id: number;
  }
> | null = null;

function getGuessLangInstance(): GuessLang {
  if (!guessLangInstance) {
    guessLangInstance = new GuessLang();
  }
  return guessLangInstance;
}

/**
 * Gets the language of the given content.
 *
 * @param content The content to get the language of.
 * @returns The language of the content.
 */
export async function getLanguage(content: string): Promise<string> {
  // Fall back to ML-based detection
  const guessLang = getGuessLangInstance();
  const response = await guessLang.runModel(content);
  if (!response || response.length === 0) {
    return "txt";
  }

  // Sort by confidence and get the highest
  const sortedResponse = response
    .filter((r) => r.confidence > 0.6) // 60% confidence or higher
    .sort((a, b) => b.confidence - a.confidence); // Sort by confidence

  // Check if we have any results after filtering
  if (sortedResponse.length === 0) {
    return "txt";
  }

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

  Logger.info("Getting languages...");
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
