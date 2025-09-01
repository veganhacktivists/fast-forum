<<<<<<< HEAD
import * as _ from "underscore";
import { createNotifications } from "../notificationCallbacksHelpers";
import { notificationDocumentTypes } from "../../lib/notificationTypes";
import { isBeingUndrafted } from "./utils";
import { canMention } from "../../lib/pingback";
=======
import * as _ from 'underscore'
import {createNotifications} from '../notificationCallbacksHelpers'
import {notificationDocumentTypes} from '../../lib/notificationTypes'
import {isBeingUndrafted} from './utils'
import {canMention} from '../../lib/pingback'
import { collectionNameToTypeName } from '@/lib/generated/collectionTypeNames'
>>>>>>> base/master

export interface PingbackDocumentPartial {
  _id: string;
  pingbacks?: {
    Users: string[];
  };
}

<<<<<<< HEAD
export const notifyUsersAboutMentions = async (
  currentUser: DbUser,
  collectionType: string,
  document: PingbackDocumentPartial,
  oldDocument?: PingbackDocumentPartial,
) => {
  const pingbacksToSend = getPingbacksToSend(currentUser, collectionType, document, oldDocument);
=======
export const notifyUsersAboutMentions = async (currentUser: DbUser, collectionName: CollectionNameString, document: PingbackDocumentPartial, oldDocument?: PingbackDocumentPartial) => {
  const pingbacksToSend = getPingbacksToSend(currentUser, collectionName, document, oldDocument)
>>>>>>> base/master

  // Todo(PR): this works, but not sure if it's generally a correct conversion.
  //  TagRels for example won't work, though they don't have content either.
  //  should we define an explicit mapping?
<<<<<<< HEAD
  const notificationType = collectionType.toLowerCase();

  const newDocPingbackCount = getPingbacks(document).length;
  if (!canMention(currentUser, newDocPingbackCount).result || !notificationDocumentTypes.has(notificationType)) return;
=======
  const notificationType = collectionNameToTypeName[collectionName].toLowerCase();

  const newDocPingbackCount = getPingbacks(document).length
  if (!canMention(currentUser, newDocPingbackCount).result || !notificationDocumentTypes.has(notificationType)) {
    return
  }
>>>>>>> base/master

  return createNotifications({
    notificationType: "newMention",
    userIds: pingbacksToSend,
    documentId: document._id,
    documentType: notificationType,
  });
};

const getPingbacks = (document?: PingbackDocumentPartial) => document?.pingbacks?.Users ?? [];

function getPingbacksToSend(
  currentUser: DbUser,
  collectionName: CollectionNameString,
  document: PingbackDocumentPartial,
  oldDocument?: PingbackDocumentPartial,
) {
  const pingbacksFromDocuments = () => {
    const newDocPingbacks = getPingbacks(document);
    const oldDocPingbacks = getPingbacks(oldDocument);
    const newPingbacks = _.difference(newDocPingbacks, oldDocPingbacks);

<<<<<<< HEAD
    if (collectionType !== "Post") return newPingbacks;

    const post = document as DbPost;

    if (post.draft) {
      const pingedUsersWhoHaveAccessToDoc = _.intersection(newPingbacks, post.shareWithUsers);
      return pingedUsersWhoHaveAccessToDoc;
    }

    const oldPost = oldDocument as DbPost | undefined;
    // This currently does not handle multiple moves between draft and published.
    if (oldPost && isBeingUndrafted(oldPost, post)) {
      const alreadyNotifiedUsers = _.intersection(oldDocPingbacks, oldPost.shareWithUsers);

      // newDocPingbacks bc, we assume most users weren't pinged on the draft stage
      return _.difference(newDocPingbacks, alreadyNotifiedUsers);
=======
    if (collectionName !== 'Posts' && collectionName !== 'Comments') {
      return newPingbacks
    }

    const doc = document as DbPost | DbComment
    const oldDoc = oldDocument as DbPost | DbComment | undefined

    if (doc.draft) {
      if (collectionName === 'Posts') {
        const post = doc as DbPost
        const pingedUsersWhoHaveAccessToDoc = _.intersection(newPingbacks, post.shareWithUsers)
        return pingedUsersWhoHaveAccessToDoc
      }
      return []
    }

    // This currently does not handle multiple moves between draft and published.
    if (oldDoc && isBeingUndrafted(oldDoc, doc)) {
      let alreadyNotifiedUsers: string[] = []
      if (collectionName === 'Posts') {
        alreadyNotifiedUsers = _.intersection(oldDocPingbacks, (oldDoc as DbPost).shareWithUsers)
      }

      return _.difference(newDocPingbacks, alreadyNotifiedUsers)
>>>>>>> base/master
    }

    return newPingbacks;
  };

  return removeSelfReference(pingbacksFromDocuments(), currentUser._id);
}

const removeSelfReference = (ids: string[], id: string) => _.without(ids, id);
