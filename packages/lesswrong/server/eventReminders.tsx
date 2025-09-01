<<<<<<< HEAD
import React from "react";
import { Components } from "../lib/vulcan-lib/components";
import { testServerSetting } from "../lib/instanceSettings";
import { Posts } from "../lib/collections/posts/collection";
import { postStatuses } from "../lib/collections/posts/constants";
import { Users } from "../lib/collections/users/collection";
import { getUsersToNotifyAboutEvent } from "./notificationCallbacks";
import { addCronJob } from "./cronUtil";
import { updateMutator } from "./vulcan-lib/mutators";
import { wrapAndSendEmail } from "./emails/renderEmail";
import "./emailComponents/EventTomorrowReminder";
import moment from "../lib/moment-timezone";
=======
import React from 'react';
import { testServerSetting } from '../lib/instanceSettings';
import { Posts } from '../server/collections/posts/collection';
import { postStatuses } from '../lib/collections/posts/constants';
import { Users } from '../server/collections/users/collection';
import { getUsersToNotifyAboutEvent } from './notificationCallbacks';
import { addCronJob } from './cron/cronUtil';
import { wrapAndSendEmail } from './emails/renderEmail';
import moment from '../lib/moment-timezone';
import { createAnonymousContext } from "@/server/vulcan-lib/createContexts";
import { updatePost } from './collections/posts/mutations';
import { EventTomorrowReminder } from './emailComponents/EventTomorrowReminder';
import { backgroundTask } from './utils/backgroundTask';
>>>>>>> base/master

async function checkAndSendUpcomingEventEmails() {
  const in24hours = moment(new Date()).add(24, "hours").toDate();

  // Find events that:
  //  * Start in the next 24 hours
  //  * Have not already had reminders sent
  let upcomingEvents = await Posts.find({
    status: postStatuses.STATUS_APPROVED,
    draft: false,
    isFuture: false,
    unlisted: false,
    shortform: false,
    authorIsUnreviewed: false,
    hiddenRelatedQuestion: false,
    startTime: { $gte: new Date(), $lt: in24hours },
    nextDayReminderSent: { $ne: true },
  }).fetch();

  for (let upcomingEvent of upcomingEvents) {
    // Mark it as having had the reminders sent
    // (We do this before the actual sending, rather than after, so that if
    // something goes wrong we can't get into a resend-loop.)
<<<<<<< HEAD
    await updateMutator({
      collection: Posts,
      documentId: upcomingEvent._id,
      set: {
        nextDayReminderSent: true,
      },
      validate: false,
    });

=======
    await updatePost({
      data: { nextDayReminderSent: true },
      selector: { _id: upcomingEvent._id }
    }, createAnonymousContext());
    
>>>>>>> base/master
    // skip to the next event if this one has no RSVPs
    if (!upcomingEvent.rsvps) {
      continue;
    }

    const emailsToNotify = await getUsersToNotifyAboutEvent(upcomingEvent);

    for (let { userId, email, rsvp } of emailsToNotify) {
      if (!email) continue;
      const user = await Users.findOne(userId);

      await wrapAndSendEmail({
        user,
        to: email,
        subject: `Event reminder: ${upcomingEvent.title}`,
<<<<<<< HEAD
        body: <Components.EventTomorrowReminder rsvp={rsvp} postId={upcomingEvent._id} />,
=======
        body: <EventTomorrowReminder rsvp={rsvp} postId={upcomingEvent._id}/>
>>>>>>> base/master
      });
    }
  }
}

<<<<<<< HEAD
if (!testServerSetting.get()) {
  addCronJob({
    name: "Send upcoming-event reminders",
    interval: "every 1 hour",
    job() {
      void checkAndSendUpcomingEventEmails();
    },
  });
}
=======
export const cronCheckAndSendUpcomingEventEmails = addCronJob({
  name: "Send upcoming-event reminders",
  // every minute
  cronStyleSchedule: '* * * * *',
  disabled: testServerSetting.get(),
  job() {
    backgroundTask(checkAndSendUpcomingEventEmails());
  }
});
>>>>>>> base/master
