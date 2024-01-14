import moment from "moment";
import { useTimezone } from "../common/withTimezone";
import { UseMultiResult, useMulti } from "../../lib/crud/withMulti";

const requiredTags: string[] = [
  "KzdiSGpBpEkXDa8Ti", // Opportunities to take action
];

const subscribedTags: string[] = [
  "KzdiSGpBpEkXDa8Ti", // Application announcements
  "KzdiSGpBpEkXDa8Ti", // Funding opportunities
  "KzdiSGpBpEkXDa8Ti", // Fellowships and internships
  "KzdiSGpBpEkXDa8Ti", // Job listing (open)
  "KzdiSGpBpEkXDa8Ti", // Bounty (open)
  "KzdiSGpBpEkXDa8Ti", // Prizes and contests
];

export const useRecentOpportunities =<
  FragmentTypeName extends keyof FragmentTypes
> ({
  fragmentName,
  limit = 3,
  maxAgeInDays = 7,
}: {
  fragmentName: FragmentTypeName,
  limit?: number,
  maxAgeInDays?: number,
}): UseMultiResult<FragmentTypeName> => {
  const {timezone} = useTimezone();
  const now = moment().tz(timezone);
  const dateCutoff = now.subtract(maxAgeInDays, "days").format("YYYY-MM-DD");
  return useMulti<FragmentTypeName, "Posts">({
    collectionName: "Posts",
    terms: {
      view: "magic",
      filterSettings: {tags: [
        ...requiredTags.map((tagId) => ({tagId, filterMode: "Required"})),
        ...subscribedTags.map((tagId) => ({tagId, filterMode: "Subscribed"})),
      ]},
      after: dateCutoff,
      limit,
    },
    fragmentName,
    enableTotal: false,
    fetchPolicy: "cache-and-network",
  });
}
