#!/usr/bin/env node

const { build, cliopts } = require("estrella");
const fs = require("fs");
const process = require("process");
const { zlib } = require("mz");
const { startAutoRefreshServer } = require("./scripts/startup/autoRefreshServer");

const bundleDefinitions = {
  bundleIsProduction: process.env.NODE_ENV === "production",
  bundleIsTest: false,
  bundleIsMigrations: false,
  defaultSiteAbsoluteUrl: `\"${process.env.ROOT_URL || ""}\"`,
  serverPort: parseInt(process.env.PORT ?? ""),
  ddEnv: `\"${process.env.DD_ENV || "local"}\"`,
};

const clientOutfilePath = `./build/client/js/bundle.js`;
build({
  entryPoints: ["./packages/lesswrong/client/clientStartup.ts"],
  bundle: true,
  target: "es6",
  sourcemap: true,
  outfile: clientOutfilePath,
  sourcesContent: true,
  treeShaking: "ignore-annotations",
  define: { ...bundleDefinitions, bundleIsServer: false },
});

build({
  entryPoints: ["./packages/lesswrong/server/runServer.ts"],
  bundle: true,
  outfile: `./build/server/js/serverBundle.js`,
  platform: "node",
  define: { ...bundleDefinitions, bundleIsServer: true },
  run: true,
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

if (cliopts.watch && cliopts.run && !isProduction) {
  startAutoRefreshServer({ serverPort, websocketPort });
}
