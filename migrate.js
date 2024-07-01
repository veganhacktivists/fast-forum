/**
 * Usage: pnpm migrate up|down|pending|executed [dev|staging|prod] [forumType]
 *
 * If no environment is specified, you can use the environment variables PG_URL
 * and SETTINGS_FILE
 */
require("ts-node/register");
const { getDatabaseConfig } = require("./scripts/startup/buildUtil");

const initGlobals = async (args, isProd) => {
  global.bundleIsServer = true;
  global.bundleIsTest = false;
  global.bundleIsProduction = isProd;
  global.bundleIsMigrations = true;
  global.defaultSiteAbsoluteUrl = "";
  global.serverPort = 5001;
  global.estrellaPid = -1;

  const { initPostgres } = require("./packages/lesswrong/server/serverStartup.ts");
  // console.log(require("./packages/lesswrong/server/serverStartup.ts"));
  await initPostgres();
  const { getInstanceSettings } = require("./packages/lesswrong/lib/executionEnvironment");
  getInstanceSettings(args); // These args will be cached for later
};

const fetchImports = async (args, isProd) => {
  await initGlobals(args, isProd);

  const { getSqlClient, getSqlClientOrThrow, setSqlClient } = require("./packages/lesswrong/lib/sql/sqlClient");
  const { createSqlConnection } = require("./packages/lesswrong/server/sqlConnection");
  return { getSqlClient, getSqlClientOrThrow, setSqlClient, createSqlConnection };
};

const credentialsPath = (forumType) => {
  const memorizedBases = {
    lw: "..",
    ea: "..",
  };
  const base = process.env.GITHUB_WORKSPACE ?? memorizedBases[forumType] ?? ".";
  const memorizedRepoNames = {
    lw: "LessWrong-Credentials",
    ea: "ForumCredentials",
  };
  const repoName = memorizedRepoNames[forumType];
  if (!repoName) {
    return base;
  }
  return `${base}/${repoName}`;
};

const settingsFileName = (mode) => {
  if (process.env.SETTINGS_FILE) {
    return process.env.SETTINGS_FILE;
  }
  if (!mode) {
    // With the state of the code when this comment was written, this indicates
    // an error condition, but it will be handled later, around L60
    throw new Error("No SETTINGS_FILE variable specified");
    return "";
  }
  return `settings-${mode}.json`;
};

(async () => {
  const command = process.argv[2];
  if (["dev", "development", "staging", "production", "prod"].includes(command)) {
    console.error("Please specify the command before the mode");
    process.exit(1);
  }
  const isRunCommand = ["up", "down"].includes(command);

  let mode = process.argv[3];
  if (mode === "development") {
    mode = "dev";
  } else if (mode === "production") {
    mode = "prod";
  } else if (!["up", "down", "pending", "executed"].includes(command)) {
    mode = "dev";
  }

  const forumType = process.argv[4];

  const { postgresUrl } = getDatabaseConfig();

  const args = {
    postgresUrl,
    settingsFileName: settingsFileName(mode, forumType),
    shellMode: false,
  };

  if (!args.postgresUrl || !args.settingsFileName) {
    throw new Error("Unable to run migration without a mode or environment (PG_URL and SETTINGS_FILE)");
  }

  const { getSqlClient, setSqlClient, createSqlConnection } = await fetchImports(args, mode === "prod");

  let exitCode = 0;

  const db = getSqlClient() ?? (await createSqlConnection(args.postgresUrl));

  try {
    await db.tx(async (transaction) => {
      setSqlClient(transaction);
      const { createMigrator } = require("./packages/lesswrong/server/migrations/meta/umzug");
      const migrator = await createMigrator(transaction);
      const result = await migrator.runAsCLI();
      if (!result) {
        // If the migration throws an error it will have already been reported,
        // but we need to manually propagate it to the exitCode
        exitCode = 1;
      }
    });
  } catch (e) {
    console.error("An error occurred while running migrations:", e);
    exitCode = 1;
  }

  await db.$pool.end();
  process.exit(exitCode);
})();
