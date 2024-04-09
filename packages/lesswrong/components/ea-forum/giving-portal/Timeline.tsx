import React, { Fragment } from "react";
import { registerComponent } from "../../../lib/vulcan-lib";
import { useCurrentTime } from "../../../lib/utils/timeUtil";
import type { TimelineSpec } from "../../../lib/eaGivingSeason";
import classNames from "classnames";
import moment from "moment";
import { Link } from "../../../lib/reactRouterWrapper";

const formatDate = (date: Date) => moment.utc(date).format("MMM D");

const HEIGHT = 54;
const MARKER_SIZE = 12;
const DATE_WIDTH = 80;

const styles = (theme: ThemeType) => ({
  root: {
    position: "relative",
    width: "100%",
    height: HEIGHT,
    borderRadius: theme.borderRadius.default,
    backgroundColor: theme.palette.givingPortal[200],
    borderBottom: `2px solid ${theme.palette.givingPortal[1000]}`,
    fontFamily: theme.palette.fonts.sansSerifStack,
    marginBottom: 80,
    zIndex: 2,
  },
  date: {
    color: theme.palette.grey[1000],
    fontSize: 16,
    fontWeight: 700,
    lineHeight: "normal",
    letterSpacing: "-0.16px",
    textAlign: "center",
    whiteSpace: "nowrap",
    position: "absolute",
    top: HEIGHT + 11,
    width: DATE_WIDTH,
  },
  dateDescription: {
    color: theme.palette.givingPortal[1000],
    fontSize: 14,
    fontWeight: 600,
    whiteSpace: "break-spaces",
    maxWidth: 80,
  },
  dateMarker: {
    backgroundColor: theme.palette.givingPortal[1000],
    borderRadius: "50%",
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    position: "absolute",
    top: HEIGHT - MARKER_SIZE / 2,
    left: `calc(50% - ${MARKER_SIZE / 2}px)`,
    zIndex: 6,
  },
  span: {
    backgroundColor: theme.palette.givingPortal[800],
    color: theme.palette.givingPortal[1000],
    fontSize: 14,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "0 14px",
    position: "absolute",
    top: 0,
    height: "100%",
    zIndex: 4,
  },
  spanHatched: {
    background: `
      repeating-linear-gradient(
        110deg,
        ${theme.palette.givingPortal[900]},
        ${theme.palette.givingPortal[900]} 2px,
        ${theme.palette.givingPortal[200]} 2px,
        ${theme.palette.givingPortal[200]} 8px
      );
    `,
  },
  voteLink: {
    cursor: "pointer",
    "&:hover": {
      opacity: 0.5,
    },
  },
  spanDate: {
    width: "100%",
    left: 0,
  },
  currentMarker: {
    backgroundColor: theme.palette.givingPortal[1000],
    borderBottomLeftRadius: theme.borderRadius.default,
    opacity: 0.6,
    position: "absolute",
    bottom: 0,
    height: 8,
    zIndex: 5,
  },
});

const defaultDivisionToPercent = (division: number, divisions: number) => (division / divisions) * 100;

const formatSpanDates = (startDate: Date, endDate: Date) => {
  const start = moment.utc(startDate);
  const end = moment.utc(endDate);
  const startFormat = start.year() !== end.year() ? "MMM D YYYY" : "MMM D";
  const endFormat = start.month() !== end.month() ? "MMM D" : "D";
  return `${start.format(startFormat)} – ${end.format(endFormat)}`;
};

const Timeline = ({
  start,
  end,
  points,
  spans,
  divisionToPercent = defaultDivisionToPercent,
  className,
  classes,
}: TimelineSpec & {
  className?: string;
  classes: ClassesType;
}) => {
  const currentDate = useCurrentTime();
  const showCurrentDate = currentDate.getTime() > start.getTime() && currentDate.getTime() < end.getTime();

  const startMoment = moment.utc(start);
  const endMoment = moment.utc(end);
  const divisions = endMoment.diff(startMoment, "days");

  const getDatePercent = (date: Date) => {
    const dateMoment = moment.utc(date);
    const division = dateMoment.diff(startMoment, "days");
    const percent = divisionToPercent(division, divisions);
    return percent < 0 ? 0 : percent > 100 ? 100 : percent;
  };

  const positionDate = (date: Date) => {
    const percent = getDatePercent(date);
    const textAlign: "left" | "right" | undefined = percent < 5 ? "left" : percent > 95 ? "right" : undefined;
    return {
      className: classes.date,
      style: {
        textAlign,
        left: `
          min(
            max(
              calc(${percent}% - ${DATE_WIDTH / 2}px),
              0px
            ),
            calc(100% - ${DATE_WIDTH}px)
          )
        `,
      },
    };
  };

  const positionDateMarker = (date: Date) => ({
    className: classes.dateMarker,
    style: {
      left: `calc(${getDatePercent(date)}% - ${MARKER_SIZE / 2}px)`,
    },
  });

  const positionSpan = (start: Date, end: Date, consecutive?: boolean, hatched?: boolean) => {
    const startPercent = getDatePercent(start);
    const endPercent = getDatePercent(end);
    const endOffset = consecutive ? 1 : 0;
    const width = Math.max(endPercent - startPercent - endOffset, 2);
    return {
      className: classNames(classes.span, { [classes.spanHatched]: hatched }),
      style: {
        left: `${startPercent}%`,
        width: `${width}%`,
      },
    };
  };

  return (
    <div className={classNames(classes.root, className)}>
      {points.map(({ date, description }) => (
        <Fragment key={`${date}_${description}`}>
          <div {...positionDate(date)}>
            <div>{formatDate(date)}</div>
          </div>
          <div {...positionDateMarker(date)} />
        </Fragment>
      ))}
      {spans.map(({ start, end, description, href, consecutive, hideDates, hatched }) => (
        <div {...positionSpan(start, end, consecutive, hatched)} key={description}>
          {href ? <Link to={href}>{description}</Link> : description}
          {!hideDates && (
            <div className={classNames(classes.date, classes.spanDate)}>{formatSpanDates(start, end)}</div>
          )}
        </div>
      ))}
      {showCurrentDate && (
        <div className={classes.currentMarker} style={{ width: `${getDatePercent(currentDate)}%` }} />
      )}
    </div>
  );
};

const TimelineComponent = registerComponent("Timeline", Timeline, { styles, stylePriority: -1 });

declare global {
  interface ComponentTypes {
    Timeline: typeof TimelineComponent;
  }
}
