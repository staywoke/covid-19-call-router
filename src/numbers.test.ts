import { getCovidLineWithZip } from './numbers';

describe('get phone number by zip', () => {
  test('returns number for valid zip', () => {
    const result = getCovidLineWithZip('11201');
    expect(result).toMatchSnapshot();
  });
});
