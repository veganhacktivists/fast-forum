<<<<<<< HEAD:packages/lesswrong/server/pageCache/cron.ts
import { addCronJob } from "../cronUtil";
import PageCacheRepo from "../repos/PageCacheRepo";

addCronJob({
  name: "clearExpiredPageCacheEntries",
  interval: "every 10 minutes",
=======
import { addCronJob } from '../cron/cronUtil';
import PageCacheRepo from '../repos/PageCacheRepo';

export const cronClearExpiredPageCacheEntries = addCronJob({
  name: 'clearExpiredPageCacheEntries',
  interval: 'every 5 minutes',
>>>>>>> base/master:packages/lesswrong/server/cache/cron.ts
  async job() {
    const pageCacheRepo = new PageCacheRepo();
    await pageCacheRepo.clearExpiredEntries();
  },
});
