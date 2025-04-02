"use client";

import useWorkout from "@/app/hooks/useWorkout";
import ExerciseGroupTable from "./ExerciseGroupTable";
import WorkoutNotes from "./WorkoutNotes";
import { useState } from "react";

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, setIndex: number, field: string) => {
        const { value } = e.target;        
        setFormData((prevFormData) => ({
            ...prevFormData,
            [`${field}-${setIndex}`]: value, // create a unique key for each input field
        }));
        console.log("Form Data:", formData);
    }

	const handleEdit = (tableId: string, data: any ) => {
        // handleEdit is called when the edit button is clicked
        // at this point we want to consider formData to be the current state of this table
        // specifically the tableId table
        // so I want to populate formData with the current state of the table
        console.log('tableId:', tableId);
        console.log('data:', data);
        setEditRows((prevEditRows) => ({
			...prevEditRows,
			[tableId]: !prevEditRows[tableId], // toggle the edit state for the specific table
		}));
	};

	const handleSave = (tableId: string) => {
		setEditRows((prevEditRows) => ({
			...prevEditRows,
			[tableId]: false, // set the edit state to false for the specific table
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
						title={exerciseGroup.name}
						notes={exerciseGroup.notes}
						sets={exerciseGroup.sets}
						isEditing={editRows[`exercise-group-${index}`] || false} // check if the specific table is in edit mode
						handleEdit={handleEdit}
						handleSave={handleSave}
						handleInputChange={handleInputChange}
					/>
				</div>
			))}
		</>
	);
}
