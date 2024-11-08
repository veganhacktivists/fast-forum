import { Components, registerComponent } from "../../lib/vulcan-lib";
import React from "react";
import { useLocation } from "../../lib/routeUtil";
import { usePostBySlug } from "./usePost";
import { postGetPageUrl } from "../../lib/collections/posts/helpers";
import { useCurrentUser } from "../common/withUser";

const PostsSingleSlugRedirect = () => {
  const { params } = useLocation();
  const slug = params.slug;
  // TODO: this 404s
  const { post, loading, error } = usePostBySlug({ slug });

  const user = useCurrentUser();

  console.log({ user });

  if (post) {
    const canonicalUrl = postGetPageUrl(post);
    return <Components.PermanentRedirect url={canonicalUrl} />;
  } else {
    return loading ? <Components.Loading /> : <Components.Error404 />;
  }
};

const PostsSingleSlugRedirectComponent = registerComponent("PostsSingleSlugRedirect", PostsSingleSlugRedirect);

declare global {
  interface ComponentTypes {
    PostsSingleSlugRedirect: typeof PostsSingleSlugRedirectComponent;
  }
}
