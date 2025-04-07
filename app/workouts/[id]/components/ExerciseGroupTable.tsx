"use client";
import WorkoutExerciseNotes from "./WorkoutExerciseNotes";
import ActionButton from "./ActionButton";
import styles from "../styles/exercise-group-table.module.css";

import { useReducer } from "react";


export default function ExerciseGroupTable({
	tableKey,
	workoutId,
	title,
	notes,
	sets,
	isEditing,
	toggleEdit,
    mutate,
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
    mutate: () => void; // function to mutate the SWR cache
}) {

	const { mutate } = useSWRConfig();
	const revalidationKey = `/api/workouts?workoutId=${workoutId}`;

	async function handleFormSubmit(formData: FormData) {


		// because the formData is in a weird unusable format by default, I need to parse it with my own logic
		const parsedData = parseFormData(formData, tableKey);
        if (!parsedData) {
			console.error("Failed to parse form data");
			return;
		}

		const { setsArray, exerciseGroupId } = parsedData;
        if (!setsArray || !exerciseGroupId) {
            console.error("Failed to parse form data");
            return;
        }

		const combinedData = {
			workoutId,
			exerciseGroupId,
			setsArray,
		};


		// optimistically load the new data?
		try {

            // Optimistically update the data (optional)
            // mutate('/api/workouts', (cacheData: any) => {
            //     // Update the cacheData based on newData
            //     return updatedCacheData;
            // }, false); // Prevent revalidation


		// update the db via the api route - and use swr mutate to update the cache
		// put request to /api/workouts/${workoutId}/exercise-groups/${exerciseGroupId}

		const response = await fetch(`/api/workouts`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(combinedData);

		});
		if (response.ok) {
			// Revalidate the data
			console.log('telling all swrs to revalidate with this key')
			mutate(revalidationKey);
		} else {
		   // Handle error and revert the optimistic update if necessary
		   mutate(revalidationKey)
		}

		
        // mutate the cache to update the workout data
        mutate(); // this will re-fetch the data from the server and update the cache

        // close the edit mode
        toggleEdit(tableKey);
        
		

	}

	return (
		<div className={`container ${styles.exercise_group_table}`}>
			<p>{title}</p>

			<WorkoutExerciseNotes notes={notes} />

			{isEditing ? (
				<form action={handleFormSubmit}>
					<ActionButton
						isEditing={isEditing}
						toggleEdit={() => toggleEdit(tableKey)}
					/>
					<input
						type='hidden'
						name='tableKey'
						value={tableKey}
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
