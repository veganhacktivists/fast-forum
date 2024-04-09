/*
 * Logo used in the header by the EA Forum
 *
 * Could easily be adapted for other Forums
 */
import React from "react";
import { registerComponent } from "../../lib/vulcan-lib/components";
import { getLogoUrl, getSmallLogoUrl } from "../../lib/vulcan-lib/utils";
import { forumTitleSetting, isEAForum } from "../../lib/instanceSettings";

const styles = (theme: ThemeType): JssStyles => ({
  root: {
    height: isEAForum ? 34 : 48,
    [theme.breakpoints.down("sm")]: {
      height: isEAForum ? 30 : 48,
    },
  },
  icon: {
    width: 34,
    [theme.breakpoints.down("sm")]: {
      width: 30,
    },
  },
});

const SiteLogo = ({ eaWhite, classes }: { eaWhite?: boolean; classes: ClassesType; width?: number }) => {
  const logoUrl = getLogoUrl();
  if (!logoUrl) return null;

  return (
    <img
      className={classes.root}
      src={logoUrl}
      title={forumTitleSetting.get()}
      alt={`${forumTitleSetting.get()} Logo`}
      style={{ width: "250px", height: "45px" }}
    />
  );
};

const SiteLogoSmall = ({ eaWhite, classes }: { eaWhite?: boolean; classes: ClassesType }) => {
  const smallUrl = getSmallLogoUrl();

  return (
    <img
      className={classes.root}
      src={smallUrl}
      title={forumTitleSetting.get()}
      alt={`${forumTitleSetting.get()} Logo`}
      style={{ width: "150px", height: "46px" }}
    />
  );
};

SiteLogo.displayName = "SiteLogo";

const SiteLogoComponent = registerComponent("SiteLogo", SiteLogo, { styles });
const SiteLogoSmallComponent = registerComponent("SiteLogoSmall", SiteLogoSmall, { styles });

declare global {
  interface ComponentTypes {
    SiteLogo: typeof SiteLogoComponent;
    SiteLogoSmall: typeof SiteLogoSmallComponent;
  }
}
