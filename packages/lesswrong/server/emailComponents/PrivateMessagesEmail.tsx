<<<<<<< HEAD
import React from "react";
import { registerComponent, Components } from "../../lib/vulcan-lib/components";
import { conversationGetPageUrl } from "../../lib/collections/conversations/helpers";
import { useCurrentUser } from "../../components/common/withUser";
import * as _ from "underscore";
import "./EmailUsername";
import "./EmailFormatDate";
import "./EmailContentItemBody";
import { siteNameWithArticleSetting } from "../../lib/instanceSettings";

const styles = (theme: ThemeType): JssStyles => ({
  message: {},
});

const PrivateMessagesEmail = ({
  conversations,
  messages,
  participantsById,
  classes,
}: {
  conversations: Array<DbConversation>;
  messages: Array<DbMessage>;
  participantsById: Record<string, DbUser>;
  classes: ClassesType;
=======
import React from 'react';
import { conversationGetPageUrl } from '../../lib/collections/conversations/helpers';
import { useCurrentUser } from '../../components/common/withUser';
import * as _ from 'underscore';
import { siteNameWithArticleSetting } from '../../lib/instanceSettings';
import { defineStyles, useStyles } from '@/components/hooks/useStyles';
import { EmailUsername } from './EmailUsername';
import { EmailFormatDate } from './EmailFormatDate';
import { EmailContentItemBody } from './EmailContentItemBody';

const styles = defineStyles("PriveMessagesEmail", (theme: ThemeType) => ({
  message: {
  },
}));

export const PrivateMessagesEmail = ({conversations, messages, participantsById}: {
  conversations: Array<DbConversation>,
  messages: Array<DbMessage>,
  participantsById: Record<string,DbUser>,
>>>>>>> base/master
}) => {
  const classes = useStyles(styles);
  if (conversations.length === 1) {
<<<<<<< HEAD
    return (
      <React.Fragment>
        <p>You received {messages.length > 1 ? "private messages" : "a private message"}.</p>
        <Components.PrivateMessagesEmailConversation
          conversation={conversations[0]}
          messages={messages}
          participantsById={participantsById}
        />
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <p>
          You received {messages.length} private messages in {conversations.length} conversations.
        </p>
        {conversations.map((conv) => (
          <Components.PrivateMessagesEmailConversation
            conversation={conv}
            key={conv._id}
            messages={_.filter(messages, (message) => message.conversationId === conv._id)}
            participantsById={participantsById}
          />
        ))}
      </React.Fragment>
    );
  }
};
const PrivateMessagesEmailComponent = registerComponent("PrivateMessagesEmail", PrivateMessagesEmail);

/// A list of users, nicely rendered with links, comma separators and an "and"
/// conjunction between the last two (if there are at least two).
const EmailListOfUsers = ({ users }: { users: Array<DbUser> }) => {
  const { EmailUsername } = Components;

=======
    return <React.Fragment>
      <p>
        You received {messages.length>1 ? "private messages" : "a private message"}.
      </p>
      <PrivateMessagesEmailConversation
        conversation={conversations[0]}
        messages={messages}
        participantsById={participantsById}
      />
    </React.Fragment>
  } else {
    return <React.Fragment>
      <p>
        You received {messages.length} private messages in {conversations.length} conversations.
      </p>
      {conversations.map(conv => <PrivateMessagesEmailConversation
        conversation={conv}
        key={conv._id}
        messages={_.filter(messages, message=>message.conversationId===conv._id)}
        participantsById={participantsById}
      />)}
    </React.Fragment>
  }
}

/// A list of users, nicely rendered with links, comma separators and an "and"
/// conjunction between the last two (if there are at least two).
export const EmailListOfUsers = ({users}: {
  users: Array<DbUser>
}) => {
>>>>>>> base/master
  if (users.length === 0) {
    return <span>nobody</span>;
  } else if (users.length === 1) {
    return <EmailUsername user={users[0]} />;
  } else {
<<<<<<< HEAD
    let result: Array<string | JSX.Element> = [];
    for (let i = 0; i < users.length; i++) {
      if (i === users.length - 1) result.push(" and ");
      else if (i > 0) result.push(", ");
      result.push(<EmailUsername user={users[i]} />);
    }
    return <span>{result}</span>;
  }
};
const EmailListOfUsersComponent = registerComponent("EmailListOfUsers", EmailListOfUsers);

const PrivateMessagesEmailConversation = ({
  conversation,
  messages,
  participantsById,
  classes,
}: {
  conversation: ConversationsList | DbConversation;
  messages: Array<DbMessage>;
  participantsById: Partial<Record<string, DbUser>>;
  classes: ClassesType;
=======
    let result: Array<string|React.JSX.Element> = [];
    for (let i=0; i<users.length; i++) {
      if (i===users.length-1) result.push(" and ");
      else if (i>0) result.push(", ");
      result.push(<EmailUsername user={users[i]}/>);
    }
    return <span>{result}</span>;
  }
}

export const PrivateMessagesEmailConversation = ({conversation, messages, participantsById}: {
  conversation: ConversationsList|DbConversation,
  messages: Array<DbMessage>,
  participantsById: Partial<Record<string,DbUser>>,
>>>>>>> base/master
}) => {
  const classes = useStyles(styles);
  const currentUser = useCurrentUser();
<<<<<<< HEAD
  const { EmailUsername, EmailListOfUsers, EmailFormatDate, EmailContentItemBody } = Components;
  const sitename = siteNameWithArticleSetting.get();
  const conversationLink = conversationGetPageUrl(conversation, true);

  return (
    <React.Fragment>
      <p>
        Conversation with{" "}
        <EmailListOfUsers
          users={conversation.participantIds
            .filter((id: string) => id !== currentUser!._id)
            .map((id: string) => participantsById[id]!)}
        />
      </p>
      <p>
        <a href={conversationLink}>View this conversation on {sitename}</a>.
      </p>

      {messages.map((message, i) => (
        <div className={classes.message} key={i}>
          <EmailUsername user={participantsById[message.userId]!} /> <EmailFormatDate date={message.createdAt} />
          <EmailContentItemBody dangerouslySetInnerHTML={{ __html: message.contents.html }} />
        </div>
      ))}
    </React.Fragment>
  );
};

const PrivateMessagesEmailConversationComponent = registerComponent(
  "PrivateMessagesEmailConversation",
  PrivateMessagesEmailConversation,
  { styles },
);

declare global {
  interface ComponentTypes {
    PrivateMessagesEmail: typeof PrivateMessagesEmailComponent;
    EmailListOfUsers: typeof EmailListOfUsersComponent;
    PrivateMessagesEmailConversation: typeof PrivateMessagesEmailConversationComponent;
  }
=======
  const sitename = siteNameWithArticleSetting.get()
  const conversationLink = conversationGetPageUrl(conversation, true);

  const participantIds = conversation.participantIds ?? [];
  
  return (<React.Fragment>
    <p>Conversation with{" "}
      <EmailListOfUsers
        users={participantIds
          .filter((id: string)=>id!==currentUser!._id)
          .map((id: string)=>participantsById[id]!)
        }
      />
    </p>
    <p><a href={conversationLink}>View this conversation on {sitename}</a>.</p>
    
    {messages.map((message,i) => <div className={classes.message} key={i}>
      <EmailUsername user={participantsById[message.userId]!}/>
      {" "}<EmailFormatDate date={message.createdAt}/>
      <EmailContentItemBody dangerouslySetInnerHTML={{
        __html: message.contents?.html ?? "",
      }}/>
    </div>)}
  </React.Fragment>);
>>>>>>> base/master
}
