"use client"
import useFetchExercise from "@/app/hooks/useFetchExercise";
export default function ExerciseDropdown({ handleExerciseDropdown }: { handleExerciseDropdown: (exerciseId: string) => void }) {

    // fetch exercise data using SWR hook
    const { data, error, isLoading, mutate } = useFetchExercise();
    const exercises = data?.exercises || [];
    

    return (
        <div className="col-auto">
            {error && <p>Error loading exercises</p>}
            {isLoading && <p>Loading...</p>}
            
            <select className="form-select" aria-label="Default select example" onChange={(e) => handleExerciseDropdown(e.target.value)}>
                <option value="">Select an exercise</option>
                {exercises.map((exercise: { _id: string; name: string }) => (
                    <option key={exercise._id} value={exercise._id}>
                        {exercise.name}
                    </option>
                ))}
            </select>

        </div>
    )
}