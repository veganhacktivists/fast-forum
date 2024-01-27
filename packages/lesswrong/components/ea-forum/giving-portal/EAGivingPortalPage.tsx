import React from "react";
import { Components, getSiteUrl, registerComponent } from "../../../lib/vulcan-lib";
import { AnalyticsContext } from "../../../lib/analyticsEvents";
import { Link } from "../../../lib/reactRouterWrapper";
import { SECTION_WIDTH } from "../../common/SingleColumnSection";
import { formatStat } from "../../users/EAUserTooltipContent";
import {
  useAmountRaised,
  useDonationOpportunities,
  useShowTimeline,
} from "./hooks";
import {
  eaGivingSeason23ElectionName,
  effectiveGivingTagId,
  electionCandidatesPostLink,
  heroImage2Id,
  heroImageId,
  otherDonationOpportunities,
  setupFundraiserLink,
  timelineSpec,
  userCanVoteInDonationElection,
} from "../../../lib/eaGivingSeason";
import classNames from "classnames";
import { useCurrentUser } from "../../common/withUser";
import { CloudinaryPropsType, makeCloudinaryImageUrl } from "../../common/CloudinaryImage2";
import { useElectionVote } from "../voting-portal/hooks";
import { isPastVotingDeadline } from "../../../lib/collections/electionVotes/helpers";

