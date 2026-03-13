export const parseString = (value: unknown): string => {
  if (typeof value !== "string") return "";
  return value.trim();
};

export const parseNumber = (value: unknown): number | null => {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const parseDateString = (value: unknown): string => {
  if (typeof value !== "string") return "";
  return value.trim();
};

export const parseStatus = (
  value: unknown
): "active" | "archived" | undefined => {
  if (value === "active" || value === "archived") return value;
  return undefined;
};
