<<<<<<< HEAD
import { registerMigration } from "./migrationUtils";
import { Tags } from "../../lib/collections/tags/collection";
=======
import { registerMigration } from './migrationUtils';
import { Tags } from '../../server/collections/tags/collection';
>>>>>>> base/master

export default registerMigration({
  name: "onlyAdminsCanVoteOnCommunityTopic",
  dateWritten: "2022-07-21",
  idempotent: true,
  action: async () => {
    await Tags.rawUpdateOne({ slug: "community" }, { $set: { canVoteOnRels: ["admins"] } });
  },
});
