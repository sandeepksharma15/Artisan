import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const artisanCssPath = path.resolve(currentDir, "../index.css");
const componentsCssPath = path.resolve(currentDir, "../../../components/src/index.css");

describe("artisan theme css", () => {
  const artisanCss = readFileSync(artisanCssPath, "utf8");
  const componentsCss = readFileSync(componentsCssPath, "utf8");

  it("is packaged as a pure theme artifact layered on top of components", () => {
    expect(artisanCss).toContain('@import url("@craftcss/components/styles.css")');
    expect(artisanCss).toContain("@layer craftcss-theme-artisan");
    expect(artisanCss).toContain('data-craftcss-theme="artisan"');
  });

  it("maps semantic and component tokens used by all component waves", () => {
    const requiredThemeVars = [
      "--craftcss-semantic-color-bg-canvas",
      "--craftcss-semantic-color-bg-subtle",
      "--craftcss-semantic-color-fg-default",
      "--craftcss-semantic-color-fg-muted",
      "--craftcss-semantic-color-brand-solid",
      "--craftcss-semantic-color-brand-solid-hover",
      "--craftcss-semantic-color-status-success",
      "--craftcss-semantic-color-status-danger",
      "--craftcss-semantic-color-border-default",
      "--craftcss-component-button-bg-default",
      "--craftcss-component-field-border-color",
      "--craftcss-component-card-border-color",
    ];

    for (const variableName of requiredThemeVars) {
      expect(componentsCss).toContain(variableName);
      expect(artisanCss).toContain(variableName);
    }
  });

  it("keeps primitive-token boundary intact", () => {
    expect(artisanCss).not.toContain("--craftcss-primitive-");
  });
});
