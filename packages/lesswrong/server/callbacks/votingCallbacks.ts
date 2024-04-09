import moment from "moment";
import Notifications from "../../lib/collections/notifications/collection";
import { Posts } from "../../lib/collections/posts/collection";
import Users from "../../lib/collections/users/collection";
import { isLWorAF } from "../../lib/instanceSettings";
import { voteCallbacks, VoteDocTuple } from "../../lib/voting/vote";
import { userSmallVotePower } from "../../lib/voting/voteTypes";
import { postPublishedCallback } from "../notificationCallbacks";
import { createNotification } from "../notificationCallbacksHelpers";
import { checkForStricterRateLimits } from "../rateLimitUtils";
import { batchUpdateScore } from "../updateScores";
import { triggerCommentAutomodIfNeeded } from "./sunshineCallbackUtils";

export const collectionsThatAffectKarma = ["Posts", "Comments", "Revisions"];

/**
 * @summary Update the karma of the item's owner
 * @param {object} item - The item being operated on
 * @param {object} user - The user doing the operation
 * @param {object} collection - The collection the item belongs to
 * @param {string} operation - The operation being performed
 */
voteCallbacks.castVoteAsync.add(async function updateKarma(
  { newDocument, vote }: VoteDocTuple,
  collection: CollectionBase<VoteableCollectionName>,
  user: DbUser,
  context,
) {
  // Only update user karma if the operation isn't done by one of the item's current authors.
  // We don't want to let any of the authors give themselves or another author karma for this item.
  // We need to await it so that the subsequent check for whether any stricter rate limits apply can do a proper comparison between old and new karma
  if (
    vote.authorIds &&
    !vote.authorIds.includes(vote.userId) &&
    collectionsThatAffectKarma.includes(vote.collectionName)
  ) {
    // if (!vote.authorIds.includes(vote.userId) && collectionsThatAffectKarma.includes(vote.collectionName)) {
    const users = await Users.find({ _id: { $in: vote.authorIds } }).fetch();
    await Users.rawUpdateMany({ _id: { $in: vote.authorIds } }, { $inc: { karma: vote.power } });

    if (newDocument.userId) {
      for (let user of users) {
        const oldKarma = user.karma;
        const newKarma = oldKarma + vote.power;
        void userKarmaChangedFrom(newDocument.userId, oldKarma, newKarma, context);
      }
    }
  }

  if (!!newDocument.userId && isLWorAF && ["Posts", "Comments"].includes(vote.collectionName)) {
    void checkForStricterRateLimits(newDocument.userId, context);
  }
});

async function userKarmaChangedFrom(userId: string, oldKarma: number, newKarma: number, context: ResolverContext) {
  if (userSmallVotePower(oldKarma, 1) < userSmallVotePower(newKarma, 1)) {
    const yesterday = moment().subtract(1, "days").toDate();
    const existingNotificationCount = await Notifications.find({
      userId,
      type: "karmaPowersGained",
      createdAt: { $gt: yesterday },
    }).count();
    if (existingNotificationCount === 0) {
      await createNotification({
        userId,
        notificationType: "karmaPowersGained",
        documentType: null,
        documentId: null,
        context,
      });
    }
  }
}

voteCallbacks.cancelAsync.add(function cancelVoteKarma(
  { newDocument, vote }: VoteDocTuple,
  collection: CollectionBase<VoteableCollectionName>,
  user: DbUser,
) {
  // Only update user karma if the operation isn't done by one of the item's authors at the time of the original vote.
  // We expect vote.authorIds here to be the same as the authorIds of the original vote.
  if (
    vote.authorIds &&
    !vote.authorIds.includes(vote.userId) &&
    collectionsThatAffectKarma.includes(vote.collectionName)
  ) {
    void Users.rawUpdateMany({ _id: { $in: vote.authorIds } }, { $inc: { karma: -vote.power } });
  }
});

voteCallbacks.castVoteAsync.add(async function incVoteCount({ newDocument, vote }: VoteDocTuple) {
  if (vote.voteType === "neutral") {
    return;
  }

  // Increment the count for the person casting the vote
  const casterField = `${vote.voteType}Count`;

  if (newDocument.userId !== vote.userId) {
    void Users.rawUpdateOne({ _id: vote.userId }, { $inc: { [casterField]: 1, voteCount: 1 } });
  }

  // Increment the count for the person receiving the vote
  const receiverField = `${vote.voteType}ReceivedCount`;

  if (newDocument.userId !== vote.userId) {
    // update all users in vote.authorIds
    void Users.rawUpdateMany({ _id: { $in: vote.authorIds } }, { $inc: { [receiverField]: 1, voteReceivedCount: 1 } });
  }
});

voteCallbacks.cancelAsync.add(async function cancelVoteCount({ newDocument, vote }: VoteDocTuple) {
  if (vote.voteType === "neutral") {
    return;
  }

  const casterField = `${vote.voteType}Count`;

  if (newDocument.userId !== vote.userId) {
    void Users.rawUpdateOne({ _id: vote.userId }, { $inc: { [casterField]: -1, voteCount: -1 } });
  }

  // Increment the count for the person receiving the vote
  const receiverField = `${vote.voteType}ReceivedCount`;

  if (newDocument.userId !== vote.userId) {
    // update all users in vote.authorIds
    void Users.rawUpdateMany(
      { _id: { $in: vote.authorIds } },
      { $inc: { [receiverField]: -1, voteReceivedCount: -1 } },
    );
  }
});

voteCallbacks.castVoteAsync.add(async function checkAutomod(
  { newDocument, vote }: VoteDocTuple,
  collection,
  user,
  context,
) {
  if (vote.collectionName === "Comments") {
    void triggerCommentAutomodIfNeeded(newDocument, vote);
  }
});

postPublishedCallback.add(async (publishedPost: DbPost) => {
  // When a post is published (undrafted), update its score. (That is, recompute
  // the time-decaying score used for sorting, since the time that's computed
  // relative to has just changed).
  //
  // To do this, we mark it `inactive:false` and update the scores on the
  // whole collection. (This is already something being done frequently by a
  // cronjob.)
  if (publishedPost.inactive) {
    await Posts.rawUpdateOne({ _id: publishedPost._id }, { $set: { inactive: false } });
  }

  await batchUpdateScore({ collection: Posts });
});
