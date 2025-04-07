"use client";
import WorkoutExerciseNotes from "./WorkoutExerciseNotes";
import EditButton from "./EditButton";
import AddSetButton from "./AddSetButton";
import styles from "../styles/exercise-group-table.module.css";
import parseFormData from "@/app/lib/parseFormData";
import { addBlankSet, deleteSet } from "@/app/actions/workout";
import DeleteSetButton from "./DeleteSetButton";

export default function ExerciseGroupTable({
	tableKey,
	workoutId,
	title,
	notes,
	sets,
	isEditing,
	toggleEdit,
	mutateExerciseGroup,
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
	mutateExerciseGroup: () => void; // function to mutate the SWR cache
}) {	

	// add a new row to the exercise group table
	// the new row represents a set of the exercise - reps, weight, notes
	const handleAddSet = async () => {
        // the index is the last part of the tablekey, prepended by a dash ex  exercise-group-0 - index is 0
        const exerciseGroupIndex = tableKey.split("-").pop() || "0"; // get the last part of the tableKey
        await addBlankSet(workoutId, exerciseGroupIndex); // add a blank set to the database
        mutateExerciseGroup(); // mutate the SWR cache to trigger a revalidation
	};

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
			mutateExerciseGroup();
		} catch (error) {
			console.error("Error updating workout:", error);
		}

		// close the edit mode
		toggleEdit(tableKey);
	}

    const handleDeleteSet = async (setIndex: number) => {
        // call server action to delete the set in db
        await deleteSet(workoutId, tableKey.split("-").pop() || "0", setIndex);
        // mutate the cache to trigger a revalidation
        mutateExerciseGroup(); // trigger a revalidation of the SWR cache
    }


	return (
		<div className={`container ${styles.exercise_group_table}`}>
			<p>{title}</p>

			<WorkoutExerciseNotes notes={notes} />

			{isEditing ? (
				<form action={handleEditExerciseGroup}>
					<EditButton
						isEditing={isEditing}
						toggleEdit={() => toggleEdit(tableKey)}
					/>
					<AddSetButton handleAddSet={handleAddSet} />
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
                                    <DeleteSetButton handleDeleteSet={handleDeleteSet} setIndex={setIndex} /> {/* Placeholder for delete functionality */}                               
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
