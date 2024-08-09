import typescript from "rollup-plugin-typescript2";
import ignoreImport from "rollup-plugin-ignore-import";
import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import replace from "@rollup/plugin-replace";

export default {
  input: "src/index.ts",
  external: ["react", "react-dom/client", "react/jsx-runtime"],
  output: {
    file: "dist/bundle.js",
    format: "umd",
    name: "launched",
    sourcemap: true,
    exports: "named",
    globals: {
      react: "React",
      "react-dom": "ReactDOM",
      "react-dom/client": "ReactDOM",
      "react/jsx-runtime": "ReactJSXRuntime",
    },
    outro: `
      exports["Launched"] = exports["default"];
    `,
    esModule: false,
  },
  plugins: [
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
      presets: [["@babel/preset-react", { runtime: "automatic" }]],
    }),
    typescript({
      tsconfig: "./tsconfig.json",
      tsconfigOverride: {
        compilerOptions: {
          declaration: false,
          jsx: "react-jsx",
        },
      },
      useTsconfigDeclarationDir: true,
    }),
    ignoreImport({
      extensions: [".css"],
    }),
    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
      preventAssignment: true,
    }),
    terser(),
  ],
};
