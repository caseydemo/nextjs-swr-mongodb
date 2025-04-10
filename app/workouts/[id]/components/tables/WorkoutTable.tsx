"use client";

import useFetchWorkout from "@/app/hooks/useFetchWorkout";
import ExerciseGroupTable from "./ExerciseGroupTable";
import WorkoutNotes from "../WorkoutNotes";
import AddExerciseGroupButton from "../buttons/AddExerciseGroupButton";
import ExerciseDropdown from "../ExerciseDropdown";
import WorkoutDate from "../WorkoutDate";
import { addExerciseGroup } from "@/app/actions/workout";
import { useState } from "react";
import Card from "@/app/components/Card";

/*
    WorkoutTable component is responsible for displaying the workout data in a table format.
    It fetches the workout data using the useFetchWorkout hook, which uses SWR for data fetching.
    The component also handles the loading and error states, and displays the workout name, date, and notes.
*/
export default function WorkoutTable({ workoutId }: { workoutId: string }) {
	// fetch workout data using SWR hook
	const { data, error, isLoading, mutate } = useFetchWorkout(workoutId);

	// create stateful variable for whether the row is being edited or not
	const [editRows, setEditRows] = useState<Record<string, boolean>>({});

	// create a stateful variable for the selected exercise ID
	const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(
		null
	);

    const [dateIsEditing, setDateIsEditing] = useState(false); // state for date editing

	// handle loading and error states
	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Failed to load items</div>;
	if (!data) return <div>No data found</div>;

	// handle the case where the workout is not found
	// data is either data.workout or just data
	const workout = data?.workout ? data.workout : data; // check if workout is in the data object, if not just use the data object
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

	const handleAddExerciseGroup = async () => {
		// prevent this from working if user has not selected an exercise
		if (!selectedExerciseId) {
			alert(
				"Please select an exercise before adding a new exercise group."
			);
			return;
		}

		// optimistically update the ui by calling the update function from mutate
		const blankExerciseGroup = {
			name: "New Exercise Group", // default name for the new exercise group
			notes: "",
			sets: [
				{
					reps: 0,
					weight: 0,
					notes: "",
				},
				{
					reps: 0,
					weight: 0,
					notes: "",
				},
				{
					reps: 0,
					weight: 0,
					notes: "",
				},
			],
		}; // create a blank exercise group object

		// add the blank exercise group to the workout data
		// this is used to optimistically update the UI before the actual data is fetched
		const optimisticData = {
			...workout,
			exercises: [...workout.exercises, blankExerciseGroup], // add the blank exercise group to the workout data
		};

		const options = {
			revalidate: false, // don't revalidate the data after the update
			rollbackOnError: true, // rollback the data on error
		};

		// use mutate to optimistically update the workout data
		mutate(`/api/workouts?workoutId=${workoutId}`, optimisticData, options); // optimistically update the workout data

		// call the addExerciseGroup action to add a new exercise group to the database
		await addExerciseGroup(workoutId, selectedExerciseId); // call the addExerciseGroup action to add a new exercise group

		// use mutate to revalidate the workout data
		mutate(`/api/workouts?workoutId=${workoutId}`); // revalidate the workout data
	};

	const handleExerciseDropdown = async (exerciseId: string) => {
		setSelectedExerciseId(exerciseId); // set the selected exercise ID in state
	};

    const handleDateEdit = async () => {
        // handle the date edit functionality here
        // this is a placeholder for the date edit functionality
        console.log("Date edit functionality not implemented yet.");
    }

	return (
		<>
			<Card
				title={`Workout - ${workout.workoutId}`}
				className='mb-4'
			>
				<div className=''>
					<WorkoutDate started={workout.started} isEditing={dateIsEditing} handleDateEdit={handleDateEdit} />
					<div className='callout callout-info'>
						<WorkoutNotes notes={workout.notes} />
					</div>
				</div>
				<div className='row g-3'>
					<AddExerciseGroupButton
						onClick={handleAddExerciseGroup} // pass the handleAddExerciseGroup function to the button
					/>
					<ExerciseDropdown
						handleExerciseDropdown={handleExerciseDropdown}
					/>
					{/* This is a placeholder for the ExerciseDropdown component */}
				</div>
			</Card>

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
