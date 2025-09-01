<<<<<<< HEAD
import { getSiteUrl } from "../../lib/vulcan-lib/utils";
import { EmailTokens } from "../../lib/collections/emailTokens/collection";
import { randomSecret } from "../../lib/random";
import Users from "../../lib/collections/users/collection";
import { addGraphQLMutation, addGraphQLQuery, addGraphQLResolvers } from "../../lib/vulcan-lib/graphql";
import { updateMutator } from "../vulcan-lib/mutators";
import { siteNameWithArticleSetting } from "../../lib/instanceSettings";

let emailTokenTypesByName: Partial<Record<string, EmailTokenType>> = {};

export class EmailTokenType {
  name: string;
  onUseAction: (user: DbUser, params: any, args: any) => any;
  resultComponentName: string;
  reusable: boolean;
  path: string;

  constructor({
    name,
    onUseAction,
    resultComponentName,
    reusable = false,
    path = "emailToken",
  }: {
    name: string;
    onUseAction: (user: DbUser, params: any, args: any) => any;
    resultComponentName: keyof ComponentTypes;
    reusable?: boolean;
    path?: string;
  }) {
    if (!name || !onUseAction || !resultComponentName) throw new Error("EmailTokenType: missing required argument");
    if (name in emailTokenTypesByName) throw new Error("EmailTokenType: name must be unique");

=======
import { getSiteUrl } from '../../lib/vulcan-lib/utils';
import { EmailTokens } from '../../server/collections/emailTokens/collection';
import { randomSecret } from '../../lib/random';
import Users from '../../server/collections/users/collection';
import { siteNameWithArticleSetting } from '../../lib/instanceSettings';
import gql from 'graphql-tag';
import { createAnonymousContext } from "@/server/vulcan-lib/createContexts";
import { updateEmailToken } from '../collections/emailTokens/mutations';
import { updateUser } from '../collections/users/mutations';
import { EmailTokenResult } from '@/components/users/EmailTokenResult';
import { userEmailAddressIsVerified } from '@/lib/collections/users/helpers';
import UsersRepo from '../repos/UsersRepo';
import { createPasswordHash, validatePassword } from '../vulcan-lib/apollo-server/passwordHelpers';

const emailTokenResultComponents = {
  EmailTokenResult,
};

export type EmailTokenResultComponentName = keyof typeof emailTokenResultComponents;

export class EmailTokenType<T extends EmailTokenResultComponentName> {
  name: DbEmailTokens['tokenType']
  onUseAction: (user: DbUser, params: any, args: any) => Promise<ComponentProps<typeof emailTokenResultComponents[T]>>
  resultComponentName: T
  reusable: boolean
  path: string
  
  constructor({ name, onUseAction, resultComponentName, reusable=false, path = "emailToken" }: {
    name: DbEmailTokens['tokenType'],
    onUseAction: (user: DbUser, params: any, args: any) => Promise<ComponentProps<typeof emailTokenResultComponents[T]>>,
    resultComponentName: T,
    reusable?: boolean,
    path?: string,
  }) {
    if(!name || !onUseAction || !resultComponentName)
      throw new Error("EmailTokenType: missing required argument");
    
>>>>>>> base/master
    this.name = name;
    this.onUseAction = onUseAction;
    this.resultComponentName = resultComponentName;
    this.reusable = reusable;
    this.path = path;
  }

  generateToken = async (userId: string) => {
    if (!userId) throw new Error("Missing required argument: userId");

    const token = randomSecret();
    await EmailTokens.rawInsert({
      token: token,
      tokenType: this.name,
      userId: userId,
      usedAt: null,
    });
    return token;
  };

  generateLink = async (userId: string) => {
    if (!userId) throw new Error("Missing required argument: userId");

    const token = await this.generateToken(userId);
    const prefix = getSiteUrl().slice(0, -1);
    return `${prefix}/${this.path}/${token}`;
  };

  handleToken = async (token: DbEmailTokens, args: any) => {
    const user = await Users.findOne({ _id: token.userId });
    if (!user) throw new Error(`Invalid userId on email token ${token._id}`);
    const actionResult = await this.onUseAction(user, token.params, args);
    return {
      componentName: this.resultComponentName,
      props: { ...actionResult },
    };
  };
}

<<<<<<< HEAD
async function getAndValidateToken(token: string): Promise<{ tokenObj: DbEmailTokens; tokenType: EmailTokenType }> {
=======
export type UseEmailTokenResult = Awaited<ReturnType<EmailTokenType<EmailTokenResultComponentName>['handleToken']>>;

async function getAndValidateToken(token: string) {
>>>>>>> base/master
  const results = await EmailTokens.find({ token }).fetch();
  if (results.length !== 1) throw new Error("Invalid email token");
  const tokenObj = results[0];

  const tokenType = emailTokenTypesByName[tokenObj.tokenType];
  if (!tokenType) throw new Error("Email token has invalid type");

  if (tokenObj.usedAt && !tokenType.reusable) throw new Error("This email link has already been used.");

  return { tokenObj, tokenType };
}

<<<<<<< HEAD
addGraphQLMutation("useEmailToken(token: String, args: JSON): JSON");
addGraphQLQuery("getTokenParams(token: String): JSON");
addGraphQLResolvers({
  Mutation: {
    async useEmailToken(root: void, { token, args }: { token: string; args: any }, context: ResolverContext) {
=======
export const emailTokensGraphQLTypeDefs = gql`
  extend type Mutation {
    useEmailToken(token: String, args: JSON): JSON
  }
`

export const emailTokensGraphQLMutations = {
  async useEmailToken(root: void, {token, args}: {token: string, args: any}, context: ResolverContext) {
>>>>>>> base/master
      try {
        const { tokenObj, tokenType } = await getAndValidateToken(token);

        const resultProps = await tokenType.handleToken(tokenObj, args);
<<<<<<< HEAD
        await updateMutator({
          collection: EmailTokens,
          documentId: tokenObj._id,
          set: {
            usedAt: new Date(),
          },
          unset: {},
          validate: false,
        });

=======
        await updateEmailToken({
          data: { usedAt: new Date() },
          selector: { _id: tokenObj._id }
        }, context);
        
>>>>>>> base/master
        return resultProps;
      } catch (e) {
        //eslint-disable-next-line no-console
        console.error(`error when using email token: `, e);
        return {
          componentName: "EmailTokenResult",
          props: {
            message: e.message,
          },
        };
      }
<<<<<<< HEAD
    },
  },
});

export const UnsubscribeAllToken = new EmailTokenType({
  name: "unsubscribeAll",
  onUseAction: async (user: DbUser) => {
    await updateMutator({
      // FIXME: Doesn't actually do the thing
      collection: Users,
      documentId: user._id,
      set: {
        unsubscribeFromAll: true,
      },
      unset: {},
      validate: false,
    });
    return { message: `You have been unsubscribed from all emails on ${siteNameWithArticleSetting.get()}.` };
  },
  resultComponentName: "EmailTokenResult",
});
=======
    }
};

export const emailTokenTypesByName = {
  unsubscribeAll: new EmailTokenType({
    name: "unsubscribeAll",
    onUseAction: async (user: DbUser) => {
      await updateUser({
        data: { unsubscribeFromAll: true },
        selector: { _id: user._id }
      }, createAnonymousContext());
      return {message: `You have been unsubscribed from all emails on ${siteNameWithArticleSetting.get()}.` };
    },
    resultComponentName: "EmailTokenResult",
  }),

  verifyEmail: new EmailTokenType({
    name: "verifyEmail",
    onUseAction: async (user) => {
      if (userEmailAddressIsVerified(user)) return {message: "Your email address is already verified"}
      await new UsersRepo().verifyEmail(user._id);
      return {message: "Your email has been verified" };
    },
    resultComponentName: "EmailTokenResult"
  }),
  
  resetPassword: new EmailTokenType({
    name: "resetPassword",
    onUseAction: async (user, params, args) => {
      if (!args) throw Error("Using a reset-password token requires providing a new password")
      const { password } = args
      const validatePasswordResponse = validatePassword(password)
      if (!validatePasswordResponse.validPassword) throw Error(validatePasswordResponse.reason)

      await new UsersRepo().resetPassword(user._id, await createPasswordHash(password));
      return {message: "Your new password has been set. Try logging in again." };
    },
    resultComponentName: "EmailTokenResult",
    path: "resetPassword" // Defined in routes.ts
  }),
} satisfies Record<DbEmailTokens['tokenType'], EmailTokenType<EmailTokenResultComponentName>>;
>>>>>>> base/master
