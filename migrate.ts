/**
 * Usage: pnpm migrate up|down|pending|executed [dev|staging|prod] [forumType]
 *
 * If no environment is specified, you can use the environment variables PG_URL
 * and SETTINGS_FILE
 */

process.env.IS_MIGRATION = "1";

const settingsFileName = (mode: string) => {
  if (process.env.SETTINGS_FILE) {
    return process.env.SETTINGS_FILE;
  }
  if (!mode) {
    // With the state of the code when this comment was written, this indicates
    // an error condition, but it will be handled later, around L60
    throw new Error("No SETTINGS_FILE variable specified");
  }
  return `settings-${mode}.json`;
};

void (async () => {
  // @ts-expect-error not a TS file
  const { getDatabaseConfig } = await import("./scripts/startup/buildUtil");
  const { initDatabases, initPostgres, initSettings } = await import("./packages/lesswrong/server/serverStartup.ts");
  const { getSqlClient } = await import("./packages/lesswrong/lib/sql/sqlClient.ts");
  const { createSqlConnection } = await import("./packages/lesswrong/server/sqlConnection.ts");
  const { createMigrator } = await import("./packages/lesswrong/server/migrations/meta/umzug.ts");

  const { postgresUrl } = getDatabaseConfig();

  const command = process.argv[2];
  if (["dev", "development", "staging", "production", "prod"].includes(command)) {
    // eslint-disable-next-line no-console
    console.error("Please specify the command before the mode");
    process.exit(1);
  }

  let mode = process.argv[3];
  if (mode === "development") {
    mode = "dev";
  } else if (mode === "production") {
    mode = "prod";
  } else if (!["up", "down", "pending", "executed"].includes(command)) {
    mode = "dev";
  }

  const args = {
    postgresUrl,
    settingsFileName: settingsFileName(mode),
    shellMode: false,
  };

  if (!args.postgresUrl || !args.settingsFileName) {
    throw new Error("Unable to run migration without a mode or environment (PG_URL and SETTINGS_FILE)");
  }

  let exitCode = 0;

  await initDatabases(args);
  await initSettings();
  require("./packages/lesswrong/minimum_env.ts");
  await initPostgres();

  const db = getSqlClient() ?? (await createSqlConnection(args.postgresUrl));

  try {
    const migrator = await createMigrator(db);
    const result = await migrator.runAsCLI();
    if (!result) {
      // If the migration throws an error it will have already been reported,
      // but we need to manually propagate it to the exitCode
      exitCode = 1;
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("An error occurred while running migrations:", e);
    exitCode = 1;
  }

  await db.$pool.end();
  process.exit(exitCode);
})();
