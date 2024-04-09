import React from "react";
import { Components, registerComponent } from "../../lib/vulcan-lib";
import { ForumOptions, forumSelect } from "../../lib/forumTypeUtils";
import classNames from "classnames";
import { useCurrentUser } from "../common/withUser";
import type { CommentCancelCallback, CommentSuccessCallback } from "../comments/CommentsNewForm";
import { isFriendlyUI } from "../../themes/forumTheme";

const styles = (theme: ThemeType): JssStyles => ({
  root: {
    background: theme.palette.panelBackground.default,
    border: theme.palette.border.commentBorder,
    borderRadius: 3,
    marginBottom: 32,
  },
  close: {
    position: "absolute",
    right: 20,
    cursor: "pointer",
    "& svg": {
      color: theme.palette.grey[600],
      width: 20,
    },
  },
  newQuickTake: {
    fontFamily: theme.palette.fonts.sansSerifStack,
    fontWeight: 700,
    fontSize: 20,
    color: theme.palette.grey[1000],
    margin: 20,
  },
  quickTakesRoot: {
    background: "transparent",
    padding: 0,
    border: "none",
  },
  quickTakesEditor: {
    background: "transparent",
    padding: "10px 20px",
  },
  quickTakesTags: {
    padding: "0 20px",
  },
  quickTakesButton: {
    marginTop: 20,
    padding: 20,
    borderTop: `1px solid ${theme.palette.grey[300]}`,
  },
});

const forumHintText: ForumOptions<string> = {
  LessWrong:
    "Write your thoughts here! What have you been thinking about?\nExploratory, draft-stage, rough, and rambly thoughts are all welcome on Shortform.",
  AlignmentForum:
    "Write your thoughts here! What have you been thinking about?\nExploratory, draft-stage, rough, and rambly thoughts are all welcome on Shortform.",
  EAForum:
    "Write your brief or quickly written post here.\nExploratory, draft-stage, rough, and off-the-cuff thoughts are all welcome in quick takes.",
  default:
    "Write your brief or quickly written post here.\nExploratory, draft-stage, rough, and off-the-cuff thoughts are all welcome on Shortform.",
};

const ShortformSubmitForm = ({
  successCallback,
  cancelCallback,
  prefilledProps,
  noDefaultStyles,
  className,
  classes,
}: {
  successCallback?: CommentSuccessCallback;
  cancelCallback?: CommentCancelCallback;
  prefilledProps?: any;
  noDefaultStyles?: boolean;
  className?: string;
  classes: ClassesType;
}) => {
  const currentUser = useCurrentUser();
  const { CommentsNewForm, QuickTakesEntry, ForumIcon } = Components;

  if (isFriendlyUI) {
    return (
      <div className={className}>
        <div className={classes.close} onClick={cancelCallback}>
          <ForumIcon icon="Close" />
        </div>
        <div className={classes.newQuickTake}>New quick take</div>
        <QuickTakesEntry
          currentUser={currentUser}
          className={classes.quickTakesRoot}
          editorClassName={classes.quickTakesEditor}
          tagsClassName={classes.quickTakesTags}
          buttonClassName={classes.quickTakesButton}
          successCallback={successCallback}
          cancelCallback={cancelCallback}
          defaultExpanded
          defaultFocus
          submitButtonAtBottom
        />
      </div>
    );
  }

  return (
    <div className={classNames(className, { [classes.root]: !noDefaultStyles })}>
      <CommentsNewForm
        prefilledProps={{
          ...prefilledProps,
          shortform: true,
        }}
        successCallback={successCallback}
        cancelCallback={cancelCallback}
        // Put in "reply" to make the cancel button appear
        type={cancelCallback ? "reply" : "comment"}
        formProps={{
          editorHintText: forumSelect(forumHintText),
        }}
      />
    </div>
  );
};

const ShortformSubmitFormComponent = registerComponent("ShortformSubmitForm", ShortformSubmitForm, { styles });

declare global {
  interface ComponentTypes {
    ShortformSubmitForm: typeof ShortformSubmitFormComponent;
  }
}
