import RecommendationStrategy, { RecommendationResult } from "./RecommendationStrategy";
import type { StrategySpecification } from "../../lib/collections/users/recommendationSettings";
import { getSqlClientOrThrow } from "../sql/sqlClient";
import { featureRegistry } from "./Feature";

type FeatureStrategyOptions = {
  publishedAfter: Date,
  publishedBefore: Date,
}

/**
 * The feature strategy can be used to combine multiple composable "features" that
 * contribute to a score. Features should extend the `Feature` abstract class and
 * should return a score between 0 and 1 that can then be multiplied by a weight
 * when sorting results.
 */
class FeatureStrategy extends RecommendationStrategy {
  async recommend(
    currentUser: DbUser | null,
    count: number,
<<<<<<< HEAD
    { postId, features }: StrategySpecification,
=======
    {postId, features}: StrategySpecification,
    options?: Partial<FeatureStrategyOptions>,
>>>>>>> base/master
  ): Promise<RecommendationResult> {
    if (!features) {
      throw new Error("No features supplied to FeatureStrategy");
    }

    const db = getSqlClientOrThrow();

    const readFilter = this.getAlreadyReadFilter(currentUser);
    const recommendedFilter = this.getAlreadyRecommendedFilter(currentUser);
    const postFilter = this.getDefaultPostFilter();
    const tagFilter = this.getTagFilter();

    let joins = "";
    let filters = "";
    let score = "";
    let args = {};

<<<<<<< HEAD
    for (const { feature: featureName, weight } of features) {
=======
    if (options?.publishedAfter) {
      filters += `p."createdAt" > $(publishedAfter) AND `;
    }
    if (options?.publishedBefore) {
      filters += `p."createdAt" < $(publishedBefore) AND `;
    }

    for (const {feature: featureName, weight} of features) {
>>>>>>> base/master
      if (weight === 0) {
        continue;
      }
      const feature = new featureRegistry[featureName]();
      joins += ` ${feature.getJoin()}`;
      filters += ` ${feature.getFilter()}`;
      const weightName = `${featureName}Weight`;
      score += ` + ($(${weightName}) * (${feature.getScore()}))`;
      args = { ...args, ...feature.getArgs(), [weightName]: weight };
    }

<<<<<<< HEAD
    const posts = await db.any(
      `
=======
    const posts = await db.any(`
      -- FeatureStrategy
>>>>>>> base/master
      SELECT p.*
      FROM (
        SELECT p.*
        FROM "Posts" p
        ${readFilter.join}
        ${postFilter.join}
        ${joins}
        WHERE
          p."_id" <> $(postId) AND
          ${filters}
          ${readFilter.filter}
          ${postFilter.filter}
          ${tagFilter.filter}
        ORDER BY 0 ${score} DESC
        LIMIT $(count) * 10
      ) p
      ${recommendedFilter.join}
      WHERE ${recommendedFilter.filter} 1=1
      LIMIT $(count)
<<<<<<< HEAD
    `,
      {
        ...readFilter.args,
        ...recommendedFilter.args,
        ...postFilter.args,
        ...tagFilter.args,
        ...args,
        postId,
        count,
      },
    );
=======
    `, {
      ...readFilter.args,
      ...recommendedFilter.args,
      ...postFilter.args,
      ...tagFilter.args,
      ...args,
      ...options,
      postId,
      count,
    });
>>>>>>> base/master

    return { posts, settings: { postId, features } };
  }
}

export default FeatureStrategy;
