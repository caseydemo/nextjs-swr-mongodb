"use client";


import useWorkout from "@/app/hooks/useWorkout";
import ExerciseGroupTable from "./ExerciseGroupTable";
import WorkoutNotes from "./WorkoutNotes";
import { useState } from "react";

export default function WorkoutTable({ workoutId }: { workoutId: string }) {
	// fetch workout data using SWR hook
    const { data, error, isLoading } = useWorkout(workoutId);

    // create stateful variable for whether the row is being edited or not
    const [isEditing, setIsEditing] = useState(false);

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
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
					/>
				</div>
			))}
		</>
	);
}
