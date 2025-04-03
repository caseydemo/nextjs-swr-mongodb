"use client";
import WorkoutExerciseNotes from "./WorkoutExerciseNotes";
import ActionButton from "./ActionButton";
import styles from "./styles/exercise-group-table.module.css";
import { useReducer } from "react";
import { updateWorkoutExerciseGroup } from "@/app/actions/workout";


interface ParsedFormData {
	[index: string]: {
		[fieldName: string]: string | File;
	};
}

interface ReturnData {
    parsedFormData: ParsedFormData;
    tableIndex: string;
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

        // tableIndex is the index portion of tableKey - it is always at the end prepended with a dash
        if(!tableKey) {
            console.error("tableKey is not defined");
            return null;
        }
        // force this to be a number
        const tableIndex = tableKey.split("-").pop() as string;
        if (!tableIndex) {
            console.error("tableIndex is not defined");
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
            tableIndex,
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
		const { parsedFormData, tableIndex } = parsedData;

        console.log('parsedFormData', parsedFormData);
        console.log('tableIndex', tableIndex);
        console.log('workoutId', workoutId);
        
        // send the data to the server
        const response = await updateWorkoutExerciseGroup(
            workoutId,
            tableIndex,
            parsedFormData
        );
		
	}

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		setIndex: number,
		field: string
	) => {
		const newValue = e.target.value;
		console.log("newValue", newValue);
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
