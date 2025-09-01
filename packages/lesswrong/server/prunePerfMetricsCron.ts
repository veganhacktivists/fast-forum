import { addCronJob } from "./cron/cronUtil";
import { pruneOldPerfMetrics } from "./analytics/serverAnalyticsWriter";
import { performanceMetricLoggingEnabled } from "../lib/instanceSettings";

<<<<<<< HEAD
addCronJob({
  name: "prunePerfMetrics",
  interval: "every 24 hours",
=======
export const prunePerfMetricsCron = addCronJob({
  name: 'prunePerfMetrics',
  interval: 'every 24 hours',
>>>>>>> base/master
  async job() {
    if (performanceMetricLoggingEnabled.get()) {
      await pruneOldPerfMetrics();
    }
  },
});
