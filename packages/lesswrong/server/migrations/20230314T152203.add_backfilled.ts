export const acceptsSchemaHash = "9cc5aad21f36f801d9ce6b9e9e3ce213";

<<<<<<< HEAD
import TagRels from "../../lib/collections/tagRels/collection";
import { addField, dropField } from "./meta/utils";
=======
import TagRels from "../../server/collections/tagRels/collection";
import { addField, dropField } from "./meta/utils"
>>>>>>> base/master

export const up = async ({ db }: MigrationContext) => {
  await addField(db, TagRels, "backfilled");
};

export const down = async ({ db }: MigrationContext) => {
  await dropField(db, TagRels, "backfilled");
};
