export const acceptsSchemaHash = "2c8fcbdc99caee38d7f728acc6428352";

import { BoolType } from "../../server/sql/Type";
import Users from "../../server/collections/users/collection";
import { addRemovedField, dropRemovedField } from "./meta/utils";

<<<<<<< HEAD
export const up = async ({ db }: MigrationContext) => {
  await addField(db, Users, "wrapped2023Viewed");
};

export const down = async ({ db }: MigrationContext) => {
  await dropField(db, Users, "wrapped2023Viewed");
};
=======
export const up = async ({db}: MigrationContext) => {
  await addRemovedField(db, Users, "wrapped2023Viewed", new BoolType())
}

export const down = async ({db}: MigrationContext) => {
  await dropRemovedField(db, Users, "wrapped2023Viewed");
}
>>>>>>> base/master
