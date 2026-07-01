// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import axe from "axe-core";

async function bootstrapApp(): Promise<void> {
  vi.resetModules();
  document.body.innerHTML = '<div id="app"></div>';

  const proto = HTMLDialogElement.prototype as HTMLDialogElement & {
    showModal?: () => void;
    close?: () => void;
  };

  proto.showModal = function showModal(): void {
    this.setAttribute("open", "");
  };

  proto.close = function close(): void {
    this.removeAttribute("open");
  };

  await import("../main");
}

describe("docs-demo quality gates", () => {
  beforeEach(async () => {
    await bootstrapApp();
  });

  it("has no critical a11y violations in the rendered demo", async () => {
    const results = await axe.run(document.body, {
      rules: {
        // JSDOM cannot compute actual color rendering, so skip this browser-only rule.
        "color-contrast": { enabled: false },
      },
    });

    const criticalViolations = results.violations.filter(
      (violation) => violation.impact === "critical"
    );
    const criticalRuleIds = criticalViolations.map((violation) => violation.id);

    expect(criticalRuleIds).toEqual([]);
  });

  it("toggles popover visibility and aria state", () => {
    const toggle = document.querySelector<HTMLButtonElement>("#toggle-popover");
    const popover = document.querySelector<HTMLDivElement>("#popover");

    expect(toggle).not.toBeNull();
    expect(popover).not.toBeNull();

    expect(toggle?.getAttribute("aria-expanded")).toBe("false");
    expect(popover?.hasAttribute("hidden")).toBe(true);

    toggle?.click();

    expect(toggle?.getAttribute("aria-expanded")).toBe("true");
    expect(popover?.hasAttribute("hidden")).toBe(false);

    toggle?.click();

    expect(toggle?.getAttribute("aria-expanded")).toBe("false");
    expect(popover?.hasAttribute("hidden")).toBe(true);
  });

  it("opens and closes dialog through action buttons", () => {
    const openButton = document.querySelector<HTMLButtonElement>("#open-dialog");
    const closeButton = document.querySelector<HTMLButtonElement>("#close-dialog");
    const dialog = document.querySelector<HTMLDialogElement>("#demo-dialog");

    expect(dialog?.hasAttribute("open")).toBe(false);

    openButton?.click();
    expect(dialog?.hasAttribute("open")).toBe(true);

    closeButton?.click();
    expect(dialog?.hasAttribute("open")).toBe(false);
  });

  it("supports accordion keyboard interaction with Enter", () => {
    const trigger = document.querySelectorAll<HTMLButtonElement>(".c-accordion-trigger")[1];
    const panel = trigger?.nextElementSibling as HTMLDivElement | null;

    expect(trigger).not.toBeUndefined();
    expect(trigger?.getAttribute("aria-expanded")).toBe("false");
    expect(panel?.hasAttribute("hidden")).toBe(true);

    trigger?.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

    expect(trigger?.getAttribute("aria-expanded")).toBe("true");
    expect(panel?.hasAttribute("hidden")).toBe(false);
  });
});
