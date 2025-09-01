/*

Run a GraphQL request from the server with the proper context

*/
<<<<<<< HEAD
import { graphql, GraphQLError } from "graphql";
import { localeSetting } from "../../lib/publicSettings";
import { getExecutableSchema } from "./apollo-server/initGraphQL";
import { generateDataLoaders } from "./apollo-server/context";
import { getAllRepos } from "../repos";
import { getCollectionsByName } from "../../lib/vulcan-lib/getCollection";
=======
import { ExecutionResult, graphql, GraphQLError, print } from 'graphql';
import { createAnonymousContext } from './createContexts';
import { ResultOf, TypedDocumentNode } from '@graphql-typed-document-node/core';
import { getExecutableSchema } from './apollo-server/initGraphQL';
>>>>>>> base/master

function writeGraphQLErrorToStderr(errors: readonly GraphQLError[]) {
  // eslint-disable-next-line no-console
  console.error(`runQuery error: ${errors[0].message}, trace: ${errors[0].stack}`);
  // eslint-disable-next-line no-console
  console.error(JSON.stringify(errors, null, 2));
}

let onGraphQLError = writeGraphQLErrorToStderr;
<<<<<<< HEAD
export function setOnGraphQLError(fn: ((errors: readonly GraphQLError[]) => void) | null) {
  if (fn) onGraphQLError = fn;
  else onGraphQLError = writeGraphQLErrorToStderr;
=======
export function setOnGraphQLError(fn: ((errors: readonly GraphQLError[]) => void)|null)
{
  if (fn)
    onGraphQLError = fn;
  else
    onGraphQLError = writeGraphQLErrorToStderr;
>>>>>>> base/master
}

// note: if no context is passed, default to running requests with full admin privileges
export const runQuery = async <const TDocumentNode extends TypedDocumentNode<any, any>>(query: string | TDocumentNode, variables: any = {}, context?: Partial<ResolverContext>) => {
  const executableSchema = getExecutableSchema();
  const queryContext = createAnonymousContext(context);

  const stringQuery = typeof query === 'string'
    ? query
    : print(query)

  // see http://graphql.org/graphql-js/graphql/#graphql
  const result = await graphql({
    schema: executableSchema,
    source: stringQuery,
    rootValue: {},
    contextValue: queryContext,
    variableValues: variables,
  }) as ExecutionResult<ResultOf<TDocumentNode>>;

  if (result.errors) {
    onGraphQLError(result.errors);
    throw new Error(result.errors[0].message);
  }

  return result;
};
<<<<<<< HEAD

export const createAnonymousContext = (options?: Partial<ResolverContext>): ResolverContext => {
  const queryContext = {
    userId: null,
    clientId: null,
    visitorActivity: null,
    currentUser: null,
    headers: null,
    locale: localeSetting.get(),
    isGreaterWrong: false,
    repos: getAllRepos(),
    ...getCollectionsByName(),
    ...generateDataLoaders(),
    ...options,
  };

  return queryContext;
};
export const createAdminContext = (options?: Partial<ResolverContext>): ResolverContext => {
  return {
    ...createAnonymousContext(),
    // HACK: Instead of a full user object, this is just a mostly-empty object with isAdmin set to true
    currentUser: { isAdmin: true } as DbUser,
    ...options,
  };
};
=======
>>>>>>> base/master
