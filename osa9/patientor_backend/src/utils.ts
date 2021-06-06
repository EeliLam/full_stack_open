import { NewPatient, Gender, Entry, EntryWithoutId, EntryType, HealthCheckRating, allowedEntryTypes } from '../types';

type Fields = {
  name: unknown,
  dateOfBirth: unknown,
  ssn: unknown,
  gender: unknown,
  occupation: unknown,
  entries: unknown[]
};

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

/*const isStringArray = (arr: unknown[]): arr is string[] => {
  return arr.every(t => isString(t));
};*/

const parseText = (text: unknown): string => {
  if (!text || !isString(text)) {
    throw new Error('Parameter missing or invalid' + text);
  }

  return text;
};

/*const parseTextArray = (arr: unknown[] | undefined): string[] => {
  if(!arr || !isStringArray(arr)) {
    throw new Error('Invalid text array: ' + arr);
  }
  return arr;
};*/

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
      throw new Error('Incorrect or missing date: ' + date);
  }
  return date;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (gender: any): gender is Gender => {
  return Object.values(Gender).includes(gender);
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error ('Invalid or missing gender: ' + gender);
  }
  return gender;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isEntryType = (type: any): type is EntryType => {
  return allowedEntryTypes.includes(type);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isEntryArray = (entries: any[]): entries is Entry[] => {
  return entries.every(e => isEntryType(e.type));
};

const parseEntries = (entries: unknown[]): Entry[] => {
  if (!entries || !isEntryArray(entries)) {
    throw new Error ('Invalid entry type(s):' + entries);
  }
  return entries;
};

const toNewPatient = ({ name, dateOfBirth, ssn, gender, occupation, entries }: Fields): NewPatient => {
  const newPatient = {
    name: parseText(name),
    dateOfBirth: parseDate(dateOfBirth),
    ssn: parseText(ssn),
    gender: parseGender(gender),
    occupation: parseText(occupation),
    entries: parseEntries(entries)
  };

  return newPatient;
};

const parseEntryType = (type: unknown): EntryType => {
  if (!type || !isEntryType(type)) {
    throw new Error('Invalid entry type:' + type);
  }
  return type;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isHealthCheckRating = (rating: any): rating is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(Number(rating));
};

const parseHealthCheckRating = (rating: unknown): HealthCheckRating => {
  if (typeof(rating) === 'undefined' || !isHealthCheckRating(rating)) {
    throw new Error ('Invalid or missing health check rating: ' + rating);
  }
  return rating;
};

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

type NewEntryFields = {
  date: unknown,
  description: unknown,
  specialist: unknown,
  type: unknown,
  diagnosisCodes?: string[],
  healthCheckRating?: HealthCheckRating,
  employerName?: unknown,
  sickLeave?: { startDate: string, endDate: string },
  discharge?: { date: string, criteria: string }
};

const toNewEntry = ({
  date,
  description,
  specialist,
  type,
  diagnosisCodes,
  healthCheckRating,
  employerName,
  sickLeave,
  discharge
}: NewEntryFields): EntryWithoutId => {
  const parsedType = parseEntryType(type);

  console.log(parsedType);
  console.log('parsing new entry');

  const newEntryBase = {
    date: parseDate(date),
    description: parseText(description),
    specialist: parseText(specialist),
    diagnosisCodes,
  };

  switch (parsedType) {
    case "Hospital":
      return {
        type: "Hospital",
        discharge,
        ...newEntryBase
      };
    case "HealthCheck":
      return {
        type: "HealthCheck",
        healthCheckRating: parseHealthCheckRating(healthCheckRating),
        ...newEntryBase
      };
    case "OccupationalHealthCare":
      return {
        type: "OccupationalHealthcare",
        employerName: parseText(employerName),
        sickLeave,
        ...newEntryBase
      };
    default:
      return assertNever(parsedType);
  }
};

export { toNewPatient, toNewEntry };