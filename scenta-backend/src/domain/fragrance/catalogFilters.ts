import { FilterQuery } from "mongoose";

// Fragrance-specific query filters applied on top of the generic catalog filter.
// To reuse this template for a different store type, replace this file with
// your own domain filter logic and update catalogService.ts to import it.

const parseList = (value?: string | string[]) => {
  if (!value) return undefined;
  if (Array.isArray(value)) return value;
  return value.split(",").map((item) => item.trim()).filter(Boolean);
};

export const applyFragranceFilters = (
  filter: FilterQuery<Record<string, unknown>>,
  query: Record<string, unknown>
): void => {
  if (query.gender) {
    filter["fragranceAttrs.gender"] = String(query.gender);
  }

  const notes = parseList(query.notes as string | string[] | undefined);
  if (notes?.length) {
    filter.$or = [
      { "fragranceAttrs.notes.top": { $in: notes } },
      { "fragranceAttrs.notes.middle": { $in: notes } },
      { "fragranceAttrs.notes.base": { $in: notes } }
    ];
  }
};
