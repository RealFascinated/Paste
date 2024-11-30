export type PasteEditDetails = {
  /**
   * The content of the paste.
   */
  content: string;

  /**
   * The number of lines in the paste.
   */
  lines: number;

  /**
   * The number of words in the paste.
   */
  words: number;

  /**
   * The number of characters in the paste.
   */
  characters: number;
}