import AbstractRepo from "./AbstractRepo";
import Conversations from "../../lib/collections/conversations/collection";
import keyBy from "lodash/keyBy";
import { recordPerfMetrics } from "./perfMetricWrapper";

class ConversationsRepo extends AbstractRepo<"Conversations"> {
  constructor() {
    super(Conversations);
  }

  moveUserConversationsToNewUser(oldUserId: string, newUserId: string): Promise<null> {
    return this.none(
      `
      -- ConversationsRepo.moveUserConversationsToNewUser
      UPDATE "Conversations"
      SET "participantIds" = ARRAY_APPEND(ARRAY_REMOVE("participantIds", $1), $2)
      WHERE ARRAY_POSITION("participantIds", $1) IS NOT NULL
    `,
      [oldUserId, newUserId],
    );
  }

  async getLatestMessages(conversationIds: string[]): Promise<(DbMessage | null)[]> {
    const messages = await this.getRawDb().manyOrNone<DbMessage>(
      `
      -- ConversationsRepo.getLatestMessages
      SELECT m.*
      FROM "Messages" m
      JOIN (
          SELECT "conversationId", MAX("createdAt") AS max_createdAt
          FROM "Messages"
          WHERE "conversationId" IN ($1:csv)
          GROUP BY "conversationId"
      ) sq
      ON m."conversationId" = sq."conversationId" AND m."createdAt" = sq.max_createdAt;
    `,
      [conversationIds],
    );

    const messagesByConversation = keyBy(messages, (m) => m.conversationId);
    return conversationIds.map((id) => messagesByConversation[id] ?? null);
  }
}

recordPerfMetrics(ConversationsRepo);

export default ConversationsRepo;
