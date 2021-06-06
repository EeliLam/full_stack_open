import React from 'react';

interface CoursePartBase {
  name: string;
  exerciseCount: number;
  type: string;
}

interface CoursePartDescription extends CoursePartBase {
  description: string
}

interface CourseNormalPart extends CoursePartDescription {
  type: "normal";
}

interface CourseProjectPart extends CoursePartBase {
  type: "groupProject";
  groupProjectCount: number;
}

interface CourseSubmissionPart extends CoursePartDescription {
  type: "submission";
  exerciseSubmissionLink: string;
}

interface CourseRequirementsPart extends CoursePartDescription {
  type: "special";
  requirements: string[];
}

type CoursePart = CourseNormalPart | CourseProjectPart | CourseSubmissionPart | CourseRequirementsPart;

const Header = ({ courseName }: { courseName: string }) => {
  return <h1>{courseName}</h1>;
};

const Part = ({ coursePart }: { coursePart: CoursePart }) => {
  switch (coursePart.type) {
    case 'normal':
      return (
        <div>
          <div>{coursePart.name} {coursePart.exerciseCount}</div>
          <div>{coursePart.description}</div>
        </div>
      );

    case 'groupProject':
      return (
        <div>
          <div>{coursePart.name} {coursePart.exerciseCount}</div>
          <div>project exercises {coursePart.groupProjectCount}</div>
        </div>
      );

    case 'submission':
      return (
        <div>
          <div>{coursePart.name} {coursePart.exerciseCount}</div>
          <div>submit to {coursePart.exerciseSubmissionLink}</div>
        </div>
      );

    case 'special':
      return (
        <div>
          <div>{coursePart.name} {coursePart.exerciseCount}</div>
          <div>required skills: {coursePart.requirements.join()}</div>
        </div>
      )
  }
};

const Content = ({ courseParts }: { courseParts: CoursePart[] }) => {
  return (
    <ul>
      {courseParts.map((part, i) =>
        <li key={i}>
          <Part coursePart={part} />
        </li>
      )}
    </ul>
  );
};

const Total = ({ courseParts }: { courseParts: CoursePart[] }) => {
  return (
    <div>
      <p>
        Number of exercises{" "}
        {courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
      </p>
    </div>
  );
};

const App = () => {
  const courseName = "Half Stack application development";
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is the leisured course part",
      type: "normal"
    },
    {
      name: "Advanced",
      exerciseCount: 7,
      description: "This is the harded course part",
      type: "normal"
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      type: "groupProject"
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      exerciseSubmissionLink: "https://fake-exercise-submit.made-up-url.dev",
      type: "submission"
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      type: "special"
    }
  ]

  return (
    <div>
      <Header courseName={courseName} />
      <Content courseParts={courseParts} />
      <Total courseParts={courseParts} />
    </div>
  );
};

export default App;