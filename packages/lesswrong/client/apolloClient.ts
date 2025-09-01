<<<<<<< HEAD
import { ApolloClient, NormalizedCacheObject, InMemoryCache, ApolloLink } from "@apollo/client";
import { apolloCacheVoteablePossibleTypes } from "../lib/make_voteable";
import { createHttpLink, createErrorLink, headerLink } from "../lib/apollo/links";

export const createApolloClient = (baseUrl = "/"): ApolloClient<NormalizedCacheObject> => {
  const cache = new InMemoryCache();
  //   {
  //   possibleTypes: {
  //     ...apolloCacheVoteablePossibleTypes(),
  //   },
  // }
=======
import { ApolloClient, NormalizedCacheObject, InMemoryCache, ApolloLink } from '@apollo/client';
import { createHttpLink, createErrorLink, headerLink } from '../lib/apollo/links';

export const createApolloClient = (baseUrl = '/'): ApolloClient => {
  const cache = new InMemoryCache();
>>>>>>> base/master

  const cachedState = window.__APOLLO_STATE__; // baseUrl === "/" ? window.__APOLLO_STATE__ : window.__APOLLO_FOREIGN_STATE__;
  cache.restore(cachedState ?? ""); // ssr

  return new ApolloClient({
    link: ApolloLink.from([headerLink, createErrorLink(), createHttpLink(baseUrl)]),
    cache,
  });
};
