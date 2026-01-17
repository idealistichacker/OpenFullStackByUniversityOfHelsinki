const Total = ({parts}) => {
    const total_exercise = parts.reduce((exercise_nums, part) => exercise_nums + part.exercises, 0);
    console.log(`%c [DEBUG] total is ${total_exercise}`, 'background: #222; color: #bada55');
    return (
        <div>
            <p><b>total of {total_exercise} exercises</b></p>
        </div>
    )
}

export default Total