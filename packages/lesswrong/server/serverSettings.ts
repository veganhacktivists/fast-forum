import { DatabaseServerSetting } from "./databaseSettings";

export const mailchimpAPIKeySetting = new DatabaseServerSetting<string | null>(
  "mailchimp.apiKey",
  process.env.MAILCHIMP_API_KEY ?? null,
);
