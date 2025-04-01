import { set } from "mongoose";
import WorkoutExerciseNotes from "./WorkoutExerciseNotes";



export default function ExerciseGroupTable({
	title,
	notes,
    sets,
    isEditing,
    setIsEditing
}: {
	title: string;
	notes: string;
    sets: {
        weight: number;
        reps: number;
        notes: string;
    }[],
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
}) {

    const handleEdit = () => {
        // Handle the edit button click
        console.log("Edit button clicked");
        setIsEditing(!isEditing);    
    }

	return (
		<div className='container'>
			<p>{title}</p>
            <button className="btn btn-primary" onClick={handleEdit}>Edit</button>
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
                            <td className='border px-4 py-2'>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        defaultValue={set.weight}
                                        className="w-full border px-2 py-1"
                                    />
                                ) : (
                                    set.weight
                                )}
                            </td>
                            <td className='border px-4 py-2'>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        defaultValue={set.reps}
                                        className="w-full border px-2 py-1"
                                    />
                                ) : (
                                    set.reps
                                )}
                            </td>
                            <td className='border px-4 py-2'>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        defaultValue={set.notes}
                                        className="w-full border px-2 py-1"
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
