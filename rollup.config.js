import typescript from "rollup-plugin-typescript2";
import ignoreImport from "rollup-plugin-ignore-import";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/bundle.js",
    format: "umd",
    name: "launched",
    sourcemap: true,
    exports: "named",
    globals: {
      react: "React",
      "react-dom/client": "ReactDOM",
      "react/jsx-runtime": "jsxRuntime",
    },
  },
  plugins: [
    typescript({
      tsconfig: "./tsconfig.json",
      tsconfigOverride: {
        compilerOptions: {
          declaration: false,
        },
      },
      useTsconfigDeclarationDir: true,
    }),
    ignoreImport({
      extensions: [".css"],
    }),
  ],
};
