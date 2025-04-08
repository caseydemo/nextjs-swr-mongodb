export default function AddExerciseGroupButton({ onClick }: { onClick: () => void }) {
    return (
        <div className="col-auto">
            <button className="btn btn-primary" onClick={onClick}>
                Add Exercise Group
            </button>
        </div>
    )
}