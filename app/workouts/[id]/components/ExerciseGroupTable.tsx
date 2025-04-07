"use client";
import WorkoutExerciseNotes from "./WorkoutExerciseNotes";
import EditButton from "./EditButton";
import styles from "../styles/exercise-group-table.module.css";
import parseFormData from "@/app/lib/parseFormData";

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

		// send the data to the server using a PUT request
		try {
			const response = await fetch(`/api/workouts`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(combinedData),
			});
			mutate();
		} catch (error) {
			console.error("Error updating workout:", error);
		}

		// close the edit mode
		toggleEdit(tableKey);
	}

	return (
		<div className={`container ${styles.exercise_group_table}`}>
			<p>{title}</p>

			<WorkoutExerciseNotes notes={notes} />

			{isEditing ? (
				<form action={handleFormSubmit}>
					<EditButton
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
					<EditButton
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
