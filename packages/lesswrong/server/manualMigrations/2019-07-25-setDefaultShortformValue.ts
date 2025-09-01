import { registerMigration, fillDefaultValues } from "./migrationUtils";

<<<<<<< HEAD
import { Posts } from "../../lib/collections/posts/collection";
=======
import { Posts } from '../../server/collections/posts/collection';
>>>>>>> base/master

export default registerMigration({
  name: "setDefaultShortformValue",
  dateWritten: "2019-07-25",
  idempotent: true,
  action: async () => {
    await fillDefaultValues({
      collection: Posts,
      fieldName: "shortform",
    });
  },
});
