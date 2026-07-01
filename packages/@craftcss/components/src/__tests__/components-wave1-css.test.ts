import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const cssPath = path.resolve(currentDir, "../index.css");

describe("components wave 1 css", () => {
  const css = readFileSync(cssPath, "utf8");

  it("includes core form/action component selectors", () => {
    expect(css).toContain(".c-button");
    expect(css).toContain(".c-input");
    expect(css).toContain(".c-textarea");
    expect(css).toContain(".c-select");
    expect(css).toContain(".c-checkbox");
    expect(css).toContain(".c-radio");
    expect(css).toContain(".c-switch");
  });

  it("includes accessibility hooks", () => {
    expect(css).toContain(":focus-visible");
    expect(css).toContain("prefers-reduced-motion: reduce");
    expect(css).toContain(".c-button:disabled");
  });

  it("does not reference primitive tokens directly", () => {
    expect(css).not.toContain("--craftcss-primitive-");
  });
});
