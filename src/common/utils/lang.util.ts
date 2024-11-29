import { GuessLang } from "@ray-d-song/guesslang-js";
import ky from "ky";
import YAML from "yaml";

const guessLang = new GuessLang();
const languages = await getLanguages();

/**
 * Gets the language of the given content.
 *
 * @param content The content to get the language of.
 * @returns The language of the content.
 */
export async function getLanguage(content: string) {
  const response = await guessLang.runModel(content);
  if (!response || response.length === 0 || response[0].confidence < 0.5) {
    return "text";
  }

  return response[0].languageId;
}

/**
 * Gets the language name for a given extension.
 *
 * @param extension The extension of the language.
 * @returns The language name.
 */
/**
 * Gets the language name for a given extension.
 *
 * @param extension The extension of the language (e.g., ".js", ".py").
 * @returns The language name, or "Unknown" if not found.
 */
export function getLanguageName(extension: string) {
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
  console.log("Getting languages...");
  const response = await ky
    .get(
      "https://raw.githubusercontent.com/github-linguist/linguist/refs/heads/main/lib/linguist/languages.yml",
    )
    .text();
  if (response == null) {
    return null;
  }
  return YAML.parse(response.split("---")[1]);
}
