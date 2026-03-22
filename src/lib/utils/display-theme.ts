function normalizeHexColor(value: string | null | undefined, fallback: string) {
  const normalized = value?.trim();

  if (!normalized) {
    return fallback;
  }

  if (/^#?[0-9a-fA-F]{6}$/.test(normalized) || /^#?[0-9a-fA-F]{3}$/.test(normalized)) {
    return normalized.startsWith("#") ? normalized : `#${normalized}`;
  }

  return normalized;
}

export function resolveDisplayTheme(input: {
  brandPrimaryColor: string | null | undefined;
  brandSecondaryColor: string | null | undefined;
  brandAccentColor: string | null | undefined;
  brandBackgroundColor: string | null | undefined;
}) {
  return {
    primary: normalizeHexColor(input.brandPrimaryColor, "#006b54"),
    secondary: normalizeHexColor(input.brandSecondaryColor, "#FCC917"),
    accent: normalizeHexColor(input.brandAccentColor, "#FFFFFF"),
    background: normalizeHexColor(input.brandBackgroundColor, "#111827"),
  };
}
