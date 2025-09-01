export const acceptsSchemaHash = "d50f15282182788bd0774a231773097a";

<<<<<<< HEAD
import Users from "../../lib/collections/users/collection";
import { addField, dropField } from "./meta/utils";
=======
import Users from "../../server/collections/users/collection"
import { addField, dropField } from "./meta/utils"
>>>>>>> base/master

export const up = async ({ db }: MigrationContext) => {
  await addField(db, Users, "usersContactedBeforeReview");
};

export const down = async ({ db }: MigrationContext) => {
  await dropField(db, Users, "usersContactedBeforeReview");
};
