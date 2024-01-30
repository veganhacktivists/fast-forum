import React from "react";
import { Components, registerComponent } from "../../lib/vulcan-lib";
import { Link } from "../../lib/reactRouterWrapper";
import { userGetProfileUrl } from "../../lib/collections/users/helpers";
import { useRecentOpportunities } from "../hooks/useRecentOpportunities";
import { AnalyticsContext } from "../../lib/analyticsEvents";
import { useRecommendations } from "./withRecommendations";
import { usePaginatedResolver } from "../hooks/usePaginatedResolver";
import { MAX_CONTENT_WIDTH } from "../posts/TableOfContents/ToCColumn";

const styles = (theme: ThemeType) => ({
  root: {
    background: theme.palette.grey[55],
    padding: "60px 0 80px 0",
    marginTop: 60,
  },
  section: {
    maxWidth: MAX_CONTENT_WIDTH,
    margin: "0 auto 60px",
  },
  sectionHeading: {
    fontFamily: theme.palette.fonts.sansSerifStack,
    fontSize: 20,
    fontWeight: 600,
    color: theme.palette.grey[1000],
    marginBottom: 16,
  },
  largePostItem: {
    marginTop: 8,
  },
  viewMore: {
    marginTop: 12,
    fontFamily: theme.palette.fonts.sansSerifStack,
    fontSize: 14,
    fontWeight: 600,
    color: theme.palette.grey[600],
  },
});

const PostBottomRecommendations = ({post, hasTableOfContents, classes}: {
  post: PostsWithNavigation | PostsWithNavigationAndRevision,
  hasTableOfContents?: boolean,
  classes: ClassesType,
}) => {
  const {
    recommendationsLoading: moreFromAuthorLoading,
    recommendations: moreFromAuthorPosts,
  } = useRecommendations({
    strategy: {
      name: "moreFromAuthor",
      postId: post._id,
      context: "post-footer",
    },
    count: 6,
    disableFallbacks: true,
  });

  const {
    results: curatedAndPopularPosts,
    loading: curatedAndPopularLoading,
  } = usePaginatedResolver({
    fragmentName: "PostsPage",
    resolverName: "CuratedAndPopularThisWeek",
    limit: 6,
  });

  const {
    results: opportunityPosts,
    loading: opportunitiesLoading,
  } = useRecentOpportunities({
    fragmentName: "PostsListWithVotes",
  });

  const profileUrl = userGetProfileUrl(post.user);

  const hasUserPosts = post.user &&
    (moreFromAuthorLoading || !!moreFromAuthorPosts?.length);

  const {
    PostsLoading, ToCColumn, EAPostsItem, EALargePostsItem, UserTooltip,
  } = Components;
  return (
    <AnalyticsContext pageSectionContext="postPageFooterRecommendations">
      <div className={classes.root}>
        <ToCColumn
          tableOfContents={hasTableOfContents ? <div /> : null}
          notHideable
        >
          <div>
            {hasUserPosts &&
              <div className={classes.section}>
                <div className={classes.sectionHeading}>
                  More from{" "}
                  <UserTooltip user={post.user} inlineBlock={false}>
                    <Link to={profileUrl}>{post.user.displayName}</Link>
                  </UserTooltip>
                </div>
                {moreFromAuthorLoading && !moreFromAuthorPosts?.length &&
                  <PostsLoading />
                }
                <AnalyticsContext pageSubSectionContext="moreFromAuthor">
                  {moreFromAuthorPosts?.map((post) => (
                    <EAPostsItem key={post._id} post={post} />
                  ))}
                  <div className={classes.viewMore}>
                    <Link to={profileUrl}>
                      View more
                    </Link>
                  </div>
                </AnalyticsContext>
              </div>
            }
            <div className={classes.section}>
              <div className={classes.sectionHeading}>
                Curated and popular this week
              </div>
              {curatedAndPopularLoading && !curatedAndPopularPosts?.length &&
                <PostsLoading />
              }
              <AnalyticsContext pageSubSectionContext="curatedAndPopular">
                {curatedAndPopularPosts?.map((post) => (
                  <EALargePostsItem
                    key={post._id}
                    post={post}
                    className={classes.largePostItem}
                    noImagePlaceholder
                  />
                ))}
              </AnalyticsContext>
            </div>
            <div className={classes.section}>
              <div className={classes.sectionHeading}>
                Recent opportunities
              </div>
              {opportunitiesLoading && !opportunityPosts?.length &&
                <PostsLoading />
              }
              <AnalyticsContext pageSubSectionContext="recentOpportunities">
                {opportunityPosts?.map((post) => (
                  <EAPostsItem key={post._id} post={post} />
                ))}
                <div className={classes.viewMore}>
                  <Link to="/topics/careers-and-volunteering">
                    View more
                  </Link>
                </div>
              </AnalyticsContext>
            </div>
          </div>
        </ToCColumn>
      </div>
    </AnalyticsContext>
  );
}

const PostBottomRecommendationsComponent = registerComponent(
  "PostBottomRecommendations",
  PostBottomRecommendations,
  {styles},
);

declare global {
  interface ComponentTypes {
    PostBottomRecommendations: typeof PostBottomRecommendationsComponent
  }
}
