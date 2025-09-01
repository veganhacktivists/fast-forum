<<<<<<< HEAD
import { registerMigration } from "./migrationUtils";
import { updateMutator } from "../vulcan-lib";

import { Posts } from "../../lib/collections/posts/collection";
import Users from "../../lib/collections/users/collection";

registerMigration({
=======
import { registerMigration } from './migrationUtils';
import Users from '../../server/collections/users/collection';
import { createAnonymousContext } from "@/server/vulcan-lib/createContexts";
import { updatePost } from '../collections/posts/mutations';

export default registerMigration({
>>>>>>> base/master
  name: "setAfShortformValues",
  dateWritten: "2019-10-23",
  idempotent: true,
  action: async () => {
    const afUsers = await Users.find({ groups: "alignmentForum" }).fetch();
    const afUsersWithShortforms = afUsers.filter((user) => !!user.shortformFeedId);
    for (const afUserWithShortforms of afUsersWithShortforms) {
      await updatePost({ data: { af: true }, selector: { _id: afUserWithShortforms.shortformFeedId! } }, createAnonymousContext());
    }
  },
});
