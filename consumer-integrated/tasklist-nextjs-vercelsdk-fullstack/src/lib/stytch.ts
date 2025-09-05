import * as stytch from "stytch";

export const stytchClient = new stytch.Client({
  project_id: process.env.STYTCH_PROJECT_ID as string,
  secret: process.env.STYTCH_PROJECT_SECRET as string,
  custom_base_url: process.env.STYTCH_DOMAIN,
});