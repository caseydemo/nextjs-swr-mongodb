export default function WorkoutDate({
	started,
	isEditing,
	handleDateEdit,
}: {
	started: string;
	isEditing: boolean;
	handleDateEdit: () => void;
}) {
	// this component will receive the 'started' prop, and also an isEditing prop and a handleDateEdit prop

	return (
		<>
			<div className='row g-3 mb-3'>
				<div className='col-auto'>
					<label
						htmlFor='workout-date'
						className='form-label'
					>
						The Date:
					</label>
				</div>
				<div className='col-auto'>
					{isEditing ? (
						<input
							type='date'
							id='workout-date'
							className='form-control'
							defaultValue={started}
						/>
					) : (
						<span>{started}</span>
					)}
				</div>
				{isEditing && (
					<div className='col-auto'>
						<button
							className='btn btn-primary'
							onClick={handleDateEdit}
						>
							Save
						</button>
					</div>
				)}
			</div>
		</>
	);
}
