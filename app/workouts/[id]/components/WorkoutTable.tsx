"use client";

import useWorkout from "@/app/hooks/useWorkout";
import ExerciseGroupTable from "./ExerciseGroupTable";
import WorkoutNotes from "./WorkoutNotes";
import { useState } from "react";

/*
    WorkoutTable component is responsible for displaying the workout data in a table format.
    It fetches the workout data using the useWorkout hook, which uses SWR for data fetching.
    The component also handles the loading and error states, and displays the workout name, date, and notes.
*/
export default function WorkoutTable({ workoutId }: { workoutId: string }) {

	// fetch workout data using SWR hook
	const { data, error, isLoading } = useWorkout(workoutId);

	// create stateful variable for whether the row is being edited or not
	const [editRows, setEditRows] = useState<Record<string, boolean>>({});	

	// handle loading and error states
	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Failed to load items</div>;
	if (!data) return <div>No data found</div>;

	// handle the case where the workout is not found
	const workout = data?.workout;
	if (!workout) {
		throw new Error("No data found in the workout object");
	}

	let exercises = [];
	try {
		exercises = workout.exercises;
	} catch (error) {
		console.error("Error processing workout exercises:", error);
		return <div>Failed to process workout exercises</div>;
	}

    // this allows the user to toggle the edit state of the table
    // the tableId is used to identify the specific table that is being edited
    const toggleEdit = (tableId: string) => {
		setEditRows((prevEditRows) => ({
			...prevEditRows,
			[tableId]: !prevEditRows[tableId], // toggle the edit state for the specific table
		}));
	};

	return (
		<>
			<h2>Workout: {workout.name}</h2>
			<p>Date: {workout.started}</p>

			<WorkoutNotes notes={workout.notes} />

			{/* loop over exercises, create a seperate table for each exercise group */}
			{exercises.map((exerciseGroup: any, index: number) => (
				<div
					key={`exercise-group-${index}`}
					className='mt-4'
				>
					<ExerciseGroupTable
						tableKey={`exercise-group-${index}`} // unique key for each sub table - used to identify the table in the DOM
						workoutId={workoutId}
                        title={exerciseGroup.name}
						notes={exerciseGroup.notes}
						sets={exerciseGroup.sets}
						isEditing={editRows[`exercise-group-${index}`] || false} // check if the specific table is in edit mode
						toggleEdit={toggleEdit}
					/>
				</div>
			))}
		</>
	);
}
