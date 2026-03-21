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
    const previousHtmlDisplayBackground = html.style.getPropertyValue(
      "--display-page-background",
    );
    const previousBodyBackgroundColor = body.style.backgroundColor;
    const previousBodyBackgroundImage = body.style.backgroundImage;
    const previousBodyDisplayBackground = body.style.getPropertyValue(
      "--display-page-background",
    );
    const previousHtmlDataset = html.dataset.displayMode;
    const previousBodyDataset = body.dataset.displayMode;

    html.dataset.displayMode = "true";
    body.dataset.displayMode = "true";
    html.style.setProperty("--display-page-background", backgroundColor);
    body.style.setProperty("--display-page-background", backgroundColor);
    html.style.backgroundColor = backgroundColor;
    html.style.backgroundImage = "none";
    body.style.backgroundColor = backgroundColor;
    body.style.backgroundImage = "none";

    return () => {
      if (previousHtmlDataset) {
        html.dataset.displayMode = previousHtmlDataset;
      } else {
        delete html.dataset.displayMode;
      }

      if (previousBodyDataset) {
        body.dataset.displayMode = previousBodyDataset;
      } else {
        delete body.dataset.displayMode;
      }

      if (previousHtmlDisplayBackground) {
        html.style.setProperty(
          "--display-page-background",
          previousHtmlDisplayBackground,
        );
      } else {
        html.style.removeProperty("--display-page-background");
      }

      if (previousBodyDisplayBackground) {
        body.style.setProperty(
          "--display-page-background",
          previousBodyDisplayBackground,
        );
      } else {
        body.style.removeProperty("--display-page-background");
      }

      html.style.backgroundColor = previousHtmlBackgroundColor;
      html.style.backgroundImage = previousHtmlBackgroundImage;
      body.style.backgroundColor = previousBodyBackgroundColor;
      body.style.backgroundImage = previousBodyBackgroundImage;
    };
  }, [backgroundColor]);

  return null;
}
