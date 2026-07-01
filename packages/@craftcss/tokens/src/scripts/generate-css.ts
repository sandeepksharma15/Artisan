import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { generateTokenCss } from "../token-engine";
import { tokenModel } from "../token-model";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const outputPath = path.resolve(currentDir, "../index.css");

const css = generateTokenCss(tokenModel);
writeFileSync(outputPath, css, "utf8");
