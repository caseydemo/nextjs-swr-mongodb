import WorkoutExerciseNotes from "./WorkoutExerciseNotes";
import ActionButton from "./ActionButton";
import styles from "./styles/exercise-group-table.module.css";

export default function ExerciseGroupTable({
    tableKey,
	title,
	notes,
	sets,
	isEditing,
	handleEdit,
    handleSave,
    handleInputChange,
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
	handleEdit: (tableId: string, data: any) => void;
    handleSave: (tableId: string) => void;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, setIndex: number, field: string) => void;
}) {    

	return (
		<div className={`container ${styles.exercise_group_table}`}>
			
            <p>{title}</p>
			
            <WorkoutExerciseNotes notes={notes} />

            <ActionButton isEditing={isEditing} handleEdit={() => handleEdit(tableKey, sets)} handleSave={() => handleSave(tableKey)} />

            {/* next step is to figure out how to send the workout object in the handleSave function */}
			
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
					{sets.map((set: any, setIndex: number) => (
						<tr key={setIndex}>
							<td className='border px-4 py-2'>{setIndex + 1}</td>
							<td className='border px-4 py-2'>
								{isEditing ? (
									<input
										type='number'
										defaultValue={set.weight}
										className='w-full border px-2 py-1'
									/>
								) : (
									set.weight
								)}
							</td>
							<td className='border px-4 py-2'>
								{isEditing ? (
									<input
										type='number'
										defaultValue={set.reps}
										className='w-full border px-2 py-1'
									/>
								) : (
									set.reps
								)}
							</td>
							<td className='border px-4 py-2'>
								{isEditing ? (
									<input
										type='text'
										defaultValue={set.notes}
										className='w-full border px-2 py-1'
                                        onChange={(e) => handleInputChange(e, setIndex, 'notes')}
									/>
								) : (
									set.notes
								)}
							</td>							
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
