import React from "react";
import { Components, registerComponent } from "../../../lib/vulcan-lib";
import { HEADER_HEIGHT } from "../../common/Header";
import { Link } from "../../../lib/reactRouterWrapper";
import classNames from "classnames";
import { useCurrentUser } from "../../common/withUser";
import { useDialog } from "../../common/withDialog";
import { userCanVoteInDonationElection } from "../../../lib/eaGivingSeason";
import { isPastVotingDeadline } from "../../../lib/collections/electionVotes/helpers";
import { votingPortalStyles } from "./styles";
import { useMessages } from "../../common/withMessages";
import { DatabasePublicSetting } from "../../../lib/publicSettings";

const styles = (theme: ThemeType) => ({
  // TODO combine these with votingPortalStyles
  ...votingPortalStyles(theme),
  root: {
    margin: "60px 0",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    borderRadius: 12,
    background: theme.palette.grey[0],
    width: 780,
    maxWidth: "100%",
    lineHeight: "24px",
    fontSize: 16,
    fontWeight: 500,
    fontFamily: theme.palette.fonts.sansSerifStack,
    "& a": {
      textDecoration: "underline",
      "&:hover": {
        textDecoration: "none",
        opacity: 1,
      },
    },
    [theme.breakpoints.down("md")]: {
      padding: 16,
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
      borderRadius: 0,
      alignSelf: "flex-start",
      margin: 0,
    },
  },
  description: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  bold: {
    fontWeight: 700,
  },
  inset: {
    borderRadius: theme.borderRadius.default,
    background: theme.palette.grey[100],
    padding: 24,
  },
  h1: {
    color: theme.palette.givingPortal[1000],
    fontSize: 48,
    fontWeight: 700,
    lineHeight: "normal",
  },
  h2: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 24,
    lineHeight: "normal",
  },
  h3: {
    fontSize: 16,
    fontWeight: 700,
    marginTop: 24,
    marginBottom: 4,
    lineHeight: "normal",
  },
  buttonRow: {
    display: "flex",
    flexDirection: "row",
    gap: "20px",
    "& a": {
      flexBasis: "50%",
    },
    "& button": {
      flexBasis: "50%",
    },
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    gap: "10px",
    fontSize: 16,
    fontWeight: 600,
    background: theme.palette.givingPortal.button.dark,
    color: theme.palette.givingPortal.button.light,
    borderRadius: theme.borderRadius.small,
    padding: "12px 20px",
    border: "none",
    outline: "none",
    userSelect: "none",
    cursor: "pointer",
    textDecoration: "none !important",
    "&:hover": {
      opacity: "0.85 !important",
    },
    "&:active": {
      opacity: "0.7 !important",
    },
  },
  greyButton: {
    background: theme.palette.grey[100],
    color: theme.palette.grey[1000],
    "&:hover": {
      background: theme.palette.grey[200],
    },
  },
  imageWrapper: {
    maxWidth: 700,
    width: "100%",
    margin: "0 auto",
  },
  image: {
    width: "100%",
    borderRadius: theme.borderRadius.default,
  },
  smallText: {
    color: theme.palette.grey[600],
    fontSize: 14,
    fontWeight: 500,
    lineHeight: "140%",
  },
  warningBox: {
    border: `2px solid ${theme.palette.text.warning}`,
    borderRadius: theme.borderRadius.small,
    backgroundColor: theme.palette.background.warningTranslucent,
    fontWeight: 600,
    fontSize: 16,
    padding: "12px 24px",
    margin: "0 auto",
    color: theme.palette.text.warning,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    [theme.breakpoints.down("xs")]: {
      padding: "12px 12px",
    },
  },
});

const introImageIdSetting = new DatabasePublicSetting<string>(
  "votingPortalIntroImageId",
  "voting-portal-intro-image-2023-12-01_1",
);

const newTabProps = { target: "_blank", rel: "noopener noreferrer" };

