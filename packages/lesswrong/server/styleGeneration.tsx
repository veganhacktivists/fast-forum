import React from "react";
import ReactDOM from "react-dom/server";
// Adds selected MUI components to global styles.
// import './register-mui-styles';
import { importAllComponents, ComponentsTable } from "../lib/vulcan-lib/components";
import { withStyles } from "@material-ui/core/styles";
import { wrapWithMuiTheme } from "./material-ui/themeProvider";
import { addStaticRoute } from "./vulcan-lib/staticRoutes";
import filter from "lodash/filter";
import sortBy from "lodash/sortBy";
import crypto from "crypto"; //nodejs core library
import draftjsStyles from "../themes/globalStyles/draftjsStyles";
import miscStyles from "../themes/globalStyles/miscStyles";
import { isValidSerializedThemeOptions, ThemeOptions, getForumType } from "../themes/themeNames";
import type { ForumTypeString } from "../lib/instanceSettings";
import { getForumTheme } from "../themes/forumTheme";
import { usedMuiStyles } from "./usedMuiStyles";
import { minify } from "csso";
import { requestedCssVarsToString } from "../themes/cssVars";

const generateMergedStylesheet = (themeOptions: ThemeOptions): Buffer => {
  importAllComponents();

  const context: any = {};

  // Sort components by stylePriority, tiebroken by name (alphabetical)
  const componentsWithStyles = filter(
    Object.keys(ComponentsTable),
    (componentName) => ComponentsTable[componentName].options?.styles,
  ) as Array<string>;
  const componentsWithStylesByName = sortBy(componentsWithStyles, (n) => n);
  const componentsWithStylesByPriority = sortBy(
    componentsWithStylesByName,
    (componentName: string) => ComponentsTable[componentName].options?.stylePriority || 0,
  );

  const DummyComponent = (props: any) => <div />;
  const DummyTree = (
    <div>
      {Object.keys(usedMuiStyles).map((componentName: string) => {
        const StyledComponent = withStyles(usedMuiStyles[componentName], { name: componentName })(DummyComponent);
        return <StyledComponent key={componentName} />;
      })}
      {componentsWithStylesByPriority.map((componentName: string) => {
        const StyledComponent = withStyles(ComponentsTable[componentName].options?.styles, { name: componentName })(
          DummyComponent,
        );
        return <StyledComponent key={componentName} />;
      })}
    </div>
  );
  const WrappedTree = wrapWithMuiTheme(DummyTree, context, themeOptions);

  ReactDOM.renderToString(WrappedTree);
  const jssStylesheet = context.sheetsRegistry.toString();
  const theme = getForumTheme(themeOptions);
  const cssVars = requestedCssVarsToString(theme);

  const mergedCSS = [draftjsStyles(theme), miscStyles(theme), jssStylesheet, ...theme.rawCSS, cssVars].join("\n");

  const minifiedCSS = minify(mergedCSS).css;
  return Buffer.from(minifiedCSS, "utf8");
};

type StylesheetAndHash = {
  css: Buffer;
  hash: string;
};

const generateMergedStylesheetAndHash = (theme: ThemeOptions): StylesheetAndHash => {
  const stylesheet = generateMergedStylesheet(theme);
  const hash = crypto.createHash("sha256").update(stylesheet).digest("hex");
  return {
    css: stylesheet,
    hash: hash,
  };
};

// Serialized ThemeOptions (string) -> StylesheetAndHash
const mergedStylesheets: Partial<Record<string, StylesheetAndHash>> = {};

type ThemeKey = {
  name: UserThemeName;
  forumTheme: ForumTypeString;
};

type MergedStylesheet = { css: Buffer; url: string; hash: string };

export const getMergedStylesheet = (theme: ThemeOptions): MergedStylesheet => {
  const themeKeyData: ThemeKey = {
    name: theme.name,
    forumTheme: getForumType(theme),
  };
  const themeKey = JSON.stringify(themeKeyData);

  if (!mergedStylesheets[themeKey]) {
    mergedStylesheets[themeKey] = generateMergedStylesheetAndHash(theme);
  }
  const mergedStylesheet = mergedStylesheets[themeKey]!;

  return {
    css: mergedStylesheet.css,
    url: `/allStyles?hash=${mergedStylesheet.hash}&theme=${encodeURIComponent(JSON.stringify(theme))}`,
    hash: mergedStylesheet.hash,
  };
};

addStaticRoute("/allStyles", ({ query }, req, res, next) => {
  const expectedHash = query?.hash;
  const encodedThemeOptions = query?.theme;
  const serializedThemeOptions = decodeURIComponent(encodedThemeOptions);
  const validThemeOptions = isValidSerializedThemeOptions(serializedThemeOptions)
    ? JSON.parse(serializedThemeOptions)
    : { name: "default" };
  const { hash: stylesheetHash, css } = getMergedStylesheet(validThemeOptions);

  if (!expectedHash) {
    res.writeHead(302, {
      Location: `/allStyles?theme=${encodedThemeOptions}&hash=${stylesheetHash}`,
    });
    res.end("");
  } else if (expectedHash === stylesheetHash) {
    res.writeHead(200, {
      "Cache-Control": expectedHash ? "public, max-age=604800, immutable" : "public, max-age=604800",
      "Content-Type": "text/css; charset=utf-8",
    });
    res.end(css);
  } else {
    res.writeHead(404);
    res.end("");
  }
});
