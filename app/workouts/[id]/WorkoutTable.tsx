"use client";
import useSWR from "swr";
import fetcher from "@/app/lib/fetcher";
import ExerciseGroupTable from "./ExerciseGroupTable";
import WorkoutNotes from "./WorkoutNotes";

export default function WorkoutTable({ workoutId }: { workoutId: string }) {
	// fetch the workout data using swr
	const { data, error, isLoading } = useSWR(
		`/api/workouts?workoutId=${workoutId}`,
		(url: string) => fetcher(url)
	);

	// handle loading and error states
	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Failed to load items</div>;
	if (!data) return <div>No data found</div>;

	// handle the case where the workout is not found
	const workout = data?.workout;
	if (!workout) {
		throw new Error("No data found in the workout object");
	}

	const exercises = workout.exercises;

	return (
		<>
			<h2>Workout: {workout.name}</h2>
			<p>Date: {workout.started}</p>

			<WorkoutNotes notes={workout.notes} />

			{/* loop over exercises, create a seperate table for each exercise group */}
			{exercises.map((exerciseGroup: any, index: number) => (
				<div
					key={`exercise-group-index-` + index}
					className='mt-4'
				>
					<ExerciseGroupTable
						title={exerciseGroup.name}
						notes={exerciseGroup.notes}
						sets={exerciseGroup.sets}
					/>
				</div>
			))}
		</>
	);
}
