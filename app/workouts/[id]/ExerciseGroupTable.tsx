"use client";
import WorkoutExerciseNotes from "./WorkoutExerciseNotes";
import ActionButton from "./ActionButton";
import styles from "./styles/exercise-group-table.module.css";
import { useReducer } from "react";
import submitForm from "@/app/actions/submit-form";

export default function ExerciseGroupTable({
	tableKey,
	title,
	notes,
	sets,
	isEditing,
	toggleEdit,
}: {
	tableKey: string;
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

	async function handleFormSubmit(formData: FormData) {

        const formDataObj = Object.fromEntries(formData.entries());
        
        // create an array to hold the sets
        const setsArray = [];


        // loop over this, dawg
        for (const key in formDataObj) {

            // add sets to setsArray like this:
            // [index]: { weight: 0, reps: 0, notes: "" }
            const [index, field] = key.split("-");
            const setIndex = parseInt(index);
            const fieldName = field as "weight" | "reps" | "notes";
            const fieldValue = formDataObj[key];
            // check if the setIndex exists in setsArray, if not create it
            if (!setsArray[setIndex]) {
                setsArray[setIndex] = { weight: 0, reps: 0, notes: "" };
            }
            
            console.log('')

            console.log(key, formDataObj[key]);
        }
        

	}

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		setIndex: number,
		field: string
	) => {
		const newValue = e.target.value;
		setFormData({
			[`${tableKey}-${setIndex}-${field}`]: newValue,
		});
		console.log("Form data updated:", formData);
	};

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
											onChange={(e) =>
												handleInputChange(
													e,
													setIndex,
													"weight"
												)
											}
										/>
									</td>
									<td className='border px-4 py-2'>
										<input
											type='number'
											// name="reps"
											name={`${setIndex}-reps`}
											defaultValue={set.reps}
											className='w-full border px-2 py-1'
											onChange={(e) =>
												handleInputChange(
													e,
													setIndex,
													"reps"
												)
											}
										/>
									</td>
									<td className='border px-4 py-2'>
										<input
											type='text'
											// name="notes"
											name={`${setIndex}-notes`}
											defaultValue={set.notes}
											className='w-full border px-2 py-1'
											onChange={(e) =>
												handleInputChange(
													e,
													setIndex,
													"notes"
												)
											}
										/>
									</td>
								</tr>
							))}
						</tbody>
					</table>
                    
					{/* <button
						className='bg-blue-500 text-white px-4 py-2 rounded mt-2'
						type='submit'
					>
						Submit
					</button> */}
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
