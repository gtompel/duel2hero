import eslintPluginNext from "eslint-config-next"

/** @type {import("eslint").Linter.Config[]} */
const config = [
  ...eslintPluginNext,
  {
    ignores: ["node_modules/**", ".next/**", "dist/**"],
  },
  {
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/immutability": "off",
      "react-hooks/incompatible-library": "off",
    },
  },
]

export default config

