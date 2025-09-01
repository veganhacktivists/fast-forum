import { DocumentNode } from "graphql";
import { accessFilterMultiple } from "../../lib/utils/schemaUtils";
<<<<<<< HEAD
import { addGraphQLQuery, addGraphQLResolvers, addGraphQLSchema, getCollectionByTypeName } from "../vulcan-lib";
=======
import { getCollectionByTypeName } from "../collections/allCollections";
import gql from "graphql-tag";
>>>>>>> base/master

/**
 * Checks if a graphql type passed in as a string literal is one of those that corresponds a collection's DbObject type
 * If so, return the corresponding DbObject type.  If not, return the manually specified type.
 */
type MaybeCollectionType<GraphQLType extends string, Fallback> = GraphQLType extends keyof ObjectsByTypeName
  ? ObjectsByTypeName[GraphQLType]
  : Fallback;


type QueryType = (
  _: void,
  args: Record<string, unknown> & {limit: number},
  context: ResolverContext,
) => Promise<{results: MaybeCollectionType<string, unknown>[]}>

/**
 * Create a paginated resolver for use on the frontend with `usePaginatedResolver`.
 * This enables having custom SQL queries with a `useMulti`-like interface.
 */
export const createPaginatedResolver = <
  FallbackReturnType,
  GraphQLType extends string,
  ReturnType extends MaybeCollectionType<GraphQLType, FallbackReturnType>,
<<<<<<< HEAD
=======
  Args extends Record<string, unknown>
>>>>>>> base/master
>({
  name,
  graphQLType,
  args,
  callback,
  cacheMaxAgeMs = 0,
}: {
  /**
   * The name of the resolver - this should match `resolverName` in the call to
   * `usePaginatedResolver`
   */
  name: string;
  /**
   * The GraphQL type of the result (eg; "Comment"). Note that the result should
   * be an _array_ of this type.
   */
  graphQLType: GraphQLType;
  /**
   * Custom arguments, as a map from the argument names to the graphql types.
   */
  args?: Record<keyof Args, string>,
  /**
   * The callback to fetch results, which will generally call into a repo (all
   * repos are available in `context.repos`).
   */
<<<<<<< HEAD
  callback: (context: ResolverContext, limit: number) => Promise<ReturnType[]>;
=======
  callback: (
    context: ResolverContext,
    limit: number,
    args?: Args,
  ) => Promise<ReturnType[]>,
>>>>>>> base/master
  /**
   * Optional cache TTL in milliseconds - if undefined or 0 no cache is used.
   * Note that the cache is _global_ and not per-user.
   */
<<<<<<< HEAD
  cacheMaxAgeMs?: number;
}) => {
=======
  cacheMaxAgeMs?: number,
}): {Query: {[name: string]: QueryType}, typeDefs: DocumentNode} => {
>>>>>>> base/master
  let cachedAt = Date.now();
  let cached: ReturnType[] = [];

  // Try to get the collection for later permission checking if we're passed in a GraphQL type which would allow that
  let collection: CollectionBase<CollectionNameString> | undefined;
  try {
    collection = getCollectionByTypeName(graphQLType);
  } catch (err) {
    // Nothing to do anything in this case
    // We can't yet distinguish between getting passed a GraphQL type which is real but not a collection-derived type, and one that isn't real
  }

  const allArgs = {...args, limit: "Int"};
  const argString = Object
    .keys(allArgs)
    .map((arg) => `${arg}: ${allArgs[arg as keyof typeof allArgs]}`)
    .join(", ");

  return {
    Query: {
      [name]: async (
        _: void,
<<<<<<< HEAD
        { limit }: { limit: number },
=======
        args: Args & {limit: number},
>>>>>>> base/master
        context: ResolverContext,
      ): Promise<{ results: ReturnType[] }> => {
        const accessFilterFunction = collection
<<<<<<< HEAD
          ? (records: (ReturnType & DbObject)[]) =>
              accessFilterMultiple(context.currentUser, collection!, records as AnyBecauseHard[], context)
          : undefined;

        if (cacheMaxAgeMs > 0 && Date.now() - cachedAt < cacheMaxAgeMs && cached.length >= limit) {
          const filteredResults = (await accessFilterFunction?.(cached as (ReturnType & DbObject)[])) ?? cached;
          return { results: filteredResults.slice(0, limit) as ReturnType[] };
=======
          ? (records: (ReturnType & DbObject)[]) => accessFilterMultiple(context.currentUser, collection!.collectionName, records as AnyBecauseHard[], context)
          : undefined;

        const limit = args.limit;
        if (
          cacheMaxAgeMs > 0 &&
          Date.now() - cachedAt < cacheMaxAgeMs &&
          cached.length >= limit
        ) {
          const filteredResults = await accessFilterFunction?.(cached as (ReturnType & DbObject)[]) ?? cached;
          return {results: filteredResults.slice(0, limit) as ReturnType[]};
>>>>>>> base/master
        }
        const results = await callback(context, limit, args);
        cachedAt = Date.now();
<<<<<<< HEAD
        cached = results;
        const filteredResults = (await accessFilterFunction?.(results as (ReturnType & DbObject)[])) ?? results;
        return { results: filteredResults as ReturnType[] };
=======
        if (cacheMaxAgeMs) {
          cached = results;
        }
        const filteredResults = await accessFilterFunction?.(results as (ReturnType & DbObject)[]) ?? results;
        return {results: filteredResults as ReturnType[]};
>>>>>>> base/master
      },
    },
    typeDefs: gql`
      type ${name}Result {
        results: [${graphQLType}!]!
      }
      extend type Query{
        ${name}(${argString}): ${name}Result,
      }`
    }
<<<<<<< HEAD
  `);

  addGraphQLQuery(`${name}(limit: Int): ${name}Result`);
};
=======
  }
>>>>>>> base/master
