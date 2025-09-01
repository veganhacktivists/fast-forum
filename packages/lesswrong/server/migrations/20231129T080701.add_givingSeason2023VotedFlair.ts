import Users from "../../server/collections/users/collection";
import { BoolType } from "../../server/sql/Type";
import { addRemovedField, dropRemovedField } from "./meta/utils";

export const acceptsSchemaHash = "8b861e3bf25c8edf6522b62bea9bf389";

<<<<<<< HEAD
export const up = async ({ db }: MigrationContext) => {
  await addField(db, Users, "givingSeason2023VotedFlair");
};

export const down = async ({ db }: MigrationContext) => {
  await dropField(db, Users, "givingSeason2023VotedFlair");
};
=======
export const up = async ({db}: MigrationContext) => {
  await addRemovedField(db, Users, "givingSeason2023VotedFlair", new BoolType());
}

export const down = async ({db}: MigrationContext) => {
  await dropRemovedField(db, Users, "givingSeason2023VotedFlair");
}
>>>>>>> base/master
