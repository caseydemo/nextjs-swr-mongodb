export default function AddExerciseGroupButton({ onClick }: { onClick: () => void }) {
    return (
        <div className="flex justify-center mt-4">
            <button className="btn btn-primary" onClick={onClick}>
                Add Exercise Group
            </button>
        </div>
    )
}