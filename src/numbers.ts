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
  // Find location of zip
  const location = zipcodes.lookup(zip);

  if (!location) {
    return null;
  }

  // Map state code to state name
  const stateName = stateDict[location.state];

  if (!stateName) {
    return null;
  }

  // Map state name to phone number
  const phoneNumber = numbers[stateName.toUpperCase()];

  if (!phoneNumber) {
    return null;
  }

  // Return the result
  return {
    zip,
    phoneNumber:
      phoneNumber.length === 10 ? `+1${phoneNumber}` : phoneNumber,
    state: {
      code: location.state,
      name: stateName,
    },
  };
};

// Directly exported from spreadsheet:
const data = `
Alabama	(888) 264-2256
Alaska	
Arizona	(844) 542-8201 
Arkansas	(800) 803-7847 
California	
Colorado	(877) 462-2911
Connecticut	(800) 203-1234
Delaware	(866) 408-1899
Florida	(866) 779-6121
Georgia	(844) 442-2681 
Hawaii	(877) 275-6569
Idaho	
Illinois	(800) 889-3931 
Iowa	(800) 244-7431
Indiana	(877) 826-0011 
Kansas	(866) 534-3463
Kentucky	(800) 722-5725
Louisiana	(844) 268-6799
Maine	(877) 463-6207
Maryland	
Massachusetts	(877)  211-6277
Michigan	(888) 535-6136
Minnesota	(651) 201-3920 
Mississippi	(877) 978-6453
Missouri	(877) 435-8411
Montana	(888) 333-0461
Nebraska	(402) 552-6645
Nevada	(702) 759-4636
New Hampshire	
New Jersey	(800) 222-1222
New Mexico	(855) 600-3453
New York	(888) 364-3065
North Carolina	(888) 892-1162
North Dakota	(866) 207-2880
Ohio	(833).427-5634
Oklahoma	(877) 215-8336
Oregon	(866) 698-6155
Pennsylvania	(877) 724‐3258
Rhode Island	(401) 222-8022
South Carolina	(855) 472-3432
South Dakota	(800) 997-2880
Tennessee	(877) 857-2945
Texas	(877) 541-7905
Utah	(800) 456-7707
Vermont	(866) 652-4636 
Virginia	(877) 275-8343
Washington	(800) 525-0127
West Virginia	(800) 887-4304
Wisconsin	
Wyoming	
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
      [state.toUpperCase()]: number && number.replace(/[^0-9]/g, ''),
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
