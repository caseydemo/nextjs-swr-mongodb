"use client";
import useFetchExercise from "../hooks/useFetchExercise";

export default function ExerciseList() {

    // fetch exercise data using SWR hook
    const { data, error, isLoading, mutate } = useFetchExercise();

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Failed to load items</div>;

	return (
		<ul>
			{data.exercises.map(
				(exercise: {
					_id: string;
					name: string;
					description: string;
				}) => (
					<li key={exercise._id}>
						{exercise.name}: {exercise.description}
					</li>
				)
			)}
		</ul>
	);
}