const styles = (theme: ThemeType) => ({
  root: {
    fontFamily: theme.palette.fonts.sansSerifStack,
    color: theme.palette.grey[1000],
    backgroundColor: theme.palette.givingPortal[0],
    width: "100vw",
    overflow: "hidden",
  },
  sectionLight: {
    backgroundColor: theme.palette.givingPortal[200],
  },
  sectionDark: {
    backgroundColor: theme.palette.givingPortal[800],
    color: theme.palette.grey[0],
  },
  sectionSplit: {
    background: `linear-gradient(
      to top,
      ${theme.palette.givingPortal[800]} 100px,
      ${theme.palette.givingPortal[200]} 100px
    )`,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    maxWidth: 1252,
    padding: 40,
    margin: "0 auto",
    [theme.breakpoints.down("md")]: {
      padding: 24,
    },
  },
  row: {
    display: "flex",
    gap: "20px",
    "@media screen and (max-width: 1000px)": {
      flexDirection: "column",
      alignItems: "center",
    },
  },
  rowThin: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    "@media screen and (max-width: 600px)": {
      flexDirection: "column",
    },
  },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    margin: "0 auto",
    maxWidth: "100%",
  },
  bold: {
    fontWeight: "bold",
  },
  center: {
    textAlign: "center",
    alignSelf: "center",
  },
  primaryText: {
    color: theme.palette.givingPortal[1000],
  },
  h1: {
    fontSize: 60,
    fontWeight: 700,
    lineHeight: "normal",
    letterSpacing: "-1.2px",
    [theme.breakpoints.down("xs")]: {
      fontSize: 40,
    }
  },
  h2: {
    fontSize: 28,
    fontWeight: 700,
    lineHeight: "normal",
    letterSpacing: "-0.28px",
  },
  h3: {
    fontSize: 24,
    fontWeight: 700,
    lineHeight: "normal",
    letterSpacing: "-0.24px",
  },
  h4: {
    fontSize: 20,
    fontWeight: 700,
    lineHeight: "normal",
    letterSpacing: "-0.2px",
  },
  text: {
    maxWidth: 600,
    fontSize: 16,
    fontWeight: 500,
    lineHeight: "150%",
    "& a": {
      color: "inherit",
      textDecoration: "underline",
      "&:hover": {
        opacity: 1,
        textDecoration: "none",
      },
    },
  },
  textWide: {
    maxWidth: 780,
  },
  underlinedLink: {
    color: "inherit",
    textDecoration: "underline",
    "&:hover": {
      opacity: 1,
      textDecoration: "none",
    },
  },
  button: {
    textAlign: "center",
    fontSize: 16,
    lineHeight: '24px',
    fontWeight: 600,
    background: theme.palette.givingPortal.button.dark,
    color: theme.palette.givingPortal.button.light,
    borderRadius: theme.borderRadius.small,
    padding: "12px 48px",
    border: "none",
    outline: "none",
    '&:hover': {
      opacity: 0.9,
    }
  },
  buttonDisabled: {
    cursor: "not-allowed",
    opacity: 0.65,
    "&:hover": {
      opacity: 0.65,
    },
    "&:active": {
      opacity: 0.65,
    },
  },
  votingBannerButtonLightOpaque: {
    background: theme.palette.givingPortal.homepageHeader.light3Opaque,
    color: theme.palette.text.alwaysWhite,
    borderRadius: theme.borderRadius.default,
    padding: "14px 20px",
  },
  votingBannerButtonLight: {
    background: theme.palette.givingPortal.homepageHeader.light3,
    color: theme.palette.givingPortal.homepageHeader.main,
    borderRadius: theme.borderRadius.default,
    padding: "14px 20px",
  },
  tooltip: {
    background: theme.palette.panelBackground.tooltipBackground2,
    maxWidth: 300,
    textAlign: "center",
  },
  progressBar: {
    position: "relative",
    width: "100%",
    height: 12,
    backgroundColor: theme.palette.givingPortal[800],
    borderRadius: theme.borderRadius.small,
    marginBottom: 16,
    overflow: "hidden",
  },
  progress: {
    position: "absolute",
    left: 0,
    top: 0,
    backgroundColor: theme.palette.givingPortal[1000],
    height: "100%",
  },
  raisedSoFar: {
    fontWeight: 700,
    fontSize: 20,
    letterSpacing: "-0.2px",
    color: theme.palette.grey[1000],
  },
  postsList: {
    width: SECTION_WIDTH,
    maxWidth: "100%",
    "& .LoadMore-root": {
      color: theme.palette.grey[600],
    },
  },
  primaryLoadMore: {
    "& .LoadMore-root": {
      color: theme.palette.givingPortal[1000],
    },
  },
  electionCandidates: {
    width: 1120,
    maxWidth: "100%",
  },
  grid: {
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
    rowGap: "16px",
  },
  totalRaised: {
    fontSize: 24,
    fontWeight: 700,
    letterSpacing: "-0.24px",
    lineHeight: "140%",
    paddingLeft: 4,
  },
  loadMore: {
    color: theme.palette.givingPortal[1000],
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: "-0.16px",
    cursor: "pointer",
    "&:hover": {
      opacity: 0.8,
    },
  },
  sequence: {
    maxWidth: 264,
  },
  hideOnMobile: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  mt10: { marginTop: 10 },
  mt20: { marginTop: 20 },
  mt30: { marginTop: 30 },
  mt60: { marginTop: 60 },
  mt80: { marginTop: 80 },
  mb20: { marginBottom: 20 },
  mb40: { marginBottom: 40 },
  mb60: { marginBottom: 60 },
  mb80: { marginBottom: 80 },
  mb100: { marginBottom: 100 },
  w100: { width: "100%" },

  votingBanner: {
    backgroundColor: theme.palette.givingPortal.homepageHeader.dark,
    color: theme.palette.text.alwaysWhite,
  },
  votingBannerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '30px',
    flexWrap: 'wrap',
    padding: '32px 32px 42px',
  },
  votingBannerHeading: {
    color: theme.palette.givingPortal.homepageHeader.light4,
    fontSize: 40,
    lineHeight: "48px",
    marginTop: 0,
    marginBottom: 8,
    [theme.breakpoints.down("sm")]: {
      marginBottom: 12,
      fontSize: 36,
      lineHeight: "44px",
    },
  },
  votingBannerDeadline: {
    fontWeight: 700,
    textWrap: 'nowrap',
  },
  votingBannerButtons: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  voteCount: {
    fontStyle: 'italic',
  },
  eaFundsOpportunities: {
    maxWidth: 1200,
    margin: "0 auto",
    marginTop: 20,
    [theme.breakpoints.down("lg")]: {
      maxWidth: 600,
    },
  },
});

