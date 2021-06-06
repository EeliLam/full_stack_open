interface exerciseResults {
  numDays: number,
  numTrainingDays: number,
  targetAvg: number,
  avg: number,
  targetReached: boolean,
  rating: number,
  textRating: string
}

/*interface exerciseArguments {
  target: number,
  exerciseHours: Array<number>
}*/

const calculateExercises = (exerciseHours: Array<number>, targetAvg: number): exerciseResults => {
  const numDays = exerciseHours.length;

  let sum = 0;
  let numTrainingDays = 0;

  for (let i = 0; i < numDays; i++) {
    sum += exerciseHours[i];
    numTrainingDays += Number(exerciseHours[i] > 0);
  }

  const avg = sum / numDays;
  const targetReached = avg >= targetAvg;
  const rating = targetReached ? 3 : (avg >= 0.5 * targetAvg ? 2 : 1);
  const textRatings = [
    'The average is under half the target. Try to get some more exercise in!',
    'Almost reached the target, pretty good!',
    'You reached the target, good job!'
  ];

  return {
    numDays,
    numTrainingDays,
    targetAvg,
    avg,
    targetReached,
    rating,
    textRating: textRatings[rating - 1]
  };
};

/*const parseCalculatorArguments = (args: Array<string>): exerciseArguments => {
  if (args.length < 4) throw new Error('Not enough arguments');

  let target;

  if (!isNaN(Number(args[2]))) {
    target = Number(args[2]);
  } else {
    throw new Error('Provided values were not numbers!');
  }

  const exerciseHours = [];

  for (let i = 3; i < args.length; i++) {
    if (!isNaN(Number(args[i]))) {
      exerciseHours.push(Number(args[i]));
    } else {
      throw new Error('Provided values were not numbers!');
    }
  }

  return {
    target,
    exerciseHours
  };
};

try {
  const { target, exerciseHours } = parseCalculatorArguments(process.argv);
  console.log(calculateExercises(exerciseHours, target));
} catch (e) {
  console.log('Error:', e);
}*/

//const exerciseHours = [3, 0, 2, 4.5, 0, 3, 1];

//console.log(calculateExercises(exerciseHours, 2));

export default calculateExercises;