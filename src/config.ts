export const parseConfig = ({
  PORT = '9999',
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
}: {
  [key: string]: string | undefined;
}) => ({
  server: {
    port: PORT,
  },
  twilio: {
    accountSid: TWILIO_ACCOUNT_SID,
    authToken: TWILIO_AUTH_TOKEN,
  },
});