const getListTerms = ({ tagId, sortedBy, limit, after }: {
  tagId: string,
  sortedBy: PostSortingModeWithRelevanceOption,
  limit: number,
  after?: string,
}): PostsViewTerms => ({
  filterSettings: {
    tags: [
      {
        tagId,
        filterMode: "Required",
      },
    ],
  },
  after,
  sortedBy,
  limit,
  // Make it more recency biased, this is how these numbers translate to the time decay factor:
  // Higher timeDecayFactor => more recency bias
  // const timeDecayFactor = Math.min(
  //   decayFactorSlowest * (1 + (activityWeight * activityFactor)),
  //   decayFactorFastest
  // );
  algoActivityFactor: 1.0,
  algoActivityWeight: 3.0,
  algoDecayFactorFastest: 3.0,
});

/** Format as dollars with no cents */
const formatDollars = (amount: number) => "$" + formatStat(Math.round(amount));

const canonicalUrl = getSiteUrl() + "giving-portal";

const participateLink = "/posts/hAzhyikPnLnMXweXG/participate-in-the-donation-election-and-the-first-weekly#Participate_in_the_Donation_Election";
const resultsLink = "/posts/7D83kwkyaHLQSo6JT/winners-in-the-forum-s-donation-election-2023";
const candidatesLink = "/posts/bBm64htDSKn3ZKiQ5/meet-the-candidates-in-the-forum-s-donation-election-2023";

const pageDescription = "Giving season 2023 on the FAST Forum included a Donation Election (read about the winners!) and discussions related to weekly themes.";
const PageDescription = () => (
  <>
    Giving season 2023 on the FAST Forum included a{" "}
    <Link to={participateLink}>Donation Election</Link>{" "}
    (read about <Link to={resultsLink}>the winners</Link>!){" "}
    and discussions related to{" "}
    <Link to="/posts/hAzhyikPnLnMXweXG/participate-in-the-donation-election-and-the-first-weekly#Giving_Season___weekly_discussion_themes">weekly themes</Link>.
  </>
);

const socialImageProps: CloudinaryPropsType = {
  dpr: "auto",
  ar: "16:9",
  w: "1200",
  c: "fill",
  g: "center",
  q: "auto",
  f: "auto",
};

const otherFeaturedCharities = [
  "Centre for Effective Altruism",
  "Centre for Enabling EA Learning and Research",
  "Doebem",
  "EA Poland",
  "Legal Impact for Chickens",
  "ML Alignment & Theory Scholars Program",
  "PIBBSS",
  "Riesgos Catastróficos Globales",
  "High Impact Medicine",
  "Maternal Health Initiative",
  "Solar4Africa",
  "Spiro",
  "Vida Plena",
];

