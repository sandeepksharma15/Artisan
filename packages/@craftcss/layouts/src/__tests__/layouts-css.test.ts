import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const cssPath = path.resolve(currentDir, "../index.css");

describe("layouts css primitives", () => {
  const css = readFileSync(cssPath, "utf8");

  it("contains all required layout primitives", () => {
    expect(css).toContain(".l-stack");
    expect(css).toContain(".l-grid");
    expect(css).toContain(".l-cluster");
    expect(css).toContain(".l-sidebar");
    expect(css).toContain(".l-center");
    expect(css).toContain(".l-flow");
    expect(css).toContain(".l-container");
    expect(css).toContain(".l-frame");
  });

  it("is container-query ready and uses logical properties", () => {
    expect(css).toContain("container-type: inline-size");
    expect(css).toContain("inline-size:");
    expect(css).toContain("margin-inline:");
    expect(css).toContain("padding-inline:");
    expect(css).toContain("margin-block-start:");
  });

  it("stays structural without visual paint declarations", () => {
    expect(css).not.toMatch(/\b(color|background|box-shadow|border-color|outline-color)\b/);
  });
});
