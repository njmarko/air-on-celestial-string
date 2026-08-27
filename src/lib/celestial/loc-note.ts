export type LocNote = {
  key: string;
  vars?: Record<string, string | number>;
};

export const EMPTY_NOTE: LocNote = { key: "" };

export function note(key: string, vars?: Record<string, string | number>): LocNote {
  return vars ? { key, vars } : { key };
}
