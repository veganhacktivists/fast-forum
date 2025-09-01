<<<<<<< HEAD
import { addGraphQLResolvers, addGraphQLQuery, addGraphQLMutation } from "../../../lib/vulcan-lib/graphql";
import { userIsAdmin } from "../../../lib/vulcan-users/permissions";
import ElasticExporter from "./ElasticExporter";

addGraphQLResolvers({
  Query: {
    SearchSynonyms(_root: void, _args: {}, { currentUser }: ResolverContext): Promise<string[]> {
=======
import gql from "graphql-tag";
import { userIsAdmin } from "../../../lib/vulcan-users/permissions";
import ElasticExporter from "./ElasticExporter";

export const elasticGqlQueries = {
    SearchSynonyms(
      _root: void,
      _args: {},
      {currentUser}: ResolverContext,
    ): Promise<string[]> {
>>>>>>> base/master
      if (!currentUser || !userIsAdmin(currentUser)) {
        throw new Error("This feature is only available to admins");
      }
      const exporter = new ElasticExporter();
      return exporter.getExistingSynonyms();
    },
  }
export const elasticGqlMutations = {
    async UpdateSearchSynonyms(
      _root: void,
      { synonyms }: { synonyms: string[] },
      { currentUser }: ResolverContext,
    ): Promise<string[]> {
      if (!currentUser || !userIsAdmin(currentUser)) {
        throw new Error("This feature is only available to admins");
      }
      const exporter = new ElasticExporter();
      await exporter.updateSynonyms(synonyms);
      return synonyms;
<<<<<<< HEAD
    },
  },
});
=======
    }
  }
>>>>>>> base/master

export const elasticGqlTypeDefs = gql`
  extend type Query {
    SearchSynonyms: [String!]!
  }
  extend type Mutation {
    UpdateSearchSynonyms(synonyms: [String!]!): [String!]!
  }
`
