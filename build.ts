#!/usr/bin/env ts-node

import { BuildConfig, build } from "estrella";
import process from "process";

const isProd = process.env.NODE_ENV === "production";

const bundleDefinitions = {
  bundleIsMigrations: false,
  bundleIsServer: false as unknown as string,
  bundlePort: JSON.stringify(parseInt(process.env.PORT || "")),
  bundleRootUrl: JSON.stringify(process.env.ROOT_URL || ""),
} as unknown as Record<string, string>;

const commonOpts: Partial<BuildConfig> = {
  sourcemap: !isProd,
  sourcesContent: !isProd,
  bundle: true,
  minify: isProd,
};

const clientOutPath = "./build/client/js/bundle.js";
const serverOutPath = "./build/server/js/serverBundle.js";
const migrationOutPath = "./build/migration/js/runMigrations.js";

const migrationBuild = build({
  ...commonOpts,
  entryPoints: ["./migrate.ts"],
  platform: "node",
  run: false,
  outfile: migrationOutPath,
  define: {
    ...bundleDefinitions,
    bundleIsServer: true,
    bundleIsMigrations: true,
  } as unknown as typeof bundleDefinitions,
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
    "dd-trace",
    "pg-formatter",
    "gpt-3-encoder",
    "@elastic/elasticsearch",
    "zod",
    "node-abort-controller",
  ],
});

const clientBuild = build({
  ...commonOpts,
  entryPoints: ["./packages/lesswrong/client/clientStartup.ts"],
  target: "es6",
  run: false,
  outfile: clientOutPath,
  treeShaking: "ignore-annotations",
  define: {
    ...bundleDefinitions,
    bundleIsServer: false as unknown as string,
    global: "window",
  },
  globalName: "window",
});

const serverBuild = build({
  ...commonOpts,
  entryPoints: ["./packages/lesswrong/server/runServer.ts"],
  outfile: serverOutPath,
  platform: "node",
  define: { ...bundleDefinitions, bundleIsServer: true as unknown as string },
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
    "dd-trace",
    "pg-formatter",
    "gpt-3-encoder",
    "@elastic/elasticsearch",
    "zod",
    "node-abort-controller",
  ],
});