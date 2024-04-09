import React from "react";
import { registerComponent, Components } from "../../lib/vulcan-lib";
import { Link } from "../../lib/reactRouterWrapper";
import { tagGetUrl } from "../../lib/collections/tags/helpers";
import { siteImageSetting } from "../vulcan-core/App";
import { isFriendlyUI } from "../../themes/forumTheme";
import { Tags } from "../../lib/collections/tags/collection";

const styles = (theme: ThemeType): JssStyles => ({
  root: {
    width: "100%",
    background: theme.palette.background.pageActiveAreaBackground,
    borderRadius: 6,
    display: "flex",
    padding: 16,
  },
  imageContainer: {
    marginRight: 16,
    height: 85,
  },
  image: {
    borderRadius: 5,
    objectFit: "cover",
    objectPosition: "center",
  },
  fallbackImage: {
    width: 85,
    height: 85,
    borderRadius: 5,
    objectFit: "cover",
    objectPosition: "center",
  },
  tagInfo: {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },
  title: {
    ...theme.typography[isFriendlyUI ? "headerStyle" : "headline"],
    fontSize: 16,
    lineHeight: "20px",
    fontWeight: isFriendlyUI ? 600 : 700,
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
  postCount: {
    ...theme.typography.commentStyle,
    fontSize: 13,
    lineHeight: "16px",
    marginTop: 4,
    color: theme.palette.grey[650],
  },
  subscribeButton: {
    marginTop: "auto",
  },
});

const CoreTagCard = ({ tag, classes }: { tag: TagDetailsFragment; classes: ClassesType }) => {
  const { CloudinaryImage2, SubscribeButton } = Components;

  // Image mapping for different tags
  const imageMap = {
    ffijFsJaLxQiAwqEW: "https://i.imgur.com/GfhfhnW.png", // Grassroots & Direct Action
    "7BkfuMYSNmiS4qwmZ": "https://i.imgur.com/MZlwrn2.png", // Legal & Policy Advocacy
    "6Jomoktz9WvartAbT": "https://i.imgur.com/CkJQVfX.png", // AI, Technology & Innovation
    xB9FAdfk3MiE323Zq: "https://i.imgur.com/Upb2ggV.png", // Alternative Proteins
    nKADby7AQpQfmzL4J: "https://i.imgur.com/ATjV14M.png", // Research & Data
    gGKYpdehFGSdxX2sw: "https://i.imgur.com/oe1fYx6.png", // Animal Rescue & Sanctuaries
    oBwQMugikyfs5RTZD: "https://i.imgur.com/VD9h8ES.png", // Capacity Building
    KzdiSGpBpEkXDa8Ti: "https://i.imgur.com/zVZdk0u.png", // Careers & Volunteering
    Kdkmfd8KEbDJ3iwAX: "https://i.imgur.com/PU6khp5.png", // Climate & Environment
    HzWqFhs4KqgndeESm: "https://i.imgur.com/x9hD8Pa.png", // Diet & Nutrition
    m7PnwaCfsRwNDnTD7: "https://i.imgur.com/vD53Gdb.png", // Education & Advocacy
    EEkBpJqjvSRPmNKQi: "https://i.imgur.com/uQm4kyI.png", // Farmed Animal Advocacy
    rerSxJsibwdYTCvjS: "https://i.imgur.com/krfAWdi.png", // FAST Community
    oxBe47pzDA4gF7FGh: "https://i.imgur.com/5PBfSWN.png", // Fish & Aquatic Advocacy
    czpKnLMrKmmyYTW7P: "https://i.imgur.com/ZMR373J.png", // Fundraising & Reports
    b3vxJTnnas53FPu6b: "https://i.imgur.com/ys0nJhr.png", // Institutional Campaigns
    "5EHCAQD2HJgRC9HZJ": "https://i.imgur.com/8n6Fv8m.png", // Insect Advocacy
    aBHg2tywssv3EjZ3E: "https://i.imgur.com/dzLve2i.png", // Wild Animal Suffering
    qBnZaqbzRg2GDEBb4: "https://i.imgur.com/6fjTBC1.png", // Cage Free Campaigns
    rNpm9mywMNWnBxCXa: "https://i.imgur.com/mCHd7fn.png", // Victories
  };

  const imageUrl = imageMap[tag._id as keyof typeof imageMap] || siteImageSetting.get();

  return (
    <div className={classes.root}>
      <div className={classes.imageContainer}>
        <img src={imageUrl} className={classes.fallbackImage} />
      </div>
      <div className={classes.tagInfo}>
        <Link to={tagGetUrl(tag)} className={classes.title}>
          {tag.name}
        </Link>
        <div className={classes.postCount}>{tag.postCount} posts</div>
        <div className={classes.subscribeButton}>
          <SubscribeButton subscribeMessage={"Subscribe"} unsubscribeMessage={"Subscribed"} tag={tag} />
        </div>
      </div>
    </div>
  );
};

const CoreTagCardComponent = registerComponent("CoreTagCard", CoreTagCard, { styles });

declare global {
  interface ComponentTypes {
    CoreTagCard: typeof CoreTagCardComponent;
  }
}

export default CoreTagCardComponent;
