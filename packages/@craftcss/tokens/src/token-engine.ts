import type { TokenModel, TokenNode, TokenValidationResult } from "./types";

const REFERENCE_PATTERN = /\{([a-z]+(?:\.[a-z0-9-]+)+)\}/g;

export function flattenTokens(node: TokenNode, prefix: string[] = []): Map<string, string> {
  const out = new Map<string, string>();

  const visit = (value: TokenNode | string | number, parts: string[]) => {
    if (typeof value === "string" || typeof value === "number") {
      out.set(parts.join("."), String(value));
      return;
    }

    for (const [key, child] of Object.entries(value)) {
      visit(child as TokenNode | string | number, [...parts, key]);
    }
  };

  visit(node, prefix);
  return out;
}

export function extractReferences(value: string): string[] {
  const refs: string[] = [];
  for (const match of value.matchAll(REFERENCE_PATTERN)) {
    if (match[1]) {
      refs.push(match[1]);
    }
  }
  return refs;
}

function toCssVarName(tokenPath: string): string {
  const normalized = tokenPath
    .split(".")
    .map((segment) => segment.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase())
    .join("-");
  return `--craftcss-${normalized}`;
}

function toCssVarRef(tokenPath: string): string {
  return `var(${toCssVarName(tokenPath)})`;
}

function valueToCss(value: string): string {
  return value.replace(REFERENCE_PATTERN, (_full, refPath: string) => toCssVarRef(refPath));
}

function detectCycle(nodes: Map<string, string>): string[] {
  const errors: string[] = [];
  const visiting = new Set<string>();
  const visited = new Set<string>();

  const dfs = (node: string, stack: string[]) => {
    if (visiting.has(node)) {
      const cycleStart = stack.indexOf(node);
      const cyclePath = [...stack.slice(cycleStart), node].join(" -> ");
      errors.push(`Circular token reference detected: ${cyclePath}`);
      return;
    }

    if (visited.has(node)) {
      return;
    }

    visiting.add(node);
    const value = nodes.get(node);
    if (value) {
      for (const ref of extractReferences(value)) {
        if (nodes.has(ref)) {
          dfs(ref, [...stack, node]);
        }
      }
    }
    visiting.delete(node);
    visited.add(node);
  };

  for (const key of nodes.keys()) {
    dfs(key, []);
  }

  return errors;
}

export function validateTokenModel(model: TokenModel): TokenValidationResult {
  const primitive = flattenTokens(model.primitive, ["primitive"]);
  const semantic = flattenTokens(model.semantic, ["semantic"]);
  const component = flattenTokens(model.component, ["component"]);

  const all = new Map<string, string>([...primitive, ...semantic, ...component]);
  const errors: string[] = [];

  for (const [tokenPath, value] of all.entries()) {
    const refs = extractReferences(value);
    for (const ref of refs) {
      if (!all.has(ref)) {
        errors.push(`Missing token reference: ${tokenPath} -> ${ref}`);
      }
    }
  }

  for (const [tokenPath, value] of component.entries()) {
    for (const ref of extractReferences(value)) {
      if (ref.startsWith("primitive.")) {
        errors.push(`Component token cannot reference primitive directly: ${tokenPath} -> ${ref}`);
      }
    }
  }

  errors.push(...detectCycle(all));

  return {
    ok: errors.length === 0,
    errors,
  };
}

export function generateTokenCss(model: TokenModel): string {
  const validation = validateTokenModel(model);
  if (!validation.ok) {
    throw new Error(validation.errors.join("\n"));
  }

  const primitive = flattenTokens(model.primitive, ["primitive"]);
  const semantic = flattenTokens(model.semantic, ["semantic"]);
  const component = flattenTokens(model.component, ["component"]);

  const rootDeclarations: string[] = [];
  for (const [tokenPath, value] of [...primitive, ...semantic, ...component]) {
    rootDeclarations.push(`  ${toCssVarName(tokenPath)}: ${valueToCss(value)};`);
  }

  const themeBlocks: string[] = [];
  for (const [themeName, overrides] of Object.entries(model.theme)) {
    const lines: string[] = [];
    if (overrides.semantic) {
      const flatSemantic = flattenTokens(overrides.semantic, ["semantic"]);
      for (const [tokenPath, value] of flatSemantic) {
        lines.push(`  ${toCssVarName(tokenPath)}: ${valueToCss(value)};`);
      }
    }

    if (overrides.component) {
      const flatComponent = flattenTokens(overrides.component, ["component"]);
      for (const [tokenPath, value] of flatComponent) {
        lines.push(`  ${toCssVarName(tokenPath)}: ${valueToCss(value)};`);
      }
    }

    if (lines.length > 0) {
      themeBlocks.push(
        `[data-craftcss-theme="${themeName}"], :root[data-craftcss-theme="${themeName}"] {\n${lines.join("\n")}\n}`
      );
    }
  }

  return [
    "@layer craftcss-tokens {",
    "  :root {",
    ...rootDeclarations,
    "  }",
    "",
    ...themeBlocks.map((block) => `  ${block.replace(/\n/g, "\n  ")}`),
    "}",
    "",
  ].join("\n");
}
