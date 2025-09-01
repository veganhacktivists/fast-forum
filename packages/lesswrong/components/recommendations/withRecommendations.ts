import { gql } from "@apollo/client"; import { useQuery } from "@apollo/client";
import { fragmentTextForQuery } from "../../lib/vulcan-lib/fragments";
import { defaultAlgorithmSettings } from "../../lib/collections/users/recommendationSettings";
import type { RecommendationsAlgorithm } from "../../lib/collections/users/recommendationSettings";

export const useRecommendations = (
  algorithm: RecommendationsAlgorithm,
): {
  recommendationsLoading: boolean;
  recommendations: PostsListWithVotesAndSequence[] | undefined;
} => {
  const { data, loading } = useQuery(
    gql`
      query RecommendationsQuery($count: Int, $algorithm: JSON) {
        Recommendations(count: $count, algorithm: $algorithm) {
          ...PostsListWithVotesAndSequence
        }
      }
      ${fragmentTextForQuery("PostsListWithVotesAndSequence")}
    `,
    {
      variables: {
        count: algorithm?.count || 10,
        algorithm: algorithm || defaultAlgorithmSettings,
        batchKey: "recommendations",
      },
      ssr: true,
    },
  );
  return {
    recommendationsLoading: loading,
    recommendations: data?.Recommendations,
  };
};
