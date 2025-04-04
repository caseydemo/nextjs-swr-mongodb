export default function WorkoutNotes({ notes }: { notes: string }) {
    // this is a placeholder for now, I will add a form to edit the notes later
    return (
        <p>
            <strong>Workout Overall Notes:</strong> {notes ? notes : "No notes available"}
        </p>
    )
}