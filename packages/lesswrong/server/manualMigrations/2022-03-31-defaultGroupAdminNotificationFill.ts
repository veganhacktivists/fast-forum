<<<<<<< HEAD
import { registerMigration, fillDefaultValues } from "./migrationUtils";
import Users from "../../lib/collections/users/collection";
=======
import { registerMigration, fillDefaultValues } from './migrationUtils';
import Users from '../../server/collections/users/collection';

>>>>>>> base/master

export default registerMigration({
  name: "defaultGroupAdminNotificationFill",
  dateWritten: "2022-03-31",
  idempotent: true,
  action: async () => {
    await fillDefaultValues({
      collection: Users,
      fieldName: "notificationGroupAdministration",
    });
  },
});
