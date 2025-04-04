"use client";
import WorkoutExerciseNotes from "./WorkoutExerciseNotes";
import ActionButton from "./ActionButton";
import styles from "../styles/exercise-group-table.module.css";
import { useReducer } from "react";
import useSWR, { useSWRConfig } from "swr";


interface ParsedFormData {
	[index: string]: {
		[fieldName: string]: string | File;
	};
}

interface ReturnData {
    parsedFormData: ParsedFormData;
    exerciseGroupId: string;
}

export default function ExerciseGroupTable({
	tableKey,
    workoutId,
	title,
	notes,
	sets,
	isEditing,
	toggleEdit,
}: {
	tableKey: string;
    workoutId: string;
	title: string;
	notes: string;
	sets: {
		weight: number;
		reps: number;
		notes: string;
	}[];
	isEditing: boolean;
	toggleEdit: (tableId: string) => void;
}) {
	// stateful variable for form data
	const [formData, setFormData] = useReducer(
		(state: any, newState: any) => ({ ...state, ...newState }),
		{}
	);

	const parseFormData = (formData: FormData): ReturnData | null => {
		
        let parsedFormData: ParsedFormData = {};
        if (!formData) {
            console.error("Form data is not defined");
            return null;
        }

        // exerciseGroupId is the index portion of tableKey - it is always at the end prepended with a dash
        if(!tableKey) {
            console.error("tableKey is not defined");
            return null;
        }
        // force this to be a number
        const exerciseGroupId = tableKey.split("-").pop() as string;
        if (!exerciseGroupId) {
            console.error("exerciseGroupId is not defined");
            return null;
        }

		formData.forEach((value, key) => {
			if (!key.includes("-")) {
                return; // skip keys that don't have a dash
            }
            const [index, fieldName] = key.split("-");
			if (!parsedFormData[index]) {
				parsedFormData[index] = {};
			}
            parsedFormData[index][fieldName] = value;
		});

        // combine all the parsed data into a single object
        const returnData: ReturnData = {
            parsedFormData,
            exerciseGroupId,
        };        

		return returnData;
	};

    // this is called when the form is submitted
	async function handleFormSubmit(formData: FormData) {        
		
		const parsedData = parseFormData(formData);
		if (!parsedData) {
			console.error("Failed to parse form data");
			return;
		}
		const { parsedFormData, exerciseGroupId } = parsedData;

        // console.log('parsedFormData', parsedFormData);
        // console.log('exerciseGroupId', exerciseGroupId);
        // console.log('workoutId', workoutId);

        // combine all three values into a single object and send as the body of the request
        
        const combinedData = {
            workoutId,
            exerciseGroupId,
            ...parsedFormData,
        };

        // make this json
        const jsonData = JSON.stringify(combinedData);


        // update the db via the api route - and use swr mutate to update the cache
        // put request to /api/workouts/${workoutId}/exercise-groups/${exerciseGroupId}
        const response = await fetch(
            `/api/workouts`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: jsonData,
            }
        );
        if (!response.ok) {
            console.error("Failed to update exercise group");
            return;
        }
        const data = await response.json();
        console.log("Exercise group updated", data);
        
        // use swr to revalidate the data
        // const { mutate } = useSWRConfig();
        
        // revalidate the workout data
        // mutate(`/api/workouts/${workoutId}`);
        
        // revalidate the exercise group data
        // mutate(`/api/workouts/${workoutId}/exercise-groups/${exerciseGroupId}`);
        

        
	}

	

	return (
		<div className={`container ${styles.exercise_group_table}`}>
			<p>{title}</p>

			<WorkoutExerciseNotes notes={notes} />

			{/* next step is to figure out how to send the workout object in the handleSave function */}

			{isEditing ? (
				<form action={handleFormSubmit}>
					<ActionButton
						isEditing={isEditing}
						toggleEdit={() => toggleEdit(tableKey)}
					/>
                    <input type="hidden" name="tableKey" value={tableKey} />
					<table
						className='w-full border border-gray-300 mt-2'
						id={`exercise-group-table-${title}`}
					>
						<thead>
							<tr className='bg-gray-100'>
								<th className='border px-4 py-2'>Set</th>
								<th className='border px-4 py-2'>Weight</th>
								<th className='border px-4 py-2'>Reps</th>
								<th className='border px-4 py-2'>Notes</th>
							</tr>
						</thead>
						<tbody>
							{sets.map((set, setIndex) => (
								<tr key={setIndex}>
									<td className='border px-4 py-2'>
										{setIndex + 1}
									</td>
									<td className='border px-4 py-2'>
										<input
											type='number'
											// name="weight"
											name={`${setIndex}-weight`}
											defaultValue={set.weight}
											className='w-full border px-2 py-1'											
										/>
									</td>
									<td className='border px-4 py-2'>
										<input
											type='number'
											// name="reps"
											name={`${setIndex}-reps`}
											defaultValue={set.reps}
											className='w-full border px-2 py-1'											
										/>
									</td>
									<td className='border px-4 py-2'>
										<input
											type='text'
											// name="notes"
											name={`${setIndex}-notes`}
											defaultValue={set.notes}
											className='w-full border px-2 py-1'											
										/>
									</td>
								</tr>
							))}							
						</tbody>
					</table>

					<button
						className='bg-blue-500 text-white px-4 py-2 rounded mt-2'
						type='submit'
					>
						Submit
					</button>
				</form>
			) : (
				<>
					<ActionButton
						isEditing={isEditing}
						toggleEdit={() => toggleEdit(tableKey)}
					/>

					<table
						className='w-full border border-gray-300 mt-2'
						id={`exercise-group-table-${title}`}
					>
						<thead>
							<tr className='bg-gray-100'>
								<th className='border px-4 py-2'>Set</th>
								<th className='border px-4 py-2'>Weight</th>
								<th className='border px-4 py-2'>Reps</th>
								<th className='border px-4 py-2'>Notes</th>
							</tr>
						</thead>
						<tbody>
							{sets.map((set, setIndex) => (
								<tr key={setIndex}>
									<td className='border px-4 py-2'>
										{setIndex + 1}
									</td>
									<td className='border px-4 py-2'>
										{set.weight}
									</td>
									<td className='border px-4 py-2'>
										{set.reps}
									</td>
									<td className='border px-4 py-2'>
										{set.notes}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</>
			)}
		</div>
	);
}
