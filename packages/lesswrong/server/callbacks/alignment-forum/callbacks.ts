<<<<<<< HEAD
import Users from "../../../lib/collections/users/collection";
import { userCanDo } from "../../../lib/vulcan-users/permissions";
import { Votes } from "../../../lib/collections/votes";
import { commentsAlignmentAsync, postsAlignmentAsync } from "../../resolvers/alignmentForumMutations";
import { getCollection } from "../../vulcan-lib";
import { calculateVotePower } from "../../../lib/voting/voteTypes";
import { getCollectionHooks } from "../../mutationCallbacks";
import { voteCallbacks, VoteDocTuple } from "../../../lib/voting/vote";
import { ensureIndex } from "../../../lib/collectionIndexUtils";
import { UsersRepo } from "../../repos";
=======
import Users from "../../../server/collections/users/collection";
import { userCanDo } from '../../../lib/vulcan-users/permissions';
import { Votes } from '../../../server/collections/votes/collection';
import { calculateVotePower } from '../../../lib/voting/voteTypes'
import type { VoteDocTuple } from '../../../lib/voting/vote';
import UsersRepo from "../../repos/UsersRepo";
>>>>>>> base/master

export const recalculateAFBaseScore = async (document: VoteableType): Promise<number> => {
  let votes = await Votes.find({
    documentId: document._id,
    afPower: { $exists: true },
    cancelled: false,
  }).fetch();
  return votes
    ? votes.reduce((sum, vote) => {
        return (vote.afPower ?? 0) + sum;
      }, 0)
    : 0;
};

