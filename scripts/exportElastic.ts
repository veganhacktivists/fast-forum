import { getSqlClient, setSqlClient } from "../packages/lesswrong/lib/sql/sqlClient";
import ElasticExporter from "../packages/lesswrong/server/search/elastic/ElasticExporter";
import { initDatabases, initPostgres, initSettings } from "../packages/lesswrong/server/serverStartup";
import { getDatabaseConfig } from "./startup/buildUtil";

(async () => {
  const { postgresUrl } = getDatabaseConfig();
  await initDatabases({ postgresUrl });
  await initSettings();
  require("../packages/lesswrong/minimum_env.ts");
  await initPostgres();

  const exporter = new ElasticExporter();

  await exporter.configureIndexes();
  await exporter.exportAll();
})();
