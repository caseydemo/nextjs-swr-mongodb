"use client";
import styles from "../styles/action-button.module.css";
export default function ActionButton({
	isEditing,
	toggleEdit,    
}: {
	isEditing: boolean;
	toggleEdit: () => void;    
}) {
	return (
		<button
			onClick={toggleEdit}
			className={`bg-blue-500 text-white px-4 py-2 rounded ${styles.edit_button}`}
			type='submit'
			title={isEditing ? "Editing..." : "Edit workout"}            
		>
			Edit
		</button>
	);
}
