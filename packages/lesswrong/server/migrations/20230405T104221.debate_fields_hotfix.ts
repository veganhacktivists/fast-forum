<<<<<<< HEAD
import Users from "../../lib/vulcan-users";
import { addField, dropField } from "./meta/utils";
=======
import Users from "../../server/collections/users/collection"
import { addField, dropField } from "./meta/utils"
>>>>>>> base/master

export const up = async ({ db }: MigrationContext) => {
  await addField(db, Users, "notificationDebateCommentsOnSubscribedPost");
  await addField(db, Users, "notificationDebateReplies");
};

export const down = async ({ db }: MigrationContext) => {
  await dropField(db, Users, "notificationDebateCommentsOnSubscribedPost");
  await dropField(db, Users, "notificationDebateReplies");
};
