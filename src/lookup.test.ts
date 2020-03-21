import { lookupZip } from './lookup';
import validZipCodes from './data/valid-zips';

describe('get phone number by zip', () => {
  test('non-CA zip returns zip object without county, state w/ phone number', () => {
    const zip = lookupZip('11201');
    expect(zip?.state.code).toEqual('NY');
    expect(zip).toMatchSnapshot();
    expect(zip?.getCovidPhoneNumber()).toEqual(
      zip?.state.phoneNumber,
    );
  });

  test('CA zip returns zip object with county, state w/o phone number', () => {
    const zip = lookupZip('92811');
    expect(zip).toMatchSnapshot();
    expect(zip?.getCovidPhoneNumber()).toEqual(
      zip?.county?.phoneNumber,
    );
  });
});

test('all valid zip codes are matched', () => {
  const bad: string[] = [];

  for (const zipCode of validZipCodes) {
    const zip = lookupZip(zipCode);

    if (zip === null) {
      bad.push(zipCode);
    }
  }

  throw new Error(
    `These zip codes did not return results:\n${bad.join('\n')}`,
  );
});
