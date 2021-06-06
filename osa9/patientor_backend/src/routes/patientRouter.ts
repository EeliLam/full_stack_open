import express from 'express';
import patientService from '../services/patientService';
import { toNewPatient, toNewEntry } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  res.status(200).json(patientService.getPatientsPublic());
});

router.get('/:id', (req, res) => {
  const patient = patientService.getPatient(req.params.id);

  if (patient) {
    res.status(200).send(patient);
  } else {
    res.status(404);
  }
});

router.post('/', (req, res) => {
  try {
    const newPatient = toNewPatient(req.body);
    const addedPatient = patientService.addPatient(newPatient);
    res.status(201).json(addedPatient);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post('/:id/entries', (req, res) => {
  const patient = patientService.getPatient(req.params.id);
  console.log(req.params.id);
  if (!patient) {
    res.status(404);
    return;
  }

  try {
    const newEntry = toNewEntry(req.body);
    const addedEntry = patientService.addEntry(patient, newEntry);
    res.status(201).json(addedEntry);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

export default router;