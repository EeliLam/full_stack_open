import patientData from '../../data/patients2';
import { Patient, PublicPatient, NewPatient, Entry, EntryWithoutId } from '../../types';
import { v1 as uuid } from 'uuid';

const getPatients = (): Patient[] => {
  return patientData;
};

const getPatientsPublic = (): PublicPatient[] => {
  return patientData.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const getPatient = (id: string): Patient | undefined => {
  return patientData.find(p => p.id === id);
};

const addPatient = (newPatient: NewPatient): Patient => {
  const patient = {
    id: uuid(),
    ...newPatient
  };

  patientData.push(patient);
  return patient;
};

const addEntry = (patient: Patient, newEntry: EntryWithoutId): Entry => {
  const entry: Entry = {
    id: uuid(),
    ...newEntry
  };

  patient.entries.push(entry);
  return entry;
};

export default { getPatients, getPatientsPublic, getPatient, addPatient, addEntry };