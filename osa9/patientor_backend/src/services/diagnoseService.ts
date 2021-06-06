import diagnoseData from '../../data/diagnoses.json';
import { Diagnose } from '../../types';

const getDiagnoses = (): Diagnose[] => {
  return diagnoseData;
};

export default { getDiagnoses };