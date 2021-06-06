import express from 'express';
import calculateBmi from './bmiCalculator';
import calculateExercises from './exerciseCalculator';
const app = express();

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const { height, weight } = req.query;

  if (isNaN(Number(height)) || isNaN(Number(weight))) {
    res.status(400).json({ error: 'malformatted parameters' });
  }

  const bmi = calculateBmi(Number(height), Number(weight));

  res.status(200).json({
    height,
    weight,
    bmi
  });
});

app.post('/exercises', (req, res) => {
  let { daily_exercises, target } = req.body;

  if (!daily_exercises || !target) {
    res.status(400).json({
      error: "parameters missing"
    });
  }

  target = Number(target);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  daily_exercises = daily_exercises.map((el: any) => Number(el));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (isNaN(target) || daily_exercises.some((element: number) => isNaN(element))) {
    res.status(400).json({
      error: "malformatted parameters"
    });
  }

  res.status(200).json(calculateExercises(daily_exercises, target));
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});