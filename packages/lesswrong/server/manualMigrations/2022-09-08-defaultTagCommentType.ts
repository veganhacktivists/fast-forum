<<<<<<< HEAD
import { registerMigration, fillDefaultValues } from "./migrationUtils";
import Comments from "../../lib/collections/comments/collection";
=======
import { registerMigration, fillDefaultValues } from './migrationUtils';
import Comments from '../../server/collections/comments/collection';

>>>>>>> base/master

export default registerMigration({
  name: "defaultTagCommentType",
  dateWritten: "2022-09-08",
  idempotent: true,
  action: async () => {
    await fillDefaultValues({
      collection: Comments,
      fieldName: "tagCommentType",
    });
  },
});
