import { registerMigration, fillDefaultValues } from "./migrationUtils";

<<<<<<< HEAD
import { Users } from "../../lib/collections/users/collection";
=======
import { Users } from '../../server/collections/users/collection';
>>>>>>> base/master

export default registerMigration({
  name: "setSunshineSnoozeValues",
  dateWritten: "2020-01-24",
  idempotent: true,
  action: async () => {
    await fillDefaultValues({
      collection: Users,
      fieldName: "sunshineSnoozed",
    });
    await fillDefaultValues({
      collection: Users,
      fieldName: "needsReview",
    });
  },
});
