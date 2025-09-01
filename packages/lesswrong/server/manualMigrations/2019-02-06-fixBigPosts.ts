<<<<<<< HEAD
import { registerMigration, migrateDocuments } from "./migrationUtils";
import { draftJSToHtmlWithLatex, markdownToHtml } from "../editor/conversionUtils";
import { Posts } from "../../lib/collections/posts";
import { updateMutator } from "../vulcan-lib";
=======
import { registerMigration, migrateDocuments } from './migrationUtils';
import { draftJSToHtmlWithLatex, markdownToHtml} from '../editor/conversionUtils'
import { Posts } from '../../server/collections/posts/collection'
import { createAnonymousContext } from "@/server/vulcan-lib/createContexts";
import { updatePost } from '../collections/posts/mutations';
>>>>>>> base/master

export default registerMigration({
  name: "fixBigPosts",
  dateWritten: "2019-02-06",
  idempotent: true,
  action: async () => {
    await migrateDocuments({
      description: `Fix the posts that are really big`,
      collection: Posts,
      batchSize: 1000,
      unmigratedDocumentQuery: {
        $where: "(this.htmlBody && this.htmlBody.length) > 3000000",
      },
      migrate: async (documents: Array<any>) => {
        for (const doc of documents) {
          const { body, content, htmlBody } = doc;
          let newHtml;
          if (content) {
            newHtml = await draftJSToHtmlWithLatex(content);
          } else if (body) {
            newHtml = await markdownToHtml(body);
          } else {
            newHtml = htmlBody;
          }
<<<<<<< HEAD

          await updateMutator({
            collection: Posts,
            documentId: doc._id,
            set: {
              htmlBody: newHtml,
            } as any, // Suppress type error because old migration uses an old schema
            validate: false,
          });
=======
          
          await updatePost({
            // I don't think htmlBody exists on posts anymore, if it ever did.
            data: { htmlBody: newHtml } as UpdatePostDataInput,
            selector: { _id: doc._id }
          }, createAnonymousContext());
>>>>>>> base/master
        }
      },
    });
  },
});
