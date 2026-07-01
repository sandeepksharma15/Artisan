import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const cssPath = path.resolve(currentDir, "../index.css");

describe("components wave 2 css", () => {
  const css = readFileSync(cssPath, "utf8");

  it("includes wave 2 component selectors", () => {
    expect(css).toContain(".c-card");
    expect(css).toContain(".c-menu");
    expect(css).toContain(".c-tab-list");
    expect(css).toContain(".c-table");
    expect(css).toContain(".c-badge");
    expect(css).toContain(".c-alert");
  });

  it("includes accessibility-focused hooks for navigation and state", () => {
    expect(css).toContain('[aria-current="page"]');
    expect(css).toContain('[aria-selected="true"]');
    expect(css).toContain(".c-tab-panel[hidden]");
    expect(css).toContain(":focus-visible");
  });

  it("does not reference primitive tokens directly", () => {
    expect(css).not.toContain("--craftcss-primitive-");
  });
});
