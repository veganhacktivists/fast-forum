import React, { useRef, useState } from "react";
import { Components, registerComponent } from "../../../lib/vulcan-lib";
import InsertEmoticonOutlined from "@material-ui/icons/InsertEmoticon";
import { useNamesAttachedReactionsVoting } from "./NamesAttachedReactionsVoteOnComment";
import { VotingProps } from "../votingProps";
import { QuoteLocator } from "../../../lib/voting/namesAttachedReactions";

const styles = (theme: ThemeType): JssStyles => ({
  disabled: {
    opacity: 0.25,
  },
  palette: {
    fontFamily: theme.typography.commentStyle.fontFamily,
    backgroundColor: theme.palette.background.pageActiveAreaBackground,
    boxShadow: theme.shadows[2],
    paddingTop: 12,
    maxWidth: 350,
  },
});

const AddInlineReactionButton = ({
  voteProps,
  classes,
  quote,
  disabled,
}: {
  voteProps: VotingProps<VoteableTypeClient>;
  classes: ClassesType;
  quote: QuoteLocator | null;
  disabled?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLElement | null>(null);
  const { LWTooltip, ReactionsPalette } = Components;

  const { getCurrentUserReactionVote, toggleReaction } = useNamesAttachedReactionsVoting(voteProps);

  const handleOpen = () => {
    !disabled && setOpen(true);
  };

  const handleToggleReaction = (reaction: string, quote: QuoteLocator) => {
    setOpen(false);
    toggleReaction(reaction, quote);
  };

  return (
    <LWTooltip
      disabled={open}
      inlineBlock={false}
      title={
        <div>
          <p>Click to react to this comment snippet</p>
          {disabled && (
            <p>
              <em>
                You need to select a unique snippet.
                <br />
                Please select more text until the snippet is unique
              </em>
            </p>
          )}
        </div>
      }
    >
      <span ref={buttonRef}>
        {!open && <InsertEmoticonOutlined onClick={handleOpen} className={disabled ? classes.disabled : undefined} />}
        {open && (
          <div className={classes.palette}>
            <ReactionsPalette
              getCurrentUserReactionVote={getCurrentUserReactionVote}
              toggleReaction={handleToggleReaction}
              quote={quote}
            />
          </div>
        )}
      </span>
    </LWTooltip>
  );
};

const AddInlineReactionButtonComponent = registerComponent("AddInlineReactionButton", AddInlineReactionButton, {
  styles,
});

declare global {
  interface ComponentTypes {
    AddInlineReactionButton: typeof AddInlineReactionButtonComponent;
  }
}
