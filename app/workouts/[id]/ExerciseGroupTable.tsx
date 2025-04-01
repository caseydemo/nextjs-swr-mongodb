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
        setIsEditing(!isEditing);    
    }

    const handleSave = () => {
        console.log('this is the save function');
    }

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
                        <th className='border px-4 py-2'>Actions</th>
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
                            {/* actions column, if isEditing this is 'save' else 'edit' */}
                            <td className='border px-4 py-2'>
                                {isEditing ? (
                                    <button className="btn btn-success" onClick={handleSave} >Save</button>
                                ) : (
                                    <button className="btn btn-primary" onClick={handleEdit} >Edit</button>
                                )}
                            </td>
                        </tr>						
					))}
				</tbody>
			</table>
		</div>
	);
}
