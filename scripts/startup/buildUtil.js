const fs = require("fs");
const process = require("process");

/**
 * Distill all the various connection-string-related options into a
 * straightforward database connection string. Takes parsed command-line options
 * formatted as Estrella's CLI-parser would parse them, ie, a dictionary where
 * arguments of the form "--opt <string>" turn into {opt: "<string>"}. If
 * connection-string arguments aren't provided, uses the environment variable
 * PG_URL as a fallback.
 *
 * Because this is used by build.js which is itself responsible for invoking the
 * Typescript compiler, it isn't in typescript. The type of this function is:
 *
 *   getDatabaseConfig: (opts: { db?: string postgresUrl?: string
 *     postgresUrlFile?: string
 *   }) => {
 *     postgresUrl: string
 *   }
 *
 * If postgresUrlFile is provided, it's the path to a text file containing the
 * value of postgresUrl. If "db" is provided, it's the path to a JSON file
 * containing a JSON object of type:
 *   {
 *     postgresUrl: string
 *   }
 */
function getDatabaseConfig() {
  return {
    postgresUrl: process.env.PG_URL || "",
  };
}

let outputDir = "./build";
function setOutputDir(dir) {
  outputDir = dir;
}
function getOutputDir(dir) {
  return outputDir;
}

module.exports = { getDatabaseConfig, getOutputDir, setOutputDir };
