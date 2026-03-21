"use client";

import { useEffect } from "react";

export function DisplayViewportBackground({
  backgroundColor,
}: {
  backgroundColor: string;
}) {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const previousHtmlBackgroundColor = html.style.backgroundColor;
    const previousHtmlBackgroundImage = html.style.backgroundImage;
    const previousBodyBackgroundColor = body.style.backgroundColor;
    const previousBodyBackgroundImage = body.style.backgroundImage;

    html.style.backgroundColor = backgroundColor;
    html.style.backgroundImage = "none";
    body.style.backgroundColor = backgroundColor;
    body.style.backgroundImage = "none";

    return () => {
      html.style.backgroundColor = previousHtmlBackgroundColor;
      html.style.backgroundImage = previousHtmlBackgroundImage;
      body.style.backgroundColor = previousBodyBackgroundColor;
      body.style.backgroundImage = previousBodyBackgroundImage;
    };
  }, [backgroundColor]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10"
      style={{ backgroundColor }}
    />
  );
}
