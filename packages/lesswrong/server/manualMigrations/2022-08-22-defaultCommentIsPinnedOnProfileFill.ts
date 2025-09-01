<<<<<<< HEAD
import { registerMigration, fillDefaultValues } from "./migrationUtils";
import Comments from "../../lib/collections/comments/collection";
=======
import { registerMigration, fillDefaultValues } from './migrationUtils';
import Comments from '../../server/collections/comments/collection';

>>>>>>> base/master

export default registerMigration({
  name: "defaultCommentIsPinnedOnProfileFill",
  dateWritten: "2022-08-22",
  idempotent: true,
  action: async () => {
    await fillDefaultValues({
      collection: Comments,
      fieldName: "isPinnedOnProfile",
    });
  },
});
