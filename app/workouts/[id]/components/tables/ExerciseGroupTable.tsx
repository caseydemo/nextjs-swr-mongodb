"use client";
import WorkoutExerciseNotes from "../WorkoutExerciseNotes";
import EditButton from "../buttons/EditButton";
import AddSetButton from "../buttons/AddSetButton";
import styles from "../../styles/exercise-group-table.module.css";
import parseFormData from "@/app/lib/parseFormData";
import {
	addBlankSet,
	deleteSet,
	deleteExerciseGroup,
} from "@/app/actions/workout";
import DeleteSetButton from "../buttons/DeleteSetButton";
import DeleteExerciseGroupButton from "../buttons/DeleteExerciseGroupButton";
import { mutate } from "swr";

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
	// ADD BLANK SET
	const handleAddSet = async () => {
		// the index is the last part of the tablekey, prepended by a dash ex  exercise-group-0 - index is 0
		const exerciseGroupIndex = tableKey.split("-").pop() || "0"; // get the last part of the tableKey
        await addBlankSet(workoutId, exerciseGroupIndex); // add a blank set to the database	
        mutate(`/api/workouts?workoutId=${workoutId}`); // revalidate the workout data        
	};

	// EDIT EXERCISE GROUP
	async function handleEditExerciseGroup(formData: FormData) {
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

		// send the data to the server using a PUT request
		try {
			await fetch(`/api/workouts`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(combinedData),
			});			
		} catch (error) {
			console.error("Error updating workout:", error);
		}

		// close the edit mode
		toggleEdit(tableKey);
	}

	
	const handleDeleteSet = async (setIndex: number) => {
		const exerciseGroupIndex = tableKey.split("-").pop() || "0"; // get the last part of the tableKey
		await deleteSet(workoutId, exerciseGroupIndex, setIndex); // delete the set from the database		
		toggleEdit(tableKey); // close the edit mode
        mutate(`/api/workouts?workoutId=${workoutId}`); // revalidate the workout data
	};

	// DELETE EXERCISE GROUP
	const handleDeleteExerciseGroup = async () => {
		// send the data to the server using a DELETE request
		const exerciseGroupIndex = tableKey.split("-").pop() || "0"; // get the last part of the tableKey
		await deleteExerciseGroup(workoutId, exerciseGroupIndex); // delete the exercise group from the database
		toggleEdit(tableKey); // close the edit mode
        mutate(`/api/workouts?workoutId=${workoutId}`); // revalidate the workout data
	};

	return (
		<div className={`container ${styles.exercise_group_table}`}>
			<p>{title}</p>

			<WorkoutExerciseNotes notes={notes} />

			{isEditing ? (
				<form action={handleEditExerciseGroup}>
					<input
						type='hidden'
						name='tableKey'
						value={tableKey}
					/>

					<EditButton
						isEditing={isEditing}
						toggleEdit={() => toggleEdit(tableKey)}
					/>

					<AddSetButton handleAddSet={handleAddSet} />

					<DeleteExerciseGroupButton
						handleDeleteExerciseGroup={handleDeleteExerciseGroup}
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
								{isEditing && (
									<th className='border px-4 py-2'>
										Actions
									</th>
								)}
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
									<td className='border px-4 py-2'>
										<DeleteSetButton
											handleDeleteSet={handleDeleteSet}
											setIndex={setIndex}
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
					<EditButton
						isEditing={isEditing}
						toggleEdit={() => toggleEdit(tableKey)}
					/>
					<AddSetButton handleAddSet={handleAddSet} />

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
