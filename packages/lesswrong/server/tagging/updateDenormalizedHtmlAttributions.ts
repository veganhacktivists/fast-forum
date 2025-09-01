<<<<<<< HEAD
import { Tags } from "../../lib/collections/tags/collection";
import { annotateAuthors } from "../attributeEdits";

export async function updateDenormalizedHtmlAttributions(tag: DbTag) {
  const html = await annotateAuthors(tag._id, "Tags", "description");
  await Tags.rawUpdateOne(
    { _id: tag._id },
    {
      $set: {
        htmlWithContributorAnnotations: html,
      },
    },
  );
=======
import { annotateAuthors } from '../attributeEdits';

export type UpdateDenormalizedHtmlAttributionsOptions = ({
  document: DbTag;
  collectionName: 'Tags';
  fieldName: 'description';
} | {
  document: DbMultiDocument;
  collectionName: 'MultiDocuments';
  fieldName: 'contents';
}) & {
  context: ResolverContext;
}

export async function updateDenormalizedHtmlAttributions(
  updateOptions: UpdateDenormalizedHtmlAttributionsOptions
) {
  const { document, collectionName, fieldName, context } = updateOptions;
  const html = await annotateAuthors(document._id, collectionName, fieldName, context);
  const collection = context[collectionName];
  await collection.rawUpdateOne({ _id: document._id }, { $set: {
    htmlWithContributorAnnotations: html,
  }});
>>>>>>> base/master
  return html;
}
