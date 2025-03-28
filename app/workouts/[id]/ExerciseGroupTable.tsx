import WorkoutExerciseNotes from "./WorkoutExerciseNotes";
export default function ExerciseGroupTable({
	title,
	notes,
    sets
}: {
	title: string;
	notes: string;
    sets: {
        weight: number;
        reps: number;
        notes: string;
    }[];
}) {
	return (
		<div className='container'>
			<p>{title}</p>
			<WorkoutExerciseNotes notes={notes} />
            <table className='w-full border border-gray-300 mt-2'>
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
							<td className='border px-4 py-2'>{set.weight}</td>
							<td className='border px-4 py-2'>{set.reps}</td>
							<td className='border px-4 py-2'>{set.notes}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
