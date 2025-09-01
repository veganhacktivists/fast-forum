import { wrapVulcanAsyncScript } from "./utils";
<<<<<<< HEAD
import { Vulcan } from "../vulcan-lib";
import Users from "../../lib/vulcan-users";
=======
import Users from "../../server/collections/users/collection";
>>>>>>> base/master

/**
 * Fixes users affected by a bug on 2021-10-05 where the NewUserCompleteProfile process was setting their email to null. Fortunately their emails were spared.
 */
<<<<<<< HEAD
Vulcan.fillUserEmail = wrapVulcanAsyncScript("fillUserEmail", async () => {
  const users = await Users.find({
    createdAt: { $gt: new Date("2021-10-04") },
=======
export const fillUserEmail = wrapVulcanAsyncScript('fillUserEmail', async () => {
  const users = await (Users.find({
    createdAt: {$gt: new Date('2021-10-04')},
>>>>>>> base/master
    email: null,
  }).fetch();
  const userSlugs = users.map((user) => user.slug);
  // eslint-disable-next-line no-console
  console.log("userSlugs", userSlugs);
  for (const user of users) {
    if (!user.emails || !user.emails.length) continue;
    await Users.rawUpdateOne({ _id: user._id }, { $set: { email: user.emails[0].address } });
  }
});
