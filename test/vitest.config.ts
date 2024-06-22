import { defineConfig } from "vitest/config";
import { resolve } from "path";
import { ParsedStack } from "vitest";

export default defineConfig({
  resolve: {
    extensions: [".ts", ".tsx"],
  },
  test: {
    include: [resolve(__dirname, "**/*.test.{ts,tsx}")],
    environment: "jsdom",
    coverage: {
      provider: "v8",
      reporter: ["text", "json"],
      exclude: ["demo", "test", "src/ui"],
    },
    onStackTrace: (error: Error, { file }: ParsedStack) => {
      if (error.message.includes("Launched error:")) return;
      if (file.includes("node_modules")) return;
    },
    setupFiles: [resolve(__dirname, ".helpers/setup.ts")],
    // typecheck: {
    //   enabled: true,
    //   include: [resolve(__dirname, "**/*.test-d.ts")],
    // },
  },
});
