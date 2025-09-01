import ReadStatuses from "../../server/collections/readStatus/collection";
import { randomId } from "../../lib/random";
import AbstractRepo from "./AbstractRepo";
import { recordPerfMetrics } from "./perfMetricWrapper";

interface UpsertReadStatusOptions {
  skipIsReadUpdateOnUpsert?: boolean;
}

class ReadStatusesRepo extends AbstractRepo<"ReadStatuses"> {
  constructor() {
    super(ReadStatuses);
  }

<<<<<<< HEAD
  upsertReadStatus(userId: string, postId: string, isRead: boolean): Promise<null> {
    return this.none(
      `
=======
  /**
   * In the case where we're upserting a read status because the comments were read (but not the post),
   * `skipIsReadUpdateOnUpsert` prevents us from updating any existing `isRead` value, and only sets `isRead: false` during the insert
   */
  upsertReadStatus(userId: string, postId: string, isRead: boolean, options: UpsertReadStatusOptions = {}): Promise<DbReadStatus> {
    const { skipIsReadUpdateOnUpsert } = options;
    const updateIsReadClause = skipIsReadUpdateOnUpsert ? '' : '"isRead" = $(isRead),';

    return this.one(`
>>>>>>> base/master
      INSERT INTO "ReadStatuses" (
        "_id",
        "postId",
        "tagId",
        "userId",
        "isRead",
        "lastUpdated"
      ) VALUES (
        $(_id), $(postId), $(tagId), $(userId), $(isRead), $(lastUpdated)
      )
<<<<<<< HEAD
      `,
      // Removed this to avoid a crash
      //  ON CONFLICT (
      //         COALESCE("postId", ''),
      //         COALESCE("userId", ''),
      //         COALESCE("tagId", '')
      //        )
      //       DO UPDATE SET
      //         "isRead" = $(isRead),
      //         "lastUpdated" = $(lastUpdated)
      {
        _id: randomId(),
        userId,
        postId,
        isRead,
        tagId: null,
        lastUpdated: new Date(),
      },
    );
=======
      DO UPDATE SET
        ${updateIsReadClause}
        "lastUpdated" = $(lastUpdated)
      RETURNING *
      `, {
      _id: randomId(),
      userId,
      postId,
      isRead,
      tagId: null,
      lastUpdated: new Date(),
    });
>>>>>>> base/master
  }
}

recordPerfMetrics(ReadStatusesRepo);

export default ReadStatusesRepo;
