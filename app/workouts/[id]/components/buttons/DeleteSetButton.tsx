export default function DeleteSetButton({
	handleDeleteSet,
	setIndex,
}: {
	handleDeleteSet: (setIndex: number) => void;
	setIndex: number;
}) {
	// this function is called when the button is clicked
	return (
		<button
			className='bg-red-500 text-white px-4 py-2 rounded'
			type='button'
			title='Delete set'
			onClick={() => handleDeleteSet(setIndex)} // call the function passed as a prop when the button is clicked
		>
			Delete Set
		</button>
	);
}
