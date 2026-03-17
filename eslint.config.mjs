import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    plugins: {
      boundaries,
    },
    settings: {
      "boundaries/include": ["src/**"],
      "boundaries/elements": [
        { type: "app", pattern: "app", mode: "folder" },
        { type: "pages", pattern: "views/*", mode: "folder", capture: ["sliceName"] },
        { type: "widgets", pattern: "widgets/*", mode: "folder", capture: ["sliceName"] },
        { type: "features", pattern: "features/*", mode: "folder", capture: ["sliceName"] },
        { type: "entities", pattern: "entities/*", mode: "folder", capture: ["sliceName"] },
        { type: "shared", pattern: "shared", mode: "folder" },
      ],
    },
    rules: {
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          rules: [
            { from: "app", allow: ["app", "pages", "widgets", "features", "entities", "shared"] },
            { from: "pages", allow: ["widgets", "features", "entities", "shared"] },
            { from: "widgets", allow: ["features", "entities", "shared"] },
            { from: "features", allow: ["entities", "shared"] },
            { from: "entities", allow: ["shared"] },
            { from: "shared", allow: ["shared"] },
          ],
        },
      ],
      "boundaries/no-unknown-files": ["warn"],
      "boundaries/no-unknown": ["warn"],
    },
  },
]);

export default eslintConfig;
