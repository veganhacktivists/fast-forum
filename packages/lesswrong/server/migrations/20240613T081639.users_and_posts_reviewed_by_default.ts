import { Posts } from "../../lib/collections/posts";
import { autoreviewerUserIdSetting } from "../../lib/instanceSettings";
import Users from "../../lib/vulcan-users";
import { updateDefaultValue, dropDefaultValue } from "./meta/utils";

export const up = async ({ db }: MigrationContext) => {
  await Promise.all([
    Posts.rawUpdateMany(
      {
        reviewedByUserId: null,
      },
      { $set: { reviewedByUserId: autoreviewerUserIdSetting.get() } },
    ),
    Users.rawUpdateMany(
      {
        reviewedByUserId: null,
      },
      { $set: { reviewedByUserId: autoreviewerUserIdSetting.get() } },
    ),
    Users.rawUpdateMany(
      {
        reviewedAt: null,
      },
      { $set: { reviewedAt: new Date() } },
    ),
  ]);

  await Promise.all([
    updateDefaultValue(db, Posts, "reviewedByUserId"),
    updateDefaultValue(db, Users, "reviewedByUserId"),
    updateDefaultValue(db, Users, "reviewedAt"),
  ]);
};

export const down = async ({ db }: MigrationContext) => {
  await Promise.all([
    dropDefaultValue(db, Posts, "reviewedByUserId"),
    dropDefaultValue(db, Users, "reviewedByUserId"),
    dropDefaultValue(db, Users, "reviewedAt"),
  ]);

  await Promise.all([
    Posts.rawUpdateMany(
      { reviewedByUserId: autoreviewerUserIdSetting.get() },
      {
        $set: {
          reviewedByUserId: null,
        },
      },
    ),
    Users.rawUpdateMany(
      { reviewedByUserId: autoreviewerUserIdSetting.get() },
      {
        $set: {
          reviewedByUserId: null,
          reviewedAt: null,
        },
      },
    ),
  ]);
};
