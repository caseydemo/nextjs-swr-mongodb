import styles from "../../styles/delete-exercise-group-button.module.css";
export default function DeleteExerciseGroupButton({    
    handleDeleteExerciseGroup,    
}: {    
    handleDeleteExerciseGroup: () => void;
}) {
    
    return (
        <button
            type="button"
            className={`bg-red-500 text-white px-4 py-2 rounded ${styles.delete_button}`}
            onClick={handleDeleteExerciseGroup}
            title="Delete exercise group"
        >
            <span aria-hidden="true">&times;</span>
            Delete Exercise Group
        </button>
    );
}