import zipcodes from 'zipcodes';
import statesCsv from './data/states.csv';
import caZipCodeCountiesCsv from './data/ca-zipcode-counties.csv';
import caCountryNumbersCsv from './data/ca-county-numbers.csv';

export interface State {
  name: string;
  code: string;
  phoneNumber?: string;
}

export interface County {
  name: string;
  phoneNumber?: string;
}

export interface Zip {
  code: string;
  state: State;
  county?: County;
  getCovidPhoneNumber: () => string | null;
}

const CALIFORNIA: State = {
  code: 'CA',
  name: 'California',
};

export const lookupZip = (code: string): Zip | null => {
  // Find location of zip
  const location = zipcodes.lookup(code);

  if (!location) {
    return null;
  }

  if (location.state === CALIFORNIA.code) {
    return (
      caZips.find(caZip => {
        const pattern = new RegExp(caZip.code);
        return pattern.test(code);
      }) || null
    );
  }

  const state = states.find(
    state => state.code === location.state,
  ) as State;

  return {
    code,
    state,
    getCovidPhoneNumber: () => {
      return state.phoneNumber as string;
    },
  };
};

export const normalizePhoneNumber = (
  phoneNumber: string,
): string | undefined => {
  return phoneNumber
    ? '+1' + phoneNumber.replace(/[^0-9]/g, '')
    : undefined;
};

export const parseCsv = <T>(
  csv: string,
  mapRow: (row: string[]) => T,
): T[] => {
  return csv
    .trim()
    .split('\n')
    .map(line => mapRow(line.trim().split('\t')));
};

export const caCounties = parseCsv<County>(
  caCountryNumbersCsv,
  ([name, phoneNumber]): County => ({
    name: name.toUpperCase(),
    phoneNumber: normalizePhoneNumber(phoneNumber),
  }),
);

export const caZips = parseCsv<Zip>(
  caZipCodeCountiesCsv,
  ([code, countyName]): Zip => {
    const county = caCounties.find(county => {
      return county.name === countyName;
    });

    return {
      code,
      county,
      state: CALIFORNIA,
      getCovidPhoneNumber: () => {
        return county?.phoneNumber || null;
      },
    };
  },
);

export const states = parseCsv<State>(
  statesCsv,
  ([name, code, phoneNumber]) => ({
    name,
    code,
    phoneNumber: normalizePhoneNumber(phoneNumber),
  }),
);
