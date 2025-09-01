<<<<<<< HEAD:packages/lesswrong/lib/collections/moderatorActions/collection.ts
import schema from "./schema";
import { createCollection } from "../../vulcan-lib";
import { addUniversalFields, getDefaultResolvers } from "../../collectionUtils";
import { getDefaultMutations } from "../../vulcan-core/default_mutations";
=======
import { createCollection } from '@/lib/vulcan-lib/collections';
import { DatabaseIndexSet } from '@/lib/utils/databaseIndexSet';
>>>>>>> base/master:packages/lesswrong/server/collections/moderatorActions/collection.ts

/**
 * Creating a moderator action sets a note on the user's profile for moderators
 * to see, and triggers a review if necessary.
 *
 * Pass currentUser to createMutator to set the moderator who created the
 * action. Do *not* pass currentUser if the currentUser is the user themselves.
 * Setting currentUser to null (and validate to false) will create the action as
 * 'Automod'.
 */
export const ModeratorActions: ModeratorActionsCollection = createCollection({
<<<<<<< HEAD:packages/lesswrong/lib/collections/moderatorActions/collection.ts
  collectionName: "ModeratorActions",
  typeName: "ModeratorAction",
  schema,
  resolvers: getDefaultResolvers("ModeratorActions"),
  mutations: getDefaultMutations("ModeratorActions"),
  logChanges: true,
});

addUniversalFields({ collection: ModeratorActions });
=======
  collectionName: 'ModeratorActions',
  typeName: 'ModeratorAction',
    getIndexes: () => {
    const indexSet = new DatabaseIndexSet();
    indexSet.addIndex('ModeratorActions', { userId: 1, createdAt: -1 })
    indexSet.addIndex('ModeratorActions', { type: 1, createdAt: -1, endedAt: -1 })
    return indexSet;
  },
});

>>>>>>> base/master:packages/lesswrong/server/collections/moderatorActions/collection.ts

export default ModeratorActions;
