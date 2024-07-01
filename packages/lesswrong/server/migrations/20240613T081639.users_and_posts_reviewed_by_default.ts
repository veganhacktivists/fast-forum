import { Posts } from "../../lib/collections/posts";
import { autoreviewerUserIdSetting } from "../../lib/instanceSettings";
import Users from "../../lib/vulcan-users";
import { updateDefaultValue, dropDefaultValue } from "./meta/utils";

export const up = async ({ db }: MigrationContext) => {
  await db.tx(async (db) => {
    await db.none(`UPDATE "${Posts.collectionName}"
                  SET "reviewedByUserId" = '${autoreviewerUserIdSetting.get()}'
                  WHERE "reviewedByUserId" IS NULL
                  `);
    await db.none(`UPDATE "${Users.collectionName}"
                  SET "reviewedByUserId" = '${autoreviewerUserIdSetting.get()}'
                  WHERE "reviewedByUserId" IS NULL
                  `);
    await db.none(`UPDATE "${Users.collectionName}"
                  SET "reviewedByUserId" = NOW()
                  WHERE "reviewedAt" IS NULL
                  `);
    await updateDefaultValue(db, Posts, "reviewedByUserId");
    await updateDefaultValue(db, Users, "reviewedByUserId");
    await updateDefaultValue(db, Users, "reviewedAt");
  });
};

export const down = async ({ db }: MigrationContext) => {
  await db.tx(async (db) => {
    await Promise.all([
      dropDefaultValue(db, Posts, "reviewedByUserId"),
      dropDefaultValue(db, Users, "reviewedByUserId"),
      dropDefaultValue(db, Users, "reviewedAt"),
    ]);

    await db.none(`UPDATE "${Posts.collectionName}"
                  SET "reviewedByUserId" = NULL
                  WHERE "reviewedByUserId" = '${autoreviewerUserIdSetting.get()}'
                  `);
    await db.none(`UPDATE "${Users.collectionName}"
                  SET "reviewedByUserId" = NULL, "reviewedAt" = NULL
                  WHERE "reviewedByUserId" = '${autoreviewerUserIdSetting.get()}'
                  `);
    await db.none(`UPDATE "${Users.collectionName}"
                  SET "reviewedByUserId" = NOW()
                  WHERE "reviewedAt" IS NULL
                  `);
  });
};
