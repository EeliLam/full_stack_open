import React from "react";
import { useParams } from "react-router-dom";
import { Icon, List, Button } from "semantic-ui-react";
import axios from "axios";

import { useStateValue, addPatient, addEntry } from "../state";
import { apiBaseUrl } from "../constants";
import {
  Patient,
  Entry,
  HospitalEntry,
  OccupationalHealthcareEntry,
  HealthCheckEntry,
  EntryWithoutId,
} from "../types";
import AddEntryModal from "../AddEntryModal";

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const HospitalEntryDetails = ({ entry }: { entry: HospitalEntry }) => {
  const [{ diagnoses }, ] = useStateValue();

  return (
    <List.Item>
      <List.Icon name="hospital" size="big" />
      <List.Content>
        <List.Header>{entry.date}</List.Header>
        <List.Header>Diagnoses:</List.Header>
        <ul>
          {entry.diagnosisCodes?.map(code => <li key={code}>{code} {diagnoses[code]?.name}</li>)}
        </ul>
        <List.Description>{entry.description}</List.Description>
        <List.Description>
          {entry.discharge &&
            <div>
              Discharged on {entry.discharge.date} due to criteria: {entry.discharge.criteria}
            </div>
          }
        </List.Description>
      </List.Content>
    </List.Item>
  );
};

const OccupationalHealthcareEntryDetails = ({ entry }: { entry: OccupationalHealthcareEntry }) => {
  const [{ diagnoses }, ] = useStateValue();

  return (
    <List.Item>
      <List.Icon name="stethoscope" size="big" />
      <List.Content>
        <List.Header>{entry.date}</List.Header>
        <List.Header>Employer: {entry.employerName}</List.Header>
        <List.Header>Diagnoses:</List.Header>
        <ul>
          {entry.diagnosisCodes?.map(code => <li key={code}>{code} {diagnoses[code]?.name}</li>)}
        </ul>
        <List.Description>{entry.description}</List.Description>
        <List.Description>
          {entry.sickLeave &&
            <div>
              Sickleave from {entry.sickLeave.startDate} to {entry.sickLeave.endDate}.
            </div>
          }
        </List.Description>
      </List.Content>
    </List.Item>
  );
};

const HealthCheckEntryDetails = ({ entry }: { entry: HealthCheckEntry }) => {
  const [{ diagnoses }, ] = useStateValue();

  // I couldn't figure out a better way
  const healthCheckRatingColor = entry.healthCheckRating === 0 ? "green" : (
    entry.healthCheckRating === 1 ? "yellow" : (
      entry.healthCheckRating === 2 ? "orange" : "red"
    )
  );

  return (
    <List.Item>
      <List.Icon name="user md" size="big" />
      <List.Content>
        <List.Header>{entry.date}</List.Header>
        <List.Header>Diagnoses:</List.Header>
        <ul>
          {entry.diagnosisCodes?.map(code => <li key={code}>{code} {diagnoses[code]?.name}</li>)}
        </ul>
        <List.Description>{entry.description}</List.Description>
        <List.Icon name="heart" color={healthCheckRatingColor} />
      </List.Content>
    </List.Item>
  );
};

const EntryDetails: React.FC<{entry: Entry}> = ({ entry }) => {
  switch (entry.type) {
    case "Hospital":
      return <HospitalEntryDetails entry={entry} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareEntryDetails entry={entry} />;
    case "HealthCheck":
      return <HealthCheckEntryDetails entry={entry}/>;
    default:
      return assertNever(entry);
  }
};

const PatientPage = () => {

  const { id } = useParams<{ id: string }>();

  const [{ patients }, dispatch] = useStateValue();
  React.useEffect(() => {
    const fetchPatient = async () => {
      try {
        const { data: patientFromApi } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch(addPatient(patientFromApi));
      } catch (e) {
        console.error(e);
      }
    };
    if (!patients[id]?.ssn) {
      console.log('Fetching patient info');
      void fetchPatient();
    }
  }, [dispatch]);

  const patient = patients[id];

  if (!patient) return <div>Patient not found</div>;

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: EntryWithoutId) => {
    try {
      const { data: newEntry } = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${id}/entries`,
        values
      );
      dispatch(addEntry(newEntry, patient));
      closeModal();
    } catch (e) {
      console.error(e.response?.data || 'Unknown Error');
      setError(e.response?.data?.error || 'Unknown error');
    }
  };

  const genderIcon = patient.gender === "male" ? "mars" : (patient.gender === "female" ? "venus" : "neuter");

  return (
    <div>
      <h2>
        {patient.name}
        <Icon name={genderIcon} />
      </h2>
      <div>ssn: {patient.ssn}</div>
      <div>occupation: {patient.occupation}</div>
      <h3>add new entry</h3>
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
      />
      <Button onClick={() => openModal()}>Add New Health Check Entry</Button>
      <h3>entries</h3>
      <div>
        <List celled>
          {patient.entries?.map(e => {
            return (
              <EntryDetails entry={e} key={e.id} />
            );
          })}
        </List>
      </div>
    </div>
  );
};

export default PatientPage;