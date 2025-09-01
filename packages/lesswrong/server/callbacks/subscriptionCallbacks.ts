<<<<<<< HEAD
import { Subscriptions } from "../../lib/collections/subscriptions/collection";
import { getCollectionHooks } from "../mutationCallbacks";

getCollectionHooks("Subscriptions").createBefore.add(async function deleteOldSubscriptions(subscription) {
  const { userId, documentId, collectionName, type } = subscription;
  await Subscriptions.rawUpdateMany(
    { userId, documentId, collectionName, type },
    { $set: { deleted: true } },
    { multi: true },
  );
=======
export async function deleteOldSubscriptions(subscription: CreateSubscriptionDataInput & { userId?: string }, context: ResolverContext) {
  const { Subscriptions } = context;
  const { userId, documentId, collectionName, type } = subscription
  await Subscriptions.rawUpdateMany({userId, documentId, collectionName, type}, {$set: {deleted: true}}, {multi: true})
>>>>>>> base/master
  return subscription;
}
