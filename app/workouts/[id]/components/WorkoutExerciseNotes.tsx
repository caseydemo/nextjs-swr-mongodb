export default function WorkoutExerciseNotes({ notes }: { notes: string }) {
    // this is a placeholder for now, I will add a form to edit the notes later
    return (
        <p>
            <strong>Exercise Notes:</strong> {notes ? notes : "N/A"}
        </p>
    )
}