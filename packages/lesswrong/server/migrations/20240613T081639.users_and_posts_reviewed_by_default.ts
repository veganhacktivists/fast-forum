import { Posts } from "../../lib/collections/posts";
import Users from "../../lib/vulcan-users";
import { updateDefaultValue, addField, dropField, dropDefaultValue } from "./meta/utils";

export const up = async ({ db }: MigrationContext) => {
  await updateDefaultValue(db, Posts, "reviewedByUserId");
  await updateDefaultValue(db, Users, "reviewedByUserId");
  await updateDefaultValue(db, Users, "reviewedAt");
};

export const down = async ({ db }: MigrationContext) => {
  await dropDefaultValue(db, Posts, "reviewedByUserId");
  await dropDefaultValue(db, Users, "reviewedByUserId");
  await dropDefaultValue(db, Users, "reviewedAt");
};
