import { addCronJob } from "../cronUtil";
import PageCacheRepo from "../repos/PageCacheRepo";

addCronJob({
  name: "clearExpiredPageCacheEntries",
  interval: "every 10 minutes",
  async job() {
    const pageCacheRepo = new PageCacheRepo();
    await pageCacheRepo.clearExpiredEntries();
  },
});
