<<<<<<< HEAD
/*

Mutations have five steps:

1. Validation

If the mutator call is not trusted (for example, it comes from a GraphQL mutation),
we'll run all validate steps:

- Check that the current user has permission to insert/edit each field.
- Add userId to document (insert only).
- Run validation callbacks.

2. Before Callbacks

The second step is to run the mutation argument through all the [before] callbacks.

3. Operation

We then perform the insert/update/remove operation.

4. After Callbacks

We then run the mutation argument through all the [after] callbacks.

5. Async Callbacks

Finally, *after* the operation is performed, we execute any async callbacks.

*/

import { Utils } from "../../lib/vulcan-lib/utils";
import { validateDocument, validateData, dataToModifier, modifierToData } from "./validation";
import { getSchema } from "../../lib/utils/getSchema";
import { throwError } from "./errors";
import { Connectors } from "./connectors";
import {
  getCollectionHooks,
  CollectionMutationCallbacks,
  CreateCallbackProperties,
  UpdateCallbackProperties,
  DeleteCallbackProperties,
} from "../mutationCallbacks";
import { logFieldChanges } from "../fieldChanges";
import { createAnonymousContext } from "./query";
import clone from "lodash/clone";
import isEmpty from "lodash/isEmpty";
import { createError } from "apollo-errors";
import pickBy from "lodash/pickBy";
import { loggerConstructor } from "../../lib/utils/logging";

const mutatorParamsToCallbackProps = <N extends CollectionNameString>(
  createMutatorParams: CreateMutatorParams<N>,
): CreateCallbackProperties<N> => {
  const { currentUser = null, collection, context = createAnonymousContext(), document } = createMutatorParams;

  const schema = getSchema(collection);

  return {
    currentUser,
    collection,
    context,
    document: document as ObjectsByCollectionName[N], // Pretend this isn't Partial
    newDocument: document as ObjectsByCollectionName[N], // Pretend this isn't Partial
    schema,
  };
};
=======
import { convertDocumentIdToIdInSelector, UpdateSelector } from '../../lib/vulcan-lib/utils';
import { dataToModifier } from './validation';
import { throwError } from './errors';
import type { CreateCallbackProperties, UpdateCallbackProperties, AfterCreateCallbackProperties } from '../mutationCallbacks';
import isEmpty from 'lodash/isEmpty';
import pickBy from 'lodash/pickBy';
import clone from 'lodash/clone';
>>>>>>> base/master

/**
 * @deprecated Prefer to avoid using onCreate callbacks on fields for new collections.
 * 
 * If possible, either give the field a default value in the database, or assign a value
 * to it inside of its create mutation directly.
 */
<<<<<<< HEAD
export const validateCreateMutation = async <N extends CollectionNameString>(mutatorParams: CreateMutatorParams<N>) => {
  let { document } = mutatorParams;
  const callbackProperties = mutatorParamsToCallbackProps(mutatorParams);
  const { collection, context, currentUser } = callbackProperties;

  const hooks = getCollectionHooks(collection.collectionName);

  let validationErrors: Array<any> = [];
  validationErrors = validationErrors.concat(validateDocument(document, collection, context));
  // run validation callbacks
  validationErrors = await hooks.createValidate.runCallbacks({
    iterator: validationErrors,
    properties: [callbackProperties],
    ignoreExceptions: false,
  });
  // OpenCRUD backwards compatibility
  document = await hooks.newValidate.runCallbacks({
    iterator: document as DbInsertion<ObjectsByCollectionName[N]>, // Pretend this isn't Partial
    properties: [currentUser, validationErrors],
    ignoreExceptions: false,
  });
  if (validationErrors.length) {
    console.log(validationErrors); // eslint-disable-line no-console
    throwError({ id: "app.validation_error", data: { break: true, errors: validationErrors } });
  }

  return document;
};

/**
 * Create mutation
 * Inserts an entry in a collection, and runs a bunch of callback functions to
 * fill in its denormalized fields etc. Input is a Partial<T>, because some
 * fields will be filled in by those callbacks; result is a T, but nothing
 * in the type system ensures that everything actually gets filled in.
 */
