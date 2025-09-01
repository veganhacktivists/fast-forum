import { registerMigration, fillDefaultValues } from "./migrationUtils";

<<<<<<< HEAD
import { Localgroups } from "../../lib/collections/localgroups/collection";
=======
import { Localgroups } from '../../server/collections/localgroups/collection';
>>>>>>> base/master

export default registerMigration({
  name: "setDefaultGroupActiveStatus",
  dateWritten: "2019-09-05",
  idempotent: true,
  action: async () => {
    await fillDefaultValues({
      collection: Localgroups,
      fieldName: "inactive",
    });
  },
});
