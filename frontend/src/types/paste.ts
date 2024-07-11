export type PasteResponse = {
  /**
   * The key of the paste.
   */
  key: string;

  /**
   * The URL to the paste.
   */
  url: string;
};

export type Paste = {
  /**
   * The key of the paste.
   */
  id: string;

  /**
   * The content of the paste.
   */
  content: string;

  /**
   * The amount of lines in the paste.
   */
  lineCount: number;

  /**
   * The size of the paste in bytes.
   */
  sizeBytes: number;
};