export const createMutator: CreateMutator = async <N extends CollectionNameString>(
  createMutatorParams: CreateMutatorParams<N>,
) => {
  let { collection, document, currentUser = null, validate = true, context } = createMutatorParams;
  const logger = loggerConstructor(`mutators-${collection.collectionName.toLowerCase()}`);
  logger("createMutator() begin");
  logger("(new) document", document);
  // If no context is provided, create a new one (so that callbacks will have
  // access to loaders)
  if (!context) context = createAnonymousContext();

  const { collectionName } = collection;
  const schema = getSchema(collection);

  const hooks = getCollectionHooks(collectionName);

  /*

  Properties

  Note: keep newDocument for backwards compatibility

  */
  const properties = mutatorParamsToCallbackProps(createMutatorParams);

  /*

  Validation

  */
  if (validate) {
    document = await validateCreateMutation(createMutatorParams);
  } else {
    logger("skipping validation");
  }

  // userId
  //
  // If user is logged in, check if userId field is in the schema and add it to
  // document if needed.
  // FIXME: This is a horrible hack; there's no good reason for this not to be
  // using the same callbacks as everything else.
  if (currentUser) {
    const userIdInSchema = Object.keys(schema).find((key) => key === "userId");
    if (!!userIdInSchema && !(document as any).userId) {
      (document as any).userId = currentUser._id;
    }
  }

  /*

  onCreate

  note: cannot use forEach with async/await.
  See https://stackoverflow.com/a/37576787/649299

  note: clone arguments in case callbacks modify them

  */
  logger("field onCreate/onInsert callbacks");
  const start = Date.now();
  for (let fieldName of Object.keys(schema)) {
    let autoValue;
    const schemaField = schema[fieldName];
    if (schemaField.onCreate) {
      // OpenCRUD backwards compatibility: keep both newDocument and data for now, but phase out newDocument eventually
      // eslint-disable-next-line no-await-in-loop
      autoValue = await schemaField.onCreate({ ...properties, fieldName } as any); // eslint-disable-line no-await-in-loop
    } else if (schemaField.onInsert) {
      // OpenCRUD backwards compatibility
      autoValue = await schemaField.onInsert(clone(document) as any, currentUser); // eslint-disable-line no-await-in-loop
    }
    if (typeof autoValue !== "undefined") {
      logger(`onCreate returned a value to insert for field ${fieldName}: ${autoValue}`);
      Object.assign(document, { [fieldName]: autoValue });
=======
export async function runFieldOnCreateCallbacks<
  S extends SchemaType<CollectionName>,
  CollectionName extends CollectionNameString,
  D extends {} = CreateInputsByCollectionName[CollectionName]['data']
>(schema: S, data: D, properties: CreateCallbackProperties<CollectionName, D>): Promise<D> {
  for (let fieldName in schema) {
    let autoValue;
    const { graphql } = schema[fieldName];
    if (graphql && 'onCreate' in graphql && !!graphql.onCreate) {
      autoValue = await graphql.onCreate({ ...properties, fieldName });
    }
    if (typeof autoValue !== 'undefined') {
      Object.assign(data, { [fieldName]: autoValue });
>>>>>>> base/master
    }
  }

<<<<<<< HEAD
  // TODO: find that info in GraphQL mutations
  // if (isServer && this.connection) {
  //   post.userIP = this.connection.clientAddress;
  //   post.userAgent = this.connection.httpHeaders['user-agent'];
  // }

  /*

  Before

  */
  logger("before callbacks");
  logger("createBefore");
  document = (await hooks.createBefore.runCallbacks({
    iterator: document as ObjectsByCollectionName[N], // Pretend this isn't Partial
    properties: [properties],
  })) as Partial<DbInsertion<ObjectsByCollectionName[N]>>;
  logger("newBefore");
  // OpenCRUD backwards compatibility
  document = (await hooks.newBefore.runCallbacks({
    iterator: document as ObjectsByCollectionName[N], // Pretend this isn't Partial
    properties: [currentUser],
  })) as Partial<DbInsertion<ObjectsByCollectionName[N]>>;
  logger("newSync");
  document = (await hooks.newSync.runCallbacks({
    iterator: document as ObjectsByCollectionName[N], // Pretend this isn't Partial
    properties: [currentUser],
  })) as Partial<DbInsertion<ObjectsByCollectionName[N]>>;

  /*

  DB Operation

  */
  logger("inserting into database");
  (document as any)._id = await Connectors.create(collection, document as ObjectsByCollectionName[N]);

  /*

  After

  */
  // run any post-operation sync callbacks
  logger("after callbacks");
  logger("createAfter");
  document = (await hooks.createAfter.runCallbacks({
    iterator: document as ObjectsByCollectionName[N], // Pretend this isn't Partial
    properties: [properties],
  })) as Partial<DbInsertion<ObjectsByCollectionName[N]>>;
  logger("newAfter");
  // OpenCRUD backwards compatibility
  document = (await hooks.newAfter.runCallbacks({
    iterator: document as ObjectsByCollectionName[N], // Pretend this isn't Partial
    properties: [currentUser],
  })) as Partial<DbInsertion<ObjectsByCollectionName[N]>>;

  // note: query for document to get fresh document with collection-hooks effects applied
  let completedDocument = document as ObjectsByCollectionName[N];
  const queryResult = await Connectors.get(collection, document._id);
  if (queryResult) completedDocument = queryResult;

  /*

  Async

  */
  // note: make sure properties.document is up to date
  logger("async callbacks");
  logger("createAsync");
  await hooks.createAsync.runCallbacksAsync([{ ...properties, document: completedDocument }]);
  logger("newAsync");
  // OpenCRUD backwards compatibility
  await hooks.newAsync.runCallbacksAsync([completedDocument, currentUser, collection]);

  return { data: completedDocument };
};
=======
  return data;
}
>>>>>>> base/master

/**
 * @deprecated Prefer to avoid using onUpdate callbacks on fields for new collections.
 * 
 * If possible, perform any necessary updates to that field's value directly in the update mutation.
 */
<<<<<<< HEAD
export const updateMutator: UpdateMutator = async <N extends CollectionNameString>({
  collection,
  documentId,
  selector,
  data: dataParam,
  set = {},
  unset = {},
  currentUser = null,
  validate = true,
  context,
  document: oldDocument,
}: UpdateMutatorParams<N>) => {
  const { collectionName } = collection;
  const schema = getSchema(collection);
  const logger = loggerConstructor(`mutators-${collectionName.toLowerCase()}`);
  logger("updateMutator() begin");

  // If no context is provided, create a new one (so that callbacks will have
  // access to loaders)
  if (!context) context = createAnonymousContext();

  // OpenCRUD backwards compatibility
  selector = selector || { _id: documentId };
  let data = dataParam || modifierToData({ $set: set, $unset: unset });
  logger("update data", data);

  // Save the original mutation (before callbacks add more changes to it) for
  // logging in LWEvents
  let origData = { ...data };
=======
export async function runFieldOnUpdateCallbacks<
  S extends SchemaType<CollectionName>,
  CollectionName extends CollectionNameString,
  D extends {} = UpdateInputsByCollectionName[CollectionName]['data']
>(
  schema: S,
  data: D,
  properties: UpdateCallbackProperties<CollectionName, D>
): Promise<D> {
  const dataAsModifier = dataToModifier(clone(data));
  for (let fieldName in schema) {
    let autoValue;
    const { graphql } = schema[fieldName];
    if (graphql && 'onUpdate' in graphql && !!graphql.onUpdate) {
      autoValue = await graphql.onUpdate({ ...properties, fieldName, modifier: dataAsModifier });
    }
    if (typeof autoValue !== 'undefined') {
      Object.assign(data, { [fieldName]: autoValue });
    }
  }

  return data;
}

interface CheckCreatePermissionsAndReturnArgumentsProps<N extends CollectionNameString, S extends SchemaType<N>, D = CreateInputsByCollectionName[N]['data']> {
  context: ResolverContext;
  data: D;
  schema: S,
}
>>>>>>> base/master

interface CheckUpdatePermissionsAndReturnArgumentsProps<N extends CollectionNameString, S extends SchemaType<N>, D = UpdateInputsByCollectionName[N]['data']> {
  selector: SelectorInput;
  context: ResolverContext;
  data: D;
  schema: S,
}

/**
 * @deprecated This function returns createCallbackProperties, which
 * is a legacy holdover from mutation callbacks.  If you're creating
 * a new collection with default mutations, just pass in whatever
 * arguments you need to functions you have before/after the db update.
 */
export async function getLegacyCreateCallbackProps<const T extends CollectionNameString, S extends SchemaType<T>, D extends {} = CreateInputsByCollectionName[T]['data']>(
  collectionName: T,
  { context, data, schema }: CheckCreatePermissionsAndReturnArgumentsProps<T, S, D>
) {
  const { currentUser } = context;
  const collection = context[collectionName] as CollectionBase<T>;

  const callbackProps: CreateCallbackProperties<T, D> = {
    collection,
    document: data,
    newDocument: data,
    currentUser,
    context,
    schema,
  };

  return callbackProps;
}

export function getPreviewDocument<N extends CollectionNameString, D extends {} = UpdateInputsByCollectionName[N]['data']>(data: D, oldDocument: ObjectsByCollectionName[N]): ObjectsByCollectionName[N] {
  return pickBy({
    ...oldDocument,
    ...data,
  }, (value) => value !== null) as unknown as ObjectsByCollectionName[N];
}

export async function getOldDocument<N extends CollectionNameString>(collectionName: N, selector: SelectorInput, context: ResolverContext) {
  const { loaders } = context;
  if (isEmpty(selector)) {
    throw new Error("Selector cannot be empty");
  }

  const documentSelector = convertDocumentIdToIdInSelector(selector as UpdateSelector);
  const oldDocument = await loaders[collectionName].load(documentSelector._id);

  if (!oldDocument) {
    throwError({ id: 'app.document_not_found', data: { documentId: documentSelector._id } });
  }

<<<<<<< HEAD
  // get a "preview" of the new document
  let document: ObjectsByCollectionName[N] = { ...oldDocument, ...data };
  // FIXME: Filtering out null-valued fields here is a very sketchy, probably
  // wrong thing to do. This originates from Vulcan, and it's not clear why it's
  // doing it. Explicit cast to make it type-check anyways.
  document = pickBy(document, (f) => f !== null) as any;
=======
  return oldDocument;
}
>>>>>>> base/master

/**
 * @deprecated This function returns updateCallbackProperties, which
 * is a legacy holdover from mutation callbacks.  If you're creating
 * a new collection with default mutations, just pass in whatever
 * arguments you need to functions you have before/after the db update.
 * 
 * If you're creating a new collection, just use getOldDocument and getPreviewDocument
 * directly and don't write logic which depends on `UpdateCallbackProperties`.
 */
export async function getLegacyUpdateCallbackProps<const T extends CollectionNameString, S extends SchemaType<T>, D extends {} = UpdateInputsByCollectionName[T]['data']>(
  collectionName: T,
  { selector, context, data, schema }: CheckUpdatePermissionsAndReturnArgumentsProps<T, S, D>
) {
  const { currentUser } = context;
  const collection = context[collectionName] as CollectionBase<T>;
  const documentSelector = convertDocumentIdToIdInSelector(selector as UpdateSelector);
  const oldDocument = await getOldDocument(collectionName, selector, context);

  const previewDocument = getPreviewDocument(data, oldDocument);

<<<<<<< HEAD
  */
  const properties: UpdateCallbackProperties<N> = {
    data: data || {},
    oldDocument,
    document,
    newDocument: document,
    currentUser,
    collection,
    context,
    schema,
=======
  const updateCallbackProperties: UpdateCallbackProperties<T> = {
    data,
    oldDocument,
    newDocument: previewDocument,
    currentUser,
    collection,
    context,
    schema
>>>>>>> base/master
  };

  return {
    documentSelector,
    previewDocument,
    updateCallbackProperties,
  };
}

<<<<<<< HEAD
  Validation

  */
  if (validate) {
    logger("validating");
    let validationErrors: any = [];

    validationErrors = validationErrors.concat(validateData(data, document, collection, context));

    validationErrors = await hooks.updateValidate.runCallbacks({
      iterator: validationErrors,
      properties: [properties],
      ignoreExceptions: false,
    });
    // OpenCRUD backwards compatibility
    data = modifierToData(
      await hooks.editValidate.runCallbacks({
        iterator: dataToModifier(data),
        properties: [document, currentUser, validationErrors],
        ignoreExceptions: false,
      }),
    );

    // LESSWRONG - added custom message (showing all validation errors instead of a generic message)
    if (validationErrors.length) {
      // eslint-disable-next-line no-console
      console.log("// validationErrors:", validationErrors);
      const EditDocumentValidationError = createError("app.validation_error", {
        message: JSON.stringify(validationErrors),
      });
      throw new EditDocumentValidationError({ data: { break: true, errors: validationErrors } });
    }
  } else {
    logger("skipping validation");
=======
/**
 * If you're writing a CRUD create mutation for a collection which has a userId field,
 * you might want to use this function to assign the current user's userId to the document,
 * if the userId in fact represents "ownership" or similar.
 */
export function assignUserIdToData(data: unknown, currentUser: DbUser | null, schema: SchemaType<CollectionNameString> & { userId: CollectionFieldSpecification<CollectionNameString> }) {
  // You know, it occurs to me that this seems to allow users to insert arbitrary userIds
  // for documents they're creating if they have a userId field and canCreate: member.
  if (currentUser && schema.userId && !(data as HasUserIdType).userId) {
    (data as unknown as HasUserIdType).userId = currentUser._id;
>>>>>>> base/master
  }
}

export async function insertAndReturnDocument<N extends CollectionNameString, T extends CreateInputsByCollectionName[N]['data'] | Partial<ObjectsByCollectionName[N]>>(data: T, collectionName: N, context: ResolverContext) {
  const collection = context[collectionName] as CollectionBase<N>;
  const insertedId = await collection.rawInsert(data);
  const insertedDocument = (await collection.findOne(insertedId))!;
  return insertedDocument;
}

/**
 * @deprecated This function returns AfterCreateCallbackProperties, which
 * is a legacy holdover from mutation callbacks.  If you're creating
 * a new collection with CRUD mutations, just insert the document directly
 * into the database and fetch it again if you need it with its default values,
 * and don't write functions which depend on `AfterCreateCallbackProperties`.
 * 
 * Instead, use insertAndReturnDocument.
 */
export async function insertAndReturnCreateAfterProps<N extends CollectionNameString, T extends CreateInputsByCollectionName[N]['data'] | Partial<ObjectsByCollectionName[N]>>(data: T, collectionName: N, createCallbackProperties: CreateCallbackProperties<N, T>) {
  const insertedDocument = await insertAndReturnDocument(data, collectionName, createCallbackProperties.context);

<<<<<<< HEAD
  */
  logger("field onUpdate/onEdit callbacks");
  for (let fieldName of Object.keys(schema)) {
    let autoValue;
    const schemaField = schema[fieldName];
    if (schemaField.onUpdate) {
      autoValue = await schemaField.onUpdate({ ...properties, fieldName });
    } else if (schemaField.onEdit) {
      // OpenCRUD backwards compatibility
      autoValue = await schemaField.onEdit(dataToModifier(clone(data)), oldDocument, currentUser, document);
    }
    if (typeof autoValue !== "undefined") {
      logger(`onUpdate returned a value to update for ${fieldName}: ${autoValue}`);
      data![fieldName] = autoValue;
    }
  }
=======
  const afterCreateProperties: AfterCreateCallbackProperties<N> = {
    ...createCallbackProperties,
    document: insertedDocument,
    newDocument: insertedDocument
  };
>>>>>>> base/master

  return afterCreateProperties;
}

<<<<<<< HEAD
  Before

  */
  logger("before callbacks");
  logger("updateBefore");
  data = await hooks.updateBefore.runCallbacks({
    iterator: data,
    properties: [properties],
  });
  logger("editBefore");
  // OpenCRUD backwards compatibility
  data = modifierToData(
    await hooks.editBefore.runCallbacks({
      iterator: dataToModifier(data),
      properties: [oldDocument, currentUser, document],
    }),
  );
  logger("editSync");
  data = modifierToData(
    await hooks.editSync.runCallbacks({
      iterator: dataToModifier(data),
      properties: [oldDocument, currentUser, document],
    }),
  );

  // update connector requires a modifier, so get it from data
=======
/**
 * Unlike the other helper functions, this one is not deprecated.
 * 
 * If you're writing a CRUD update mutation, you should use this
 * to avoid forgetting some important boilerplate (like clearing the
 * document from the loader cache).
 */
export async function updateAndReturnDocument<N extends CollectionNameString>(
  data: UpdateInputsByCollectionName[N]['data'] | Partial<ObjectsByCollectionName[N]>,
  collection: CollectionBase<N>,
  selector: { _id: string },
  context: ResolverContext
): Promise<ObjectsByCollectionName[N]> {
>>>>>>> base/master
  const modifier = dataToModifier(data);

  // remove empty modifiers
  if (isEmpty(modifier.$set)) {
    delete modifier.$set;
  }
  if (isEmpty(modifier.$unset)) {
    delete modifier.$unset;
  }

<<<<<<< HEAD
  /*

  DB Operation

  */
  if (!isEmpty(modifier)) {
    // update document
    logger("updating document");
    await Connectors.updateOne(collection, selector, modifier, { removeEmptyStrings: false });

    // get fresh copy of document from db
    const fetched = await Connectors.get(collection, selector);
    if (!fetched) throw new Error("Could not find updated document after applying update");
    document = fetched;

    // TODO: add support for caching by other indexes to Dataloader
    // https://github.com/VulcanJS/Vulcan/issues/2000
    // clear cache if needed
    if (selector.documentId && context) {
      context.loaders[collectionName].clear(selector.documentId);
    }
=======
  // if there's nothing to update, return the original document
  if (isEmpty(modifier)) {
    return (await collection.findOne(selector))!;
>>>>>>> base/master
  }

  // update document
  await collection.rawUpdateOne(selector, modifier);

<<<<<<< HEAD
  After

  */
  logger("after callbacks");
  logger("updateAfter");
  document = await hooks.updateAfter.runCallbacks({
    iterator: document,
    properties: [properties],
  });
  logger("editAfter");
  // OpenCRUD backwards compatibility
  document = await hooks.editAfter.runCallbacks({
    iterator: document,
    properties: [oldDocument, currentUser],
  });

  /*

  Async

  */
  // run async callbacks
  logger("async callbacks");
  logger("updateAsync");
  await hooks.updateAsync.runCallbacksAsync([properties]);
  // OpenCRUD backwards compatibility
  logger("editAsync");
  await hooks.editAsync.runCallbacksAsync([document, oldDocument, currentUser, collection]);

  void logFieldChanges({ currentUser, collection, oldDocument, data: origData });

  return { data: document };
};

//
// Delete mutation
// Deletes a single database entry, and runs any callbacks/etc that trigger on
// that. Returns the entry that was deleted.
//
export const deleteMutator: DeleteMutator = async <N extends CollectionNameString>({
  collection,
  documentId,
  selector,
  currentUser = null,
  validate = true,
  context,
  document,
}: DeleteMutatorParams<N>) => {
  const { collectionName } = collection;
  const schema = getSchema(collection);
  // OpenCRUD backwards compatibility
  selector = selector || { _id: documentId };

  const hooks = getCollectionHooks(collectionName);

  // If no context is provided, create a new one (so that callbacks will have
  // access to loaders)
  if (!context) context = createAnonymousContext();

  if (isEmpty(selector)) {
    throw new Error("Selector cannot be empty");
=======
  // get fresh copy of document from db
  const updatedDocument = await collection.findOne(selector);
  if (!updatedDocument) {
    throw new Error("Could not find updated document after applying update");
>>>>>>> base/master
  }

  // This used to be documentId, but I think the fact that it was documentId
  // and not _id was just a bug???
  if (selector._id && context) {
    context.loaders[collection.collectionName].clear(selector._id);
  }

<<<<<<< HEAD
  /*

  Properties

  */
  const properties: DeleteCallbackProperties<N> = { document, currentUser, collection, context, schema };

  /*

  Validation

  */
  if (validate) {
    let validationErrors: any = [];

    validationErrors = await hooks.deleteValidate.runCallbacks({
      iterator: validationErrors,
      properties: [properties],
      ignoreExceptions: false,
    });
    // OpenCRUD backwards compatibility
    document = await hooks.removeValidate.runCallbacks({
      iterator: document,
      properties: [currentUser],
      ignoreExceptions: false,
    });

    if (validationErrors.length) {
      console.log(validationErrors); // eslint-disable-line no-console
      throwError({ id: "app.validation_error", data: { break: true, errors: validationErrors } });
    }
  }

  /*

  onDelete

  */
  for (let fieldName of Object.keys(schema)) {
    const onDelete = schema[fieldName].onDelete;
    if (onDelete) {
      await onDelete(properties); // eslint-disable-line no-await-in-loop
    }
  }

  /*

  Before

  */
  await hooks.deleteBefore.runCallbacks({
    iterator: document,
    properties: [properties],
  });
  // OpenCRUD backwards compatibility
  await hooks.removeBefore.runCallbacks({
    iterator: document,
    properties: [currentUser],
  });
  await hooks.removeSync.runCallbacks({
    iterator: document,
    properties: [currentUser],
  });

  /*

  DB Operation

  */
  await Connectors.delete(collection, selector);

  // TODO: add support for caching by other indexes to Dataloader
  // clear cache if needed
  if (selector.documentId && context) {
    context.loaders[collectionName].clear(selector.documentId);
  }

  /*

  Async

  */
  await hooks.deleteAsync.runCallbacksAsync([properties]);
  // OpenCRUD backwards compatibility
  await hooks.removeAsync.runCallbacksAsync([document, currentUser, collection]);

  return { data: document };
};

Utils.createMutator = createMutator;
Utils.updateMutator = updateMutator;
Utils.deleteMutator = deleteMutator;
=======
  return updatedDocument;
}
>>>>>>> base/master
