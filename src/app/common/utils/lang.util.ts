import { GuessLang } from "@ray-d-song/guesslang-js";

const guessLang = new GuessLang();

/**
 * Gets the language of the given content.
 *
 * @param content The content to get the language of.
 * @returns The language of the content.
 */
export async function getLanguage(content: string) {
  const response = await guessLang.runModel(content);
  if (!response || response.length === 0 || response[0].confidence < 0.75) {
    return "text";
  }

  return response[0].languageId;
}
