<<<<<<< HEAD
import { registerMigration, fillDefaultValues } from "./migrationUtils";
import { Tags } from "../../lib/collections/tags/collection";
=======

import { registerMigration, fillDefaultValues } from './migrationUtils';
import { Tags } from '../../server/collections/tags/collection';
>>>>>>> base/master

export default registerMigration({
  name: "defaultWikiGrade",
  dateWritten: "2020-07-23",
  idempotent: true,
  action: async () => {
    await fillDefaultValues({
      collection: Tags,
      fieldName: "wikiGrade",
    });
  },
});
