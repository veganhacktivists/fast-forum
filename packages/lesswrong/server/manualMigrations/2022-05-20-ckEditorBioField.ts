<<<<<<< HEAD
import { registerMigration, forEachDocumentInCollection } from "./migrationUtils";
import { Users } from "../../lib/collections/users/collection";
=======
import { registerMigration, forEachDocumentInCollection } from './migrationUtils';
import { Users } from '../../server/collections/users/collection';
>>>>>>> base/master

export default registerMigration({
  name: "ckEditorBioField",
  dateWritten: "2022-05-20",
  idempotent: true,
  action: async () => {
    await forEachDocumentInCollection({
      collection: Users,
      callback: async (user: DbUser) => {
<<<<<<< HEAD
        type LegacyUserType = DbUser & { bio?: string; htmlBio?: string };
=======
        type LegacyUserType = DbUser&{bio?: string, htmlBio?: string};
>>>>>>> base/master
        const legacyUser: LegacyUserType = user as LegacyUserType;
        if (legacyUser.bio && !legacyUser.biography) {
          await Users.rawUpdateOne(
            { _id: legacyUser._id },
            {
              $set: {
                biography: {
                  originalContents: {
                    type: "ckEditorMarkup",
                    data: legacyUser.htmlBio,
                  },
                  html: legacyUser.htmlBio,
                },
              },
            },
          );
        }
      },
    });
  },
});
