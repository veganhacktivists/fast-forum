<<<<<<< HEAD
import Chapters from "../../lib/collections/chapters/collection";
import { getCollectionHooks } from "../mutationCallbacks";
=======
import { backgroundTask } from "../utils/backgroundTask";
>>>>>>> base/master

export function createFirstChapter(sequence: DbSequence, context: ResolverContext) {
  const { Chapters } = context;
  if (sequence._id) {
<<<<<<< HEAD
    void Chapters.rawInsert({ sequenceId: sequence._id, postIds: [] });
=======
    backgroundTask(Chapters.rawInsert({sequenceId:sequence._id, postIds: []}))
>>>>>>> base/master
  }
}