const fundLink = "https://www.givingwhatwecan.org/fundraisers/ea-forum-donation-election-fund-2023";
const exploreLink = "/giving-portal";
export const processLink = "/posts/dYhKfsNuQX2sznfxe/donation-election-how-voting-will-work";
export const candidatesLink = "/posts/bBm64htDSKn3ZKiQ5/meet-the-candidates-in-the-forum-s-donation-election-2023";
const getStartedLink = "/voting-portal/select-candidates";
const votingNormsLink =
  "/posts/hAzhyikPnLnMXweXG/participate-in-the-donation-election-and-the-first-weekly#Who_can_vote___voting_norms";

const VotingPortalIntro = ({ classes }: { classes: ClassesType<typeof styles> }) => {
  const currentUser = useCurrentUser();
  const { openDialog } = useDialog();
  const { flash } = useMessages();

  const { CloudinaryImage2, ForumIcon } = Components;

  const isLoggedIn = !!currentUser;
  const userCanVote = userCanVoteInDonationElection(currentUser);
  const votingClosed = isPastVotingDeadline();

  const linkEnabled = isLoggedIn && userCanVote && !votingClosed;

  const handleDisabledLinkClick = () => {
    if (!isLoggedIn) {
      openDialog({
        componentName: "LoginPopup",
        componentProps: {},
      });
    } else if (!userCanVote) {
      flash("Accounts created after 22nd Oct 2023 cannot vote in this election");
    } else if (votingClosed) {
      flash("Voting has closed");
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.h1}>Welcome to the voting portal</div>
      {!userCanVote && (
        <div className={classes.warningBox}>
          <ForumIcon icon="Warning" />
          {isLoggedIn
            ? "You are not eligible to vote as your account was created after 22nd Oct 2023"
            : "You must be logged in to vote"}
        </div>
      )}
      <div className={classes.description}>
        <div>
          The{" "}
          <Link to={exploreLink} {...newTabProps}>
            Donation Election
          </Link>{" "}
          is about allocating money based on Forum users’ votes. The{" "}
          <Link to={fundLink} {...newTabProps}>
            Donation Election Fund
          </Link>{" "}
          will be designated for the top 3{" "}
          <Link to={candidatesLink} {...newTabProps}>
            candidates
          </Link>
          , in proportion to the election results.{" "}
          <span className={classes.bold}>
            Your vote should represent how you’d allocate funding between the candidates.
          </span>{" "}
        </div>
      </div>
      <div className={classes.imageWrapper}>
        <CloudinaryImage2 publicId={introImageIdSetting.get()} className={classes.image} />
      </div>
      <div>
        Your vote is anonymous to other users. If we have reason to believe you've committed{" "}
        <Link to={votingNormsLink} {...newTabProps}>
          voter fraud
        </Link>{" "}
        we may nullify your vote and involve the moderators.
      </div>
      <div className={classes.smallText}>
        When voting closes on December 15, we’ll use{" "}
        <Link to={processLink} {...newTabProps}>
          the process outlined here
        </Link>{" "}
        to determine the election results. In brief, we’ll normalize points from each voter (to make sure everyone’s
        vote counts the same), then remove the candidate with the fewest points from the election. Then we’ll
        renormalize votes (if you assigned some points to the now-removed candidates, your other points will count for
        more), and remove the lowest-scoring candidate. We’ll repeat that until we’re down to three candidates. (More in
        the{" "}
        <Link to={processLink} {...newTabProps}>
          full post
        </Link>
        .)
      </div>
      <div className={classes.buttonRow}>
        <Link to={candidatesLink} className={classNames(classes.button, classes.greyButton)}>
          Read about the candidates
        </Link>
        {linkEnabled ? (
          <Link to={getStartedLink} className={classes.button}>
            Get started -&gt;
          </Link>
        ) : (
          <button className={classes.button} onClick={handleDisabledLinkClick}>
            Get started
          </button>
        )}
      </div>
    </div>
  );
};

const VotingPortalIntroComponent = registerComponent("VotingPortalIntro", VotingPortalIntro, { styles });

declare global {
  interface ComponentTypes {
    VotingPortalIntro: typeof VotingPortalIntroComponent;
  }
}
