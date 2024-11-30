import { ScamFilter } from "./impl/scam.filter";

export abstract class Filter {
  /**
   * The name of the filter.
   */
  private readonly name: string;

  protected constructor(name: string) {
    this.name = name;
  }

  /**
   * Check if the filter matches the content.
   *
   * @param content The content to check.
   * @returns True if the filter matches, false otherwise.
   */
  abstract checkFilter(content: string): boolean;

  /**
   * Get the name of the filter.
   *
   * @returns The name of the filter.
   */
  getName(): string {
    return this.name;
  }
}
