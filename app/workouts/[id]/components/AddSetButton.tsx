type AddSetButtonProps = {
    handleAddSet: () => void;
};
export default function AddSetButton({ handleAddSet }: AddSetButtonProps) {
    // this function is called when the button is clicked
    return (
        <button
            className='bg-blue-500 text-white px-4 py-2 rounded'
            type='button'
            title='Add set'
            onClick={handleAddSet} // call the function passed as a prop when the button is clicked
        >
            Add Set
        </button>
    );
}