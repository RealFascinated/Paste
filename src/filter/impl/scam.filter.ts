import { Filter } from "@/filter/filter";

export class ScamFilter extends Filter {
  constructor() {
    super("Scam");
  }

  checkFilter(content: string): boolean {
    return ["bitcoin", "ethereum", "monero", "ripple"].some(word =>
      content.toLowerCase().includes(word)
    );
  }
}
