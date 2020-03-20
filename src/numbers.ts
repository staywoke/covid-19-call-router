import zipcodes from 'zipcodes';

export const getCovidLineWithZip = (
  zip: string,
): {
  zip: string;
  phoneNumber: string;
  state: {
    code: string;
    name: string;
  };
} | null => {
  const location = zipcodes.lookup(zip);

  if (!location) {
    return null;
  }

  const stateName = stateDict[location.state];

  if (!stateName) {
    return null;
  }

  const phoneNumber = numbers[stateName.toUpperCase()];

  if (!phoneNumber) {
    return null;
  }

  return {
    zip,
    phoneNumber,
    state: {
      code: location.state,
      name: stateName,
    },
  };
};

// Directly exported from spreadsheet:
const data = `
  Alabama	(808) 295-6453
  Alaska	(833) 613-7000
  Arizona	(508) 978-8607
  Arkansas	(410) 358-9943
  California	(518) 952-2714
  Colorado	(517) 302-3535
  Connecticut	(368) 649-1635
  Delaware	(771) 853-2558
  Florida	(463) 206-5982
  Georgia	(387) 810-2172
  Hawaii	(574) 377-1549
  Idaho	(505) 418-3373
  Illinois  (699) 684-7081
  Indiana 
  Iowa	(492) 940-7353
  Kansas	(785) 454-9272
  Kentucky	(374) 405-9407
  Louisiana	(966) 760-9095
  Maine	(560) 539-4718
  Maryland	(986) 670-0635
  Massachusetts	(917) 520-3549
  Michigan	(890) 815-5157
  Minnesota	(841) 454-3175
  Mississippi	(413) 444-0335
  Missouri	(835) 368-9521
  Montana	(552) 838-7108
  Nebraska	(248) 573-3925
  Nevada	(716) 289-4752
  New Hampshire	(248) 573-3925
  New Jersey	(429) 790-3739
  New Mexico	(723) 936-5126
  New York	(649) 433-3480
  North Carolina	(252) 732-7500
  North Dakota	(324) 761-7224
  Ohio	(726) 632-4474
  Oklahoma	(333) 559-6873
  Oregon	(768) 764-3099
  Pennsylvania	(720) 501-1796
  Rhode Island	(720) 501-1796
  South Carolina	(658) 255-2843
  South Dakota	(681) 468-1104
  Tennessee	(612) 445-4699
  Texas	(205) 606-5809
  Utah	(208) 657-0617
  Vermont	(566) 875-8000
  Virginia	(453) 522-2639
  Washington	(232) 371-1604
  West Virginia	(735) 528-4293
  Wisconsin	(668) 319-7615
  Wyoming	(294) 360-9938
`;

const numbers: {
  [key: string]: string;
} = data
  .trim()
  .split('\n')
  .reduce((dict, line) => {
    const [state, number] = line.trim().split('\t');
    return {
      ...dict,
      [state.toUpperCase()]:
        number && '+1' + number.replace(/[^0-9]/g, ''),
    };
  }, {});

export const stateDict: {
  [key: string]: string;
} = {
  AL: 'Alabama',
  AK: 'Alaska',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming',
};