const EAGivingPortalPage = ({classes}: {classes: ClassesType<typeof styles>}) => {
  const { data: amountRaised, loading: amountRaisedLoading } = useAmountRaised(eaGivingSeason23ElectionName);

  const {
    results: donationOpportunities,
    loading: donationOpportunitiesLoading,
  } = useDonationOpportunities();
  /*
  const {document: donationElectionTag} = useSingle({
    documentId: donationElectionTagId,
    collectionName: "Tags",
    fragmentName: "TagBasicInfo",
  });
   */
  // const { submittedVoteCount } = useSubmittedVoteCount(eaGivingSeason23ElectionName);
  const currentUser = useCurrentUser();
  const { electionVote } = useElectionVote(eaGivingSeason23ElectionName);
  const showTimeline = useShowTimeline();
  // We only show the voting banner for users who are eligible -
  // i.e. those that created their accounts before Oct 23 and haven't voted yet.
  const showVotingBanner =
    currentUser && userCanVoteInDonationElection(currentUser) && !electionVote?.submittedAt && !isPastVotingDeadline();

  /*
  const handleVote = useCallback(() => {
    if (!currentUser) {
      openDialog({
        componentName: "LoginPopup",
        componentProps: {},
      });
      return;
    }
    if (!userCanVoteInDonationElection(currentUser)) {
      flash("You are not eligible to vote as your account was created after 22nd Oct 2023");
      return;
    }
    window.location.href = '/voting-portal';
  }, [currentUser, flash, openDialog]);
   */

  const effectiveGivingPostsTerms = getListTerms({
    tagId: effectiveGivingTagId,
    sortedBy: "magic",
    limit: 8,
  });

  const fundLink = "https://www.givingwhatwecan.org/fundraisers/ea-forum-donation-election-fund-2023";
  const totalRaisedFormatted = formatDollars(amountRaised.totalRaised);
  /*
  const raisedForElectionFundFormatted = formatDollars(amountRaised.raisedForElectionFund);
  const targetPercent = amountRaised.electionFundTarget > 0 ? (amountRaised.raisedForElectionFund / amountRaised.electionFundTarget) * 100 : 0;
   */
  const allDonationOpportunities = !!donationOpportunities?.length ? [...donationOpportunities, ...otherDonationOpportunities] : []
  const eaFundsOpportunities = allDonationOpportunities.filter(
    ({name}) => name.indexOf("EA Funds") >= 0,
  );
  const featuredCharities = allDonationOpportunities.filter(
    ({name}) => otherFeaturedCharities.includes(name),
  );

  // const voteMessage = isPastVotingDeadline() ? "Voting has closed. You can still donate to the Election Fund until Dec 20" : "Voting is open until Dec 15. Select candidates and distribute your votes using a ranked-choice method."

  const {
    Loading, HeadTags, Timeline, Typography, PostsList2,
    ElectionCandidatesList, DonationOpportunity, CloudinaryImage2, QuickTakesList,
  } = Components;

  return (
    <AnalyticsContext pageContext="eaGivingPortal">
      <div className={classes.root}>
        <HeadTags
          title="Giving portal"
          canonicalUrl={canonicalUrl}
          ogUrl={canonicalUrl}
          description={pageDescription}
          image={makeCloudinaryImageUrl(heroImageId, socialImageProps)}
        />
        {showVotingBanner && <div className={classes.votingBanner}>
          <div className={classes.votingBannerContent} id="votingBanner">
            <div>
              <Typography
                variant="display1"
                className={classes.votingBannerHeading}
              >
                Decide how you're voting
              </Typography>
              <div className={classNames(classes.text, classes.textWide)}>
                Vote to help determine how the {" "}
                <Link to={fundLink}>
                  Donation Election Fund
                </Link>{" "}should be distributed.{" "}
                <span className={classes.votingBannerDeadline}>Deadline: December 15</span>
              </div>
            </div>
            <div className={classes.votingBannerButtons}>
              <Link to={electionCandidatesPostLink} className={classNames(classes.button, classes.votingBannerButtonLightOpaque)}>
                Read about the candidates
              </Link>
              <Link to='/voting-portal' className={classNames(classes.button, classes.votingBannerButtonLight)}>
                Vote in the Donation Election
              </Link>
            </div>
          </div>
        </div>}
        <div className={classes.content} id="top">
          <div className={classNames(classes.h1, classes.center, classes.mt30)}>
            Giving portal
          </div>
          <div className={classNames(classes.text, classes.center)}>
            <PageDescription />
          </div>
          {showTimeline &&
            <>
              <div className={classNames(
                classes.h2,
                classes.mt20,
                classes.hideOnMobile,
              )}>
                Timeline
              </div>
              <Timeline {...timelineSpec} className={classes.hideOnMobile} />
            </>
          }
        </div>
        <div className={classNames(classes.content, classes.mb20)}>
          <div className={classNames(classes.h2, classes.center)}>
            Donate now
          </div>
          <div className={classNames(classes.text, classes.center)}>
            Consider donating to one of these{" "}
            <Link to="https://www.givingwhatwecan.org/en-US/why-we-recommend-funds?slug=why-we-recommend-funds">expert-led charitable funds</Link>,{" "}
            or explore other funds and organizations{" "}
            <Link to="https://www.givingwhatwecan.org/donate/organizations">here</Link>.
          </div>
          <div className={classNames(classes.grid, classes.eaFundsOpportunities)}>
            {eaFundsOpportunities.map((candidate) => (
              <DonationOpportunity candidate={candidate} key={candidate._id} />
            ))}
            {donationOpportunitiesLoading && <Loading />}
          </div>
        </div>
        <CloudinaryImage2 publicId={heroImage2Id} fullWidthHeader imgProps={{ h: "1200" }} />
        <div className={classes.sectionLight}>
          <div className={classes.content} id="election">
            <div className={classNames(classes.column, classes.mt60, classes.mb60)}>
              <div className={classNames(classes.h1, classes.primaryText)}>
                Donation election 2023
              </div>
              <div className={classNames(classes.text, classes.primaryText, classes.textWide)}>
                The Donation Election was{" "}
                <Link to={participateLink}>officially announced</Link>{" "}
                in early November; Forum users would vote on how we should allocate a{" "}
                “<Link to={fundLink}>Donation Election Fund</Link>.”{" "}
                Voting opened on December 1st and closed on December 15th.
              </div>
              <div className={classNames(classes.text, classes.primaryText, classes.textWide)}>
                In the end, <span className={classes.bold}>341 people voted, and{" "}
                <Link to={resultsLink}>the results were announced here</Link></span>;{" "}
                Rethink Priorities took first place, followed by Charity Entrepreneurship’s
                Incubated Charities Fund, and the Animal Welfare Fund. You can also{" "}
                <Link to={candidatesLink}>read about the charities that were candidates
                in the Election</Link>.
              </div>
              <div className={classNames(
                classes.text,
                classes.primaryText,
                classes.textWide,
                classes.mb20,
              )}>
                The section below hasn’t been changed since before the Donation Election closed.
              </div>
              {/*
              <div className={classNames(classes.row, classes.mt20)}>
                <ElectionFundCTA
                  image={<DonateIcon />}
                  title="Donate"
                  description="The fund will be designated for the top 3 candidates, based on Forum users' votes."
                  buttonText="Donate"
                  href={donationElectionFundraiserLink}
                  solidButton
                >
                  {!amountRaisedLoading &&
                    <>
                      <div className={classes.progressBar}>
                        <div
                          className={classes.progress}
                          style={{width: `${targetPercent}%`}}
                        />
                      </div>
                      <div className={classes.raisedSoFar}>
                        {raisedForElectionFundFormatted} raised so far
                      </div>
                    </>
                  }
                </ElectionFundCTA>
                <ElectionFundCTA
                  image={<DiscussIcon />}
                  title="Discuss"
                  description="Discuss where we should donate and what we should vote for in the Election."
                  buttonText="Contribute to the discussion"
                  href="/posts/hAzhyikPnLnMXweXG/participate-in-the-donation-election-and-the-first-weekly#Start_discussing_where_we_should_donate__what_we_should_vote_for__and_other_questions_related_to_effective_giving"
                >
                  <Link
                    to={postsAboutElectionLink}
                    className={classes.underlinedLink}
                    eventProps={{pageElementContext: "givingPortalViewRelatedPosts"}}
                  >
                    View {donationElectionTag?.postCount} related post{donationElectionTag?.postCount === 1 ? "" : "s"}
                  </Link>
                </ElectionFundCTA>
                <ElectionFundCTA
                  image={<VoteIcon />}
                  title="Vote"
                  description={voteMessage}
                  buttonText="Vote in the Election"
                  onButtonClick={handleVote}
                  solidButton
                  disabled={isPastVotingDeadline()}
                >
                  {submittedVoteCount && (
                    <div className={classes.voteCount}>
                      {submittedVoteCount} people have voted{isPastVotingDeadline() ? "" : " so far"}.
                    </div>
                  )}
                </ElectionFundCTA>
              </div>
                */}
            </div>
          </div>
        </div>
        <div className={classes.sectionDark}>
          <div className={classes.content} id="candidates">
            <div className={classNames(classes.column, classes.mt60)}>
              <div className={classNames(classes.h2, classes.primaryText)}>
                Candidates in the Election
              </div>
              <div className={classNames(
                classes.text,
                classes.primaryText,
                classes.textWide,
                classes.mb20,
              )}>
                The Donation Election Fund will be designated for the top three
                winning candidates in the election (split proportionately, based
                on users' votes). You can read about{" "}
                <Link to={candidatesLink}>these candidates</Link> and what marginal
                donations to them would accomplish, and, more broadly{" "}
                <Link to="/topics/donation-election-2023">read Forum posts about the election</Link>.
              </div>
              <ElectionCandidatesList className={classes.electionCandidates} />
              <div className={classNames(
                classes.rowThin,
                classes.mt10,
                classes.mb80,
              )}>
                <button className={classNames(classes.button, classes.buttonDisabled)}>
                  Vote in the Election
                </button>
              </div>
            </div>
          </div>
        </div>
        <CloudinaryImage2 publicId={heroImageId} fullWidthHeader imgProps={{ h: "1200" }} />
        <div className={classes.sectionLight}>
          <div className={classes.content}>
            <div className={classNames(
              classes.column,
              classes.mt60,
              classes.mb80,
            )} id="posts">
              <div className={classNames(classes.h2, classes.primaryText)}>
                Posts tagged &quot;Effective Giving&quot;
              </div>
              <div className={classNames(
                classes.postsList,
                classes.primaryLoadMore,
              )}>
                <PostsList2
                  terms={effectiveGivingPostsTerms}
                  loadMoreMessage="View more"
                />
              </div>
              <div className={classNames(
                classes.h2,
                classes.primaryText,
                classes.mt30,
              )}>
                Quick takes tagged &quot;Effective Giving&quot;
              </div>
              <QuickTakesList
                showCommunity
                tagId={effectiveGivingTagId}
                maxAgeDays={30}
                className={classNames(classes.postsList, classes.primaryLoadMore)}
              />
            </div>
          </div>
        </div>
        <div className={classNames(
          classes.content,
          classes.mt60,
          classes.mb80,
        )} id="opportunities">
          <div className={classes.h1}>Other featured charities</div>
          <div className={classNames(classes.text, classes.textWide)}>
            More charities were featured and discussed on the Forum than appeared
            as candidates in the Donation Election. If you were impressed by these
            charities during <Link to="/s/xourt4HttDM5QcHsk">Marginal Funding Week</Link>{" "}
            or afterwards, you can donate to them below.
          </div>
          <div className={classNames(classes.text, classes.textWide)}>
            Supporting high-impact work via donations is a core part of effective altruism.{" "}
            Besides donating, you can also <Link to={setupFundraiserLink}>run custom fundraisers</Link>
            , and <Link to="https://www.givingwhatwecan.org">take other kinds of action</Link>.
          </div>
          {!amountRaisedLoading &&
            <div className={classes.text}>
              Total donations raised through the Forum:{" "}
              <span className={classes.totalRaised}>{totalRaisedFormatted}</span>
            </div>
          }
          <div className={classNames(classes.grid, classes.mt10)}>
            {featuredCharities.map((candidate) => (
              <DonationOpportunity candidate={candidate} key={candidate._id} />
            ))}
            {donationOpportunitiesLoading && <Loading />}
          </div>
        </div>
      </div>
    </AnalyticsContext>
  );
}

const EAGivingPortalPageComponent = registerComponent(
  "EAGivingPortalPage",
  EAGivingPortalPage,
  {styles},
);

declare global {
  interface ComponentTypes {
    EAGivingPortalPage: typeof EAGivingPortalPageComponent;
  }
}
