import {ScamFilter} from "@/filter/impl/scam.filter";
import {Filter} from "@/filter/filter";

export const spamFilters: Filter[] = [
  new ScamFilter(),
];