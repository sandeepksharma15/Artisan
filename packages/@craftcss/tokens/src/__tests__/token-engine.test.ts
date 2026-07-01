import { describe, expect, it } from "vitest";

import { tokenModel } from "../token-model";
import { generateTokenCss, validateTokenModel } from "../token-engine";

function cloneModel<T>(model: T): T {
  return JSON.parse(JSON.stringify(model)) as T;
}

describe("token validation", () => {
  it("accepts the default token model", () => {
    const result = validateTokenModel(tokenModel);
    expect(result.ok).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("detects missing semantic references", () => {
    const model = cloneModel(tokenModel);
    model.semantic.color.bg.canvas = "{primitive.color.neutral.999}";

    const result = validateTokenModel(model);
    expect(result.ok).toBe(false);
    expect(result.errors.some((error) => error.includes("Missing token reference"))).toBe(true);
  });

  it("detects circular references", () => {
    const model = cloneModel(tokenModel);
    model.semantic.typography.size.body = "{semantic.typography.size.title}";
    model.semantic.typography.size.title = "{semantic.typography.size.body}";

    const result = validateTokenModel(model);
    expect(result.ok).toBe(false);
    expect(result.errors.some((error) => error.includes("Circular token reference detected"))).toBe(
      true
    );
  });

  it("rejects component references to primitive tokens", () => {
    const model = cloneModel(tokenModel);
    model.component.button.radius = "{primitive.radius.md}";

    const result = validateTokenModel(model);
    expect(result.ok).toBe(false);
    expect(
      result.errors.some((error) =>
        error.includes("Component token cannot reference primitive directly")
      )
    ).toBe(true);
  });
});

describe("token css generation", () => {
  it("generates CSS variables for root and theme overrides", () => {
    const css = generateTokenCss(tokenModel);
    expect(css).toContain("--craftcss-primitive-color-neutral-0");
    expect(css).toContain("--craftcss-semantic-typography-size-body: clamp(");
    expect(css).toContain(':root[data-craftcss-theme="artisan"]');
  });
});
