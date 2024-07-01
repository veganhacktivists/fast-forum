#!/usr/bin/env ts-node

import { BuildConfig, build } from "estrella";
import process from "process";

const isProd = process.env.NODE_ENV === "production";

const bundleDefinitions = {
  bundleIsProduction: isProd,
  bundleIsTest: false,
  bundleIsMigrations: false,
  defaultSiteAbsoluteUrl: `"${process.env.ROOT_URL || ""}"`,
  serverPort: parseInt(process.env.PORT ?? ""),
  ddEnv: `"${process.env.DD_ENV || "local"}"`,
} as unknown as Record<string, string>;

const commonOpts: Partial<BuildConfig> = {
  sourcemap: true,
  sourcesContent: true,
  bundle: true,
  minify: isProd,
};

const clientOutPath = "./build/client/js/bundle.js";
const serverOutPath = "./build/server/js/serverBundle.js";

const clientBuild = build({
  ...commonOpts,
  entryPoints: ["./packages/lesswrong/client/clientStartup.ts"],
  bundle: true,
  target: "es6",
  run: false,
  outfile: clientOutPath,
  treeShaking: "ignore-annotations",
  define: { ...bundleDefinitions, bundleIsServer: false as unknown as string },
  globalName: "window",
});

const serverBuild = build({
  ...commonOpts,
  entryPoints: ["./packages/lesswrong/server/runServer.ts"],
  bundle: true,
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
