import path from 'path';
import { Router, RequestHandler, Request } from 'express';
import bodyParser from 'body-parser';
import VoiceResponse from 'twilio/lib/twiml/VoiceResponse';
import { lookupZip } from './lookup';

const Responder = (
  handler: (twiml: VoiceResponse, inputs: Request['body']) => any,
): RequestHandler => {
  return (req, resp) => {
    const twiml = new VoiceResponse();
    handler(twiml, req.body);
    resp.type('xml').send(twiml.toString());
  };
};

const strings = {
  HELLO:
    'This service routes you to your local Covid 19 informational line.',
  ZIP_PROMPT: 'Please enter your 5-digit zipcode.',
  ZIP_NO_MATCH:
    'Sorry, we could not locate a phone number for that zip code.',
};

const paths = {
  HEALTH_CHECK: '/',
  HELLO: '/twilio/hello',
  ZIP_PROMPT: '/twilio/prompts/zipcode',
  ZIP_PROCESS: '/twilio/process/zipcode',
};

export const createRouter = (pathPrefix: string = '/'): Router => {
  const prefixed = (pathname: string): string => {
    return path.resolve(
      pathPrefix,
      ('./' + pathname).replace('//', '/'),
    );
  };

  return (
    Router()
      .use(bodyParser.urlencoded({ extended: true }))

      // Health check
      .get(paths.HEALTH_CHECK, (req, resp) => {
        resp.send('Hello!');
      })

      // Initial greeting
      .all(
        paths.HELLO,
        Responder(twiml => {
          twiml.say(strings.HELLO);
          twiml.redirect(prefixed(paths.ZIP_PROMPT));
        }),
      )

      // Ask for zip code
      .all(
        paths.ZIP_PROMPT,
        Responder(twiml => {
          twiml.say(strings.ZIP_PROMPT);
          twiml.gather({
            action: prefixed(paths.ZIP_PROCESS),
            numDigits: 5,
          });
        }),
      )

      // Process zip code and route
      .post(
        paths.ZIP_PROCESS,
        Responder((twiml, values) => {
          const zip = values.Digits;
          const result = lookupZip(zip);

          if (!result) {
            twiml.say(strings.ZIP_NO_MATCH);
            return;
          }

          const phoneNumber = result.getCovidPhoneNumber();

          if (!phoneNumber) {
            twiml.say(strings.ZIP_NO_MATCH);
            return;
          }

          twiml.say(
            `Connecting you to the ${result.county?.name || ''} ${
              result.state.name
            } line.`,
          );

          twiml.dial(phoneNumber);
        }),
      )
  );
};
