import { updateReviewVoteTotals } from "../reviewVoteUpdate";
import { registerMigration } from "./migrationUtils";

export default registerMigration({
  name: "updateReviewVotes",
  dateWritten: "2022-12-15",
  idempotent: true,
  action: async () => {
<<<<<<< HEAD
    // await updateReviewVoteTotals("nominationVote")
    await updateReviewVoteTotals("finalVote");
  },
});
=======
    await updateReviewVoteTotals("nominationVote") 
    // await updateReviewVoteTotals("finalVote") 
  }
})
>>>>>>> base/master
