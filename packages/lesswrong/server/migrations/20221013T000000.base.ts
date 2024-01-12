import fs from "node:fs";

export const up = async ({ db }: MigrationContext) => {
  const schemaPath = "schema/accepted_schema.sql";

  const baseSchema = fs.readFileSync(schemaPath).toString();

  await db.none(baseSchema);
};
