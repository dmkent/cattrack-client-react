/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  // Set BASENAME based on environment
  let basename = "";
  if (process.env.TRAVIS_BRANCH === "master") {
    basename = "/c";
  } else if (process.env.TRAVIS_BRANCH === "stage") {
    basename = "/c/stage";
  }

  return {
    plugins: [react()],
    base: basename || "/",
    define: {
      VERSION: JSON.stringify("now"),
      BASENAME: JSON.stringify(basename),
      "process.env.NODE_ENV": JSON.stringify(mode),
    },
    resolve: {
      alias: {
        ctrack_config: path.resolve(
          __dirname,
          `src/config/config.${isDev ? "dev" : "prod"}.js`,
        ),
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          ".js": "jsx",
        },
      },
    },
    build: {
      outDir: "dist",
      sourcemap: true,
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, "index.html"),
        },
        output: {
          manualChunks: {
            vendor: [
              "react",
              "react-dom",
              "react-bootstrap",
              "react-router-dom",
              "react-intl",
            ],
            plotly: ["plotly.js-basic-dist"],
          },
        },
      },
    },
    server: {
      port: 8080,
      open: true,
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["./utils/test_utils.js"],
      css: true,
      include: [
        "**/__tests__/**/*.{js,jsx,ts,tsx}",
        "**/*.{test,spec}.{js,jsx,ts,tsx}",
      ],
      alias: {
        ctrack_config: path.resolve(__dirname, "src/config/config.jest.js"),
      },
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html"],
        exclude: [
          "node_modules/",
          "src/config/",
          "src/root.jsx",
          "**/*.d.ts",
          "utils/",
          "coverage/",
          "dist/",
        ],
      },
      environmentOptions: {
        jsdom: {
          url: "https://cats.example.com",
        },
      },
    },
  };
});
