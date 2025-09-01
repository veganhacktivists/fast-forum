<<<<<<< HEAD
import { LWEvents } from "../lib/collections/lwevents/collection";
import { getSchema } from "../lib/utils/getSchema";
import { Utils } from "../lib/vulcan-lib/utils";

export const logFieldChanges = async <N extends CollectionNameString>({
  currentUser,
  collection,
  oldDocument,
  data,
}: {
  currentUser: DbUser | null;
  collection: CollectionBase<N>;
  oldDocument: ObjectsByCollectionName[N];
  data: Partial<ObjectsByCollectionName[N]>;
}) => {
  let loggedChangesBefore: any = {};
  let loggedChangesAfter: any = {};
  let schema = getSchema(collection);

=======
import { FieldChanges } from '@/server/collections/fieldChanges/collection';
import { getSchema } from '@/lib/schema/allSchemas';
import { randomId } from '@/lib/random';
import { captureException } from '@sentry/core';

export const logFieldChanges = async <
  N extends CollectionNameString
>({currentUser, collection, oldDocument, data}: {
  currentUser: DbUser|null,
  collection: CollectionBase<N>,
  oldDocument: ObjectsByCollectionName[N],
  data: Partial<ObjectsByCollectionName[N]> | UpdateInputsByCollectionName[N]['data'],
}) => {
  let loggedChangesBefore: any = {};
  let loggedChangesAfter: any = {};
  let schema = getSchema(collection.collectionName);
  
>>>>>>> base/master
  for (let key of Object.keys(data)) {
    let before = oldDocument[key as keyof ObjectsByCollectionName[N]];
    let after = (data as AnyBecauseHard)[key];
    // Don't log if:
    //  * The field didn't change
    //  * It's a denormalized field
    //  * The logChanges option is present on the field, and false
<<<<<<< HEAD
    //  * The logChanges option is undefined on the field, and is false on the collection
    if (before === after || JSON.stringify(before) === JSON.stringify(after)) continue;
    if (schema[key]?.denormalized) continue;
    if (schema[key]?.logChanges !== undefined && !schema[key]?.logChanges) continue;
    if (!schema[key]?.logChanges && !collection.options.logChanges) continue;

=======
    if (before===after || JSON.stringify(before)===JSON.stringify(after)) continue;
    if (schema[key]?.database?.denormalized) continue;
    if (schema[key]?.database?.logChanges !== undefined && !schema[key]?.database?.logChanges)
      continue;
    
>>>>>>> base/master
    // As a special case, don't log changes from null to undefined (or vise versa).
    // This special case is necessary because some upstream code (updateMutator) is
    // sloppy about the distinction.
    if (before === undefined && after === null) continue;
    if (after === undefined && before === null) continue;

    const sanitizedKey = sanitizeKey(key);
    loggedChangesBefore[sanitizedKey] = before;
    loggedChangesAfter[sanitizedKey] = after;
  }

  if (Object.keys(loggedChangesAfter).length > 0) {
<<<<<<< HEAD
    void Utils.createMutator({
      collection: LWEvents,
      currentUser,
      document: {
        name: "fieldChanges",
        documentId: oldDocument._id,
        userId: currentUser?._id,
        important: true,
        properties: {
          before: loggedChangesBefore,
          after: loggedChangesAfter,
        },
      },
      validate: false,
    });
=======
    const changeGroup = randomId();

    try {
      await Promise.all(Object.keys(loggedChangesAfter).map(key =>
        FieldChanges.rawInsert({
          userId: currentUser?._id,
          changeGroup,
          documentId: oldDocument._id,
          fieldName: key,
          oldValue: loggedChangesBefore[key],
          newValue: loggedChangesAfter[key],
        })
      ));  
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error logging field changes', error);
      captureException(error);
    }
>>>>>>> base/master
  }
};

function sanitizeKey(key: string): string {
  return key.replace(/\./g, "_");
}
