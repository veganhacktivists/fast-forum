import { Posts } from "../../server/collections/posts/collection";

<<<<<<< HEAD
const removeRsvp = async (eventId: string, userNameOrId: string) => {
  const event = await Posts.findOne({ _id: eventId });
=======
// Exported to allow running manually with "yarn repl"
export const removeRsvp = async (eventId: string, userNameOrId: string) => {
  const event = await Posts.findOne({_id: eventId});
>>>>>>> base/master
  if (!event) {
    throw new Error("Event does not exist");
  }

  const { rsvps } = event;
  if (!Array.isArray(rsvps)) {
    throw new Error("Event has no RSVPs");
  }

  const newRsvps = rsvps.filter((rsvp) => rsvp.userId !== userNameOrId && rsvp.name !== userNameOrId);
  if (newRsvps.length !== rsvps.length - 1) {
    throw new Error("Error filtering out user id from rsvp list");
  }

<<<<<<< HEAD
  await Posts.rawUpdateOne({ _id: eventId }, { $set: { rsvps: newRsvps } });
};

Globals.removeRsvp = removeRsvp;
=======
  await Posts.rawUpdateOne(
    {_id: eventId},
    {$set: {rsvps: newRsvps}},
  );
}
>>>>>>> base/master
