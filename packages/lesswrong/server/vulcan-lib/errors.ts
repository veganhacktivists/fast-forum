import { GraphQLError } from "graphql";

// UserInputError replacement for Apollo Server v4
export class UserInputError extends GraphQLError {
  constructor(message: string, options?: { extensions?: Record<string, any> }) {
    super(message, undefined, undefined, undefined, undefined, undefined, {
      code: 'BAD_USER_INPUT',
      ...options?.extensions,
    });
  }
}
import { Utils } from "../../lib/vulcan-lib";

/*

An error should have: 

- id: will be used as i18n key (note: available as `name` on the client)
- message: optionally, a plain-text message
- data: data/values to give more context to the error

*/
export const throwError = (error: { id: string; data: Record<string, any> }) => {
  const { id } = error;
  throw new UserInputError(id, error);
};

Utils.throwError = throwError;
