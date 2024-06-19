import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    extensions: [".ts", ".tsx"],
  },
  test: {
    include: [resolve(__dirname, "**/*.test.{ts,tsx}")],
    // typecheck: {
    //   enabled: true,
    //   include: [resolve(__dirname, "**/*.test-d.ts")],
    // },
  },
});
