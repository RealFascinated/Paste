import { Filter } from "@/filter/filter";
import { ScamFilter } from "@/filter/impl/scam.filter";

export const spamFilters: Filter[] = [new ScamFilter()];
