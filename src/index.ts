import express from 'express';
import bodyParser from 'body-parser';
import makeServerless from 'serverless-http';
import VoiceResponse from 'twilio/lib/twiml/VoiceResponse';
import { getCovidLineWithZip } from './numbers';
import { parseConfig } from './config';

const strings = {
  HELLO:
    'This service routes you to your local Covid 19 informational line.',
  ZIP_PROMPT: 'Please enter your 5-digit zipcode.',
  ZIP_NO_MATCH:
    'Sorry, we could not locate a phone number for that zip code.',
};

const paths = {
  HELLO: '/twilio/hello',
  ZIP_PROMPT: '/twilio/prompts/zipcode',
  ZIP_PROCESS: '/twilio/process/zipcode',
};

const config = parseConfig(process.env);

const Responder = (
  handler: (
    twiml: VoiceResponse,
    inputs: express.Request['body'],
  ) => any,
): express.RequestHandler => {
  return (req, resp) => {
    const twiml = new VoiceResponse();
    handler(twiml, req.body);
    resp.type('xml').send(twiml.toString());
  };
};

const app = express();
export const serverless = makeServerless(app);

app.use(bodyParser.urlencoded({ extended: true }));

app.post(
  paths.HELLO,
  Responder(twiml => {
    twiml.say(strings.HELLO);
    twiml.redirect(paths.ZIP_PROMPT);
  }),
);

app.post(
  paths.ZIP_PROMPT,
  Responder(twiml => {
    twiml.say(strings.ZIP_PROMPT);
    twiml.gather({
      action: paths.ZIP_PROCESS,
      numDigits: 5,
    });
  }),
);

app.post(
  paths.ZIP_PROCESS,
  Responder((twiml, values) => {
    const zip = values.Digits;
    const result = getCovidLineWithZip(zip);

    if (!result) {
      twiml.say(strings.ZIP_NO_MATCH);
      return;
    }

    twiml.say(`Connecting you to the ${result.state.name} line.`);
    twiml.dial(result.phoneNumber);
  }),
);

app.listen(config.server.port);
console.log(`Listening on port ${config.server.port}`);
