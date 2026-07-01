import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const cssPath = path.resolve(currentDir, "../index.css");

describe("utilities css", () => {
  const css = readFileSync(cssPath, "utf8");

  it("provides atomic utility taxonomy", () => {
    expect(css).toContain(".u-hidden");
    expect(css).toContain(".u-flex");
    expect(css).toContain(".u-gap-md");
    expect(css).toContain(".u-px-md");
    expect(css).toContain(".u-text-center");
    expect(css).toContain(".u-font-body");
  });

  it("uses low-specificity selectors and no interactive behavior", () => {
    expect(css).toContain(":where(.u-");
    expect(css).not.toMatch(/\.u-[a-z0-9-]+\s+[.#:[]/);
    expect(css).not.toMatch(/:hover|:focus|:active/);
  });

  it("stays under css size budget", () => {
    const maxBytes = 8 * 1024;
    const size = statSync(cssPath).size;
    expect(size).toBeLessThanOrEqual(maxBytes);
  });
});
