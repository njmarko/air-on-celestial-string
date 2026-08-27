export type I18nVars = Record<string, string | number>;

export function interpolate(template: string, vars?: I18nVars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    vars[name] !== undefined ? String(vars[name]) : match,
  );
}
