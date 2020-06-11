import React from 'react'

const Header = ({ name }) => (
    <h2>{name}</h2>
)

const Part = ({ part }) => (
    <p>
      {part.name} {part.exercises}
    </p>
)
  
const Content = ({ parts }) => (

<div>
    {parts.map(part => <Part key={part.id} part={part} />)}
</div>

/*<>
    <Part part={props.parts[0]} />
    <Part part={props.parts[1]} />
    <Part part={props.parts[2]} />
</>*/
)
  
const Total = (props) => (
<>
    <p>
    <b>total of {props.parts.map(part => part.exercises)
                            .reduce((a, b) => a+b, 0)} exercises </b>
    </p>
</>
)
  
const Course = ({ course }) => (
<div>
    <Header name={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
</div>
)

  export default Course