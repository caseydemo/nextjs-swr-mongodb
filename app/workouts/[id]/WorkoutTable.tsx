"use client";

import useWorkout from "@/app/hooks/useWorkout";
import ExerciseGroupTable from "./ExerciseGroupTable";
import WorkoutNotes from "./WorkoutNotes";
import { useState } from "react";
import { table } from "console";

export default function WorkoutTable({ workoutId }: { workoutId: string }) {
	// fetch workout data using SWR hook
	const { data, error, isLoading } = useWorkout(workoutId);

	// create stateful variable for whether the row is being edited or not
	const [editRows, setEditRows] = useState<Record<string, boolean>>({});

	const [formData, setFormData] = useState({});

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

    // give this a second param that takes formData but it's optional
    // this is the function that will be called when the form is submitted
	const toggleEdit = (tableId: string, formData?: FormData) => {
		setEditRows((prevEditRows) => ({
			...prevEditRows,
			[tableId]: !prevEditRows[tableId], // toggle the edit state for the specific table
		}));

        // if formData is passed, set the formData state
        if (formData) {
            const formDataObj = Object.fromEntries(formData.entries());
            setFormData((prevFormData) => ({
                ...prevFormData,
                ...formDataObj,
            }));
            console.log('formDataObj', formDataObj);
        }


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
