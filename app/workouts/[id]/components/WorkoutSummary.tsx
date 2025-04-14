import SummaryEditButton from "./buttons/SummaryEditButton"
import ExerciseDropdown from "./ExerciseDropdown"
import AddExerciseGroupButton from "./buttons/AddExerciseGroupButton"
export default function WorkoutSummary({handleExerciseDropdown, handleAddExerciseGroup}: {handleExerciseDropdown: (exerciseId: string) => void, handleAddExerciseGroup: () => void}) {
    return (
        <div className="row g-3 mb-3">
            <div className="col-auto">
                <h2>Workout Summary</h2>
            </div>
            <div className="col-auto">
                {/* <AddExerciseGroupButton
                    onClick={handleAddExerciseGroup}
                />
                <ExerciseDropdown
                    handleExerciseDropdown={handleExerciseDropdown}
                /> */}
            </div>
            <div className="col-auto">
                {/* <SummaryEditButton /> */}
            </div>
        </div>
    )
}