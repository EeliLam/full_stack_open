const  calculateBmi = (height: number, weight: number): string => {
  if (height === 0) {
    return 'Height cannot be zero';
  }

  const heightInMetres = height / 100;
  const bmi = weight / (heightInMetres * heightInMetres);

  const bmiLimits = [15, 16, 18.5, 25, 30, 35, 40, Infinity];
  const messages = [
    'Very severely underweight',
    'Severely underweight',
    'Underweight',
    'Normal (healthy weight)',
    'Overweight',
    'Obese Class I (Moderately obese)',
    'Obese Class II (Severely obese)',
    'Obese Class III (Very severely obese)'
  ];

  let i = 0;
  while (bmiLimits[i] < bmi) i++;

  return messages[i];
};

// Comment these out for ex 9.5 (exporting calculateBmi to index.ts without running this)

/*interface arguments {
  height: number,
  weight: number
};

const parseArguments = (args: Array<string>): arguments => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      weight: Number(args[3])
    }
  } else {
    throw new Error('Provided values were not numbers!');
  }
}

try {
  const { height, weight } = parseArguments(process.argv);
  console.log(calculateBmi(height, weight));
} catch (e) {
  console.log('Error:', e);
}*/

//console.log(calculateBmi(180, 74))

export default calculateBmi;