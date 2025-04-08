"use client";

import useFetchWorkout from "@/app/hooks/useFetchWorkout";
import ExerciseGroupTable from "./ExerciseGroupTable";
import WorkoutNotes from "./WorkoutNotes";
import { useState } from "react";
import AddExerciseGroupButton from "./AddExerciseGroupButton";
import { addExerciseGroup } from "@/app/actions/workout";
import ExerciseDropdown from "./ExerciseDropdown";


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
    const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);

	// handle loading and error states
	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Failed to load items</div>;
	if (!data) return <div>No data found</div>;

	// handle the case where the workout is not found
    // data is either data.workout or just data
	const workout = data?.workout ? data.workout : data; // check if workout is in the data object, if not just use the data object
	if (!workout) {
		throw new Error("No data found in the workout object");
	} else {
        console.log('this is the workout data', data) // log the workout data to the console
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
            alert("Please select an exercise before adding a new exercise group.");
            return;
        }
        // optimistically update the ui by calling the update function from mutate

        const blankExerciseGroup = {
            name: "New Exercise Group",
            notes: "",
            sets: [
                {
                    reps: 0,
                    weight: 0,
                    notes: ""
                },
                {
                    reps: 0,
                    weight: 0,
                    notes: ""
                },
                {
                    reps: 0,
                    weight: 0,
                    notes: ""
                },
            ],
        }; // create a blank exercise group object


        // add the blank exercise group to the workout data
        // this is used to optimistically update the UI before the actual data is fetched
        const optimisticData = {
            ...workout,
            exercises: [...workout.exercises, blankExerciseGroup], // add the blank exercise group to the workout data
        };        

        // use mutate to optimistically update the workout data
        mutate(`/api/workouts?workoutId=${workoutId}`, optimisticData, false); // optimistically update the workout data
            
        // call the addExerciseGroup action to add a new exercise group to the database
        await addExerciseGroup(workoutId, selectedExerciseId); // call the addExerciseGroup action to add a new exercise group
                
        // use mutate to revalidate the workout data
        mutate(`/api/workouts?workoutId=${workoutId}`); // revalidate the workout data
    }

    const handleExerciseDropdown = async (exerciseId: string) => {
        setSelectedExerciseId(exerciseId); // set the selected exercise ID in state
    }
        
	return (
		<>
			<div className='container'>
				<div className=''>
					<div className="">
                        Date: {workout.started}</div>
					<div className="">
						<WorkoutNotes notes={workout.notes} />
					</div>
				</div>
                <div className='flex justify-center mt-4'>
                    <AddExerciseGroupButton 
                        onClick={handleAddExerciseGroup} // pass the handleAddExerciseGroup function to the button
                    />
                    <ExerciseDropdown handleExerciseDropdown={handleExerciseDropdown} /> {/* This is a placeholder for the ExerciseDropdown component */}
                </div>
			</div>

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
