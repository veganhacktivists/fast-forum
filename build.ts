#!/usr/bin/env tsx

import { BuildConfig, build, cliopts } from "estrella";
import process from "process";

const isProd = process.env.NODE_ENV === "production";

const envToDefinition = (env: Record<string, string | number | undefined>) => {
  return Object.fromEntries(
    Object.entries(env).map(([key, value]) => {
      return [`process.env.${key}`, JSON.stringify(value)];
    }),
  );
};

const bundleDefinitions = envToDefinition({
  NODE_ENV: process.env.NODE_ENV ?? "production",
  PORT: process.env.PORT ?? "3000",
  ROOT_URL: process.env.ROOT_URL ?? "",
});

const commonOpts: Partial<BuildConfig> = {
  clear: false,
  sourcemap: !isProd,
  sourcesContent: !isProd,
  bundle: true,
  minify: isProd,
};

const clientOutPath = "./build/client/js/bundle.js";
const serverOutPath = "./build/server/js/serverBundle.js";

void (async () => {
  const clientBuild = build({
    ...commonOpts,
    entryPoints: ["./packages/lesswrong/client/clientStartup.ts"],
    target: "es6",
    outfile: clientOutPath,
    platform: "browser",
    treeShaking: "ignore-annotations",
    run: false,
    tslint: false,
    define: { ...bundleDefinitions, global: "window" },
  });

  const serverBuild = build({
    ...commonOpts,
    // Typecheck using default behaviour (compliant with flags like -no-diag)
    // It's set to false on the other bundles to avoid checking it multiple times
    tslint: "auto",
    entryPoints: ["./packages/lesswrong/server/runServer.ts"],
    outfile: serverOutPath,
    platform: "node",
    define: bundleDefinitions,
    external: [
      "akismet-api",
      "canvas",
      "express",
      "mz",
      "pg",
      "pg-promise",
      "mathjax",
      "mathjax-node",
      "mathjax-node-page",
      "jsdom",
      "@sentry/node",
      "node-fetch",
      "later",
      "turndown",
      "apollo-server",
      "apollo-server-express",
      "graphql",
      "csso",
      "io-ts",
      "fp-ts",
      "bcrypt",
      "node-pre-gyp",
      "intercom-client",
      "node:*",
      "fsevents",
      "chokidar",
      "auth0",
      "pg-formatter",
      "gpt-3-encoder",
      "@elastic/elasticsearch",
      "zod",
      "node-abort-controller",
    ],
  });

  const buildProcesses = [clientBuild, serverBuild];

  if ((cliopts as { run?: boolean }).run) {
    return await Promise.race(buildProcesses);
  }
  return await Promise.all(buildProcesses);
})();
