import { getCovidLineWithZip } from './numbers';

describe('get phone number by zip', () => {
  test('returns number with +1 prepended if 10 digits', () => {
    const result = getCovidLineWithZip('11201');
    expect(result).toMatchSnapshot();
  });

  test('returns number as-is for non-10 digits', () => {
    const result = getCovidLineWithZip('06776');
    expect(result).toMatchSnapshot();
  });
});
