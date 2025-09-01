<<<<<<< HEAD
import { registerMigration, forEachDocumentBatchInCollection } from "./migrationUtils";
import { getPrecedingRev, htmlToChangeMetrics } from "../editor/make_editable_callbacks";
import Revisions from "../../lib/collections/revisions/collection";
=======
import { registerMigration, forEachDocumentBatchInCollection } from './migrationUtils';
import Revisions from '../../server/collections/revisions/collection'
import { getPrecedingRev, htmlToChangeMetrics } from '../editor/utils';
import { createAnonymousContext } from '../vulcan-lib/createContexts';
>>>>>>> base/master

export default registerMigration({
  name: "revisionChangeMetrics",
  dateWritten: "2020-09-15",
  idempotent: true,
  action: async () => {
    const context = createAnonymousContext();
    await forEachDocumentBatchInCollection({
      collection: Revisions,
      filter: { changeMetrics: { $exists: false } },
      batchSize: 1000,
      callback: async (revisions: Array<DbRevision>) => {
        const changes: Array<any> = [];
<<<<<<< HEAD
        await Promise.all(
          revisions.map(async (rev: DbRevision) => {
            const previousRev = await getPrecedingRev(rev);
            const changeMetrics = htmlToChangeMetrics(previousRev?.html || "", rev.html || "");
            changes.push({
              updateOne: {
                filter: { _id: rev._id },
                update: { $set: { changeMetrics } },
              },
            });
          }),
        );
=======
        await Promise.all(revisions.map(async (rev: DbRevision) => {
          const previousRev = await getPrecedingRev(rev, context);
          const changeMetrics = htmlToChangeMetrics(previousRev?.html || "", rev.html||"");
          changes.push({
            updateOne: {
              filter: { _id: rev._id },
              update: { $set: { changeMetrics } },
            }
          });
        }));
>>>>>>> base/master
        await Revisions.rawCollection().bulkWrite(changes, { ordered: false });
      },
    });
  },
});
