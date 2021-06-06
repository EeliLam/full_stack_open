export interface Diagnose {
  code: string,
  name: string,
  latin?: string
}

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other'
}

interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnose['code']>;
}

export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3
}

/*export enum EntryType {
  "HealthCheck",
  "OccupationalHealthcare",
  "Hospital"
}*/

export type EntryType = "HealthCheck" | "OccupationalHealthCare" | "Hospital";

export const allowedEntryTypes = ["HealthCheck", "OccupationalHealthCare", "Hospital"];

interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating: HealthCheckRating;
}

interface OccupationalHealthcareEntry extends BaseEntry {
  type: "OccupationalHealthcare";
  employerName: string;
  sickLeave?: {
    startDate: string;
    endDate: string
  }
}

interface HospitalEntry extends BaseEntry {
  type: "Hospital";
  discharge?: {
    date: string;
    criteria: string
  }
}

export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;

// Define special omit for unions
type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;
// Define Entry without the 'id' property
export type EntryWithoutId = UnionOmit<Entry, 'id'>;

export interface Patient {
  id: string,
  name: string,
  dateOfBirth: string,
  ssn: string,
  gender: Gender,
  occupation: string,
  entries: Entry[]
}

export type PublicPatient = Omit<Patient, 'ssn' | 'entries'>;

export type PatientWithoutSSN = Omit<Patient, 'ssn'>;

export type NewPatient = Omit<Patient, 'id'>;