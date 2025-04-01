export default function ActionButton({ isEditing, handleEdit, handleSave }: { isEditing: boolean; handleEdit: () => void; handleSave: () => void; }) {

    return (
        <button
            onClick={isEditing ? handleSave : handleEdit}
            className='bg-blue-500 text-white px-4 py-2 rounded'
        >
            {isEditing ? "Save" : "Edit"}
        </button>
    );
}