import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const cssPath = path.resolve(currentDir, "../index.css");

describe("foundation css baseline", () => {
  const css = readFileSync(cssPath, "utf8");

  it("includes token import and foundation layer", () => {
    expect(css).toContain('@import url("@craftcss/tokens/styles.css");');
    expect(css).toContain("@layer craftcss-foundation");
  });

  it("includes accessibility baseline", () => {
    expect(css).toContain(":focus-visible");
    expect(css).toContain("prefers-reduced-motion: reduce");
    expect(css).toContain("color-scheme: light dark");
  });

  it("stays within foundation scope without layout or component class selectors", () => {
    expect(css).not.toMatch(/\.c-|\.u-|\.l-/);
  });
});
