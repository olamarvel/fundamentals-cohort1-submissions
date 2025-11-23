
import { createDefaultPreset } from "ts-jest";
const tsJest = createDefaultPreset();

export default {
  ...tsJest,
  testEnvironment: "node",

  extensionsToTreatAsEsm: [".ts", ".mts"],

  transform: {
    "^.+\\.m?tsx?$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "tsconfig.json"
      }
    ]
  },

  moduleFileExtensions: ["ts", "mts", "js", "mjs", "json"],
};
