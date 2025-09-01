import { registerMigration, fillDefaultValues } from "./migrationUtils";

<<<<<<< HEAD
import { Notifications } from "../../lib/collections/notifications/collection";
=======
import { Notifications } from '../../server/collections/notifications/collection';
>>>>>>> base/master

export default registerMigration({
  name: "setDefaultNotificationValues",
  dateWritten: "2019-10-23",
  idempotent: true,
  action: async () => {
    await fillDefaultValues({
      collection: Notifications,
      fieldName: "emailed",
    });
    await fillDefaultValues({
      collection: Notifications,
      fieldName: "waitingForBatch",
    });
  },
});