<<<<<<< HEAD
async function updateAlignmentKarmaServer(newDocument: DbVoteableType, vote: DbVote): Promise<VoteDocTuple> {
  // Update a
  const voter = await Users.findOne(vote.userId);
  if (!voter) throw Error(`Can't find voter to update Alignment Karma for vote: ${vote}`);

  if (userCanDo(voter, "votes.alignment")) {
    const votePower = calculateVotePower(voter.afKarma, vote.voteType);

    await Votes.rawUpdateOne({ _id: vote._id, documentId: newDocument._id }, { $set: { afPower: votePower } });
    const newAFBaseScore = await recalculateAFBaseScore(newDocument);

    const collection = getCollection(vote.collectionName as VoteableCollectionName);

    await collection.rawUpdateOne({ _id: newDocument._id }, { $set: { afBaseScore: newAFBaseScore } });

    return {
      newDocument: {
        ...newDocument,
        afBaseScore: newAFBaseScore,
      },
      vote: {
        ...vote,
        afPower: votePower,
      },
    };
  } else {
    return {
      newDocument,
      vote,
    };
=======
export function getVoteAFPower({user, voteType, document}: {
  user: DbUser|UsersCurrent,
  voteType: string,
  document: VoteableType,
}) {
  if (!userCanDo(user, "votes.alignment")) {
    return 0;
>>>>>>> base/master
  }
  return calculateVotePower(user.afKarma, voteType);
}

<<<<<<< HEAD
async function updateAlignmentKarmaServerCallback({ newDocument, vote }: VoteDocTuple) {
  return await updateAlignmentKarmaServer(newDocument, vote);
}

voteCallbacks.castVoteSync.add(updateAlignmentKarmaServerCallback);

async function updateAlignmentUserServer(newDocument: DbVoteableType, vote: DbVote, multiplier: number) {
  if (newDocument.af && newDocument.userId !== vote.userId) {
    const documentUser = await Users.findOne({ _id: newDocument.userId });
    if (!documentUser) throw Error("Can't find user to update Alignment Karma");
    const karmaUpdate = (vote.afPower || 0) * multiplier;
    const newAfKarma = (documentUser.afKarma || 0) + karmaUpdate;
    if (newAfKarma > 0) {
      await Users.rawUpdateOne(
        { _id: newDocument.userId },
        {
          $set: { afKarma: newAfKarma },
          $addToSet: { groups: "alignmentVoters" },
        },
      );
=======

async function updateUserAFKarmaForVote (newDocument: DbVoteableType, vote: DbVote, multiplier: number) {
  if (newDocument.af && (newDocument.userId !== vote.userId)) {
    const documentUser = await Users.findOne({_id:newDocument.userId})
    if (!documentUser) throw Error("Can't find user to update Alignment Karma")
    const karmaUpdate = (vote.afPower || 0) * multiplier;
    const newAfKarma = (documentUser.afKarma || 0) + karmaUpdate;
    if (newAfKarma > 0) {
      await Users.rawUpdateOne({_id:newDocument.userId}, {
        $inc: {afKarma: karmaUpdate},
        $addToSet: {groups: 'alignmentVoters'}
      })
>>>>>>> base/master
    } else {
      // Need to use Math.abs since the multiplier is -1 for downvotes (which is almost certainly what's triggering this)
      await new UsersRepo().removeAlignmentGroupAndKarma(newDocument.userId!, Math.abs(karmaUpdate));
    }
  }
}

<<<<<<< HEAD
async function updateAlignmentUserServerCallback({ newDocument, vote }: VoteDocTuple) {
  await updateAlignmentUserServer(newDocument, vote, 1);
}

voteCallbacks.castVoteAsync.add(updateAlignmentUserServerCallback);

async function cancelAlignmentUserKarmaServer({ newDocument, vote }: VoteDocTuple) {
  await updateAlignmentUserServer(newDocument, vote, -1);
}

voteCallbacks.cancelAsync.add(cancelAlignmentUserKarmaServer);

voteCallbacks.cancelSync.add(function cancelAlignmentKarmaServerCallback({ newDocument, vote }: VoteDocTuple) {
  void updateAlignmentKarmaServer(newDocument, vote);
});

async function MoveToAFUpdatesUserAFKarma(document: DbPost | DbComment, oldDocument: DbPost | DbComment) {
=======
export async function grantUserAFKarmaForVote ({newDocument, vote}: VoteDocTuple) {
  await updateUserAFKarmaForVote(newDocument, vote, 1)
}

export async function revokeUserAFKarmaForCancelledVote ({newDocument, vote}: VoteDocTuple) {
  await updateUserAFKarmaForVote(newDocument, vote, -1)

}

export async function moveToAFUpdatesUserAFKarma (document: Pick<DbPost|DbComment, 'af' | 'afBaseScore' | 'userId' | '_id'>, oldDocument: Pick<DbPost|DbComment, 'af' | 'afBaseScore' | 'userId' | '_id'>) {
>>>>>>> base/master
  if (document.af && !oldDocument.af) {
    await Users.rawUpdateOne(
      { _id: document.userId },
      {
        $inc: { afKarma: document.afBaseScore ?? 0 },
        $addToSet: { groups: "alignmentVoters" },
      },
    );
    await Votes.rawUpdateMany(
      { documentId: document._id },
      {
        $set: { documentIsAf: true },
      },
      { multi: true },
    );
  } else if (!document.af && oldDocument.af) {
    const documentUser = await Users.findOne({ _id: document.userId });
    if (!documentUser) throw Error("Can't find user for updating karma after moving document to AIAF");
    const karmaUpdate = -(document.afBaseScore ?? 0);
    const newAfKarma = (documentUser.afKarma || 0) + karmaUpdate;
    if (newAfKarma > 0) {
      await Users.rawUpdateOne({ _id: document.userId }, { $inc: { afKarma: karmaUpdate } });
    } else {
      // Need to use Math.abs since the multiplier is -1 for downvotes (which is almost certainly what's triggering this)
      await new UsersRepo().removeAlignmentGroupAndKarma(document.userId, Math.abs(karmaUpdate));
    }
    await Votes.rawUpdateMany(
      { documentId: document._id },
      {
        $set: { documentIsAf: false },
      },
      { multi: true },
    );
  }
}
<<<<<<< HEAD
ensureIndex(Votes, { documentId: 1 });
=======
>>>>>>> base/master


export async function postsMoveToAFAddsAlignmentVoting (post: DbPost, oldPost: DbPost) {
  if (post.af && !oldPost.af) {
    await Users.rawUpdateOne({_id:post.userId}, {$addToSet: {groups: 'alignmentVoters'}})
  }
}
