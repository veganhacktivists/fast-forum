<<<<<<< HEAD
import sanitizeHtml from "sanitize-html";
import { Utils } from "../../lib/vulcan-lib/utils";
import { throwError } from "./errors";

Utils.performCheck = async <T extends DbObject>(
  operation: (user: DbUser | null, obj: T, context: any) => Promise<boolean>,
  user: DbUser | null,
  checkedObject: T,

=======
import { throwError } from './errors';

export const performCheck = async <T extends DbObject, O extends Partial<T> | Partial<DbInsertion<T>>>(
  operation: <I extends O>(user: DbUser|null, obj: I, context: any) => Promise<boolean>,
  user: DbUser|null,
  checkedObject: O,
  
>>>>>>> base/master
  context: ResolverContext,
  documentId: string,
  operationName: string,
  collectionName: CollectionNameString,
): Promise<void> => {
  if (!checkedObject) {
    throwError({ id: "app.document_not_found", data: { documentId, operationName } });
  }

  if (!(await operation(user, checkedObject, context))) {
    throwError({ id: "app.operation_not_allowed", data: { documentId, operationName } });
  }
};

