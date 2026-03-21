export function resolveDisplayColor(
  value: string | null | undefined,
  fallback: string,
) {
  const normalized = value?.trim();
  return normalized ? normalized : fallback;
}

export function resolveDisplayTheme(input: {
  brandPrimaryColor: string | null | undefined;
  brandSecondaryColor: string | null | undefined;
  brandAccentColor: string | null | undefined;
  brandBackgroundColor: string | null | undefined;
}) {
  return {
    primary: resolveDisplayColor(input.brandPrimaryColor, "#006b54"),
    secondary: resolveDisplayColor(input.brandSecondaryColor, "#FCC917"),
    accent: resolveDisplayColor(input.brandAccentColor, "#FFFFFF"),
    background: resolveDisplayColor(input.brandBackgroundColor, "#111827"),
  };
}
