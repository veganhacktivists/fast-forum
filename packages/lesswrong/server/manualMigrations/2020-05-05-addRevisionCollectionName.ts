<<<<<<< HEAD
import { registerMigration, forEachDocumentBatchInCollection } from "./migrationUtils";
import { editableCollections } from "../../lib/editor/make_editable";
import { getCollection } from "../../lib/vulcan-lib";
import Revisions from "../../lib/collections/revisions/collection";
=======
import { registerMigration, forEachDocumentBatchInCollection } from './migrationUtils';
import { getEditableCollectionNames } from '@/server/editor/editableSchemaFieldHelpers';
import { getCollection } from '../collections/allCollections';
import Revisions from '../../server/collections/revisions/collection'
>>>>>>> base/master

export default registerMigration({
  name: "addRevisionCollectionName",
  dateWritten: "2020-05-05",
  idempotent: true,
  action: async () => {
    for (let collectionName of getEditableCollectionNames()) {
      // eslint-disable-next-line no-console
      console.log(`Migrating revisions for collection ${collectionName}`);
      await forEachDocumentBatchInCollection({
        collection: getCollection(collectionName),
        batchSize: 1000,
        callback: async (documents: DbObject[]) => {
          // eslint-disable-next-line no-console
          console.log(`Migrating a batch of ${documents.length} documents`);
          await Revisions.rawUpdateMany(
            { documentId: { $in: documents.map((doc) => doc._id) } },
            { $set: { collectionName } },
            { multi: true },
          );
        },
      });
    }
  },
});
