import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const cssPath = path.resolve(currentDir, "../index.css");

describe("components wave 3 css", () => {
  const css = readFileSync(cssPath, "utf8");

  it("includes wave 3 component selectors", () => {
    expect(css).toContain(".c-dialog");
    expect(css).toContain(".c-popover");
    expect(css).toContain(".c-toast");
    expect(css).toContain(".c-accordion");
  });

  it("includes accessibility and state hooks", () => {
    expect(css).toContain(".c-dialog::backdrop");
    expect(css).toContain('[aria-expanded="true"]');
    expect(css).toContain(".c-accordion-panel[hidden]");
    expect(css).toContain(":focus-visible");
    expect(css).toContain("prefers-reduced-motion: reduce");
  });

  it("does not reference primitive tokens directly", () => {
    expect(css).not.toContain("--craftcss-primitive-");
  });
});
