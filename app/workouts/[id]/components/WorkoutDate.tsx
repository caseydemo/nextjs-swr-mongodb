export default function WorkoutDate({ started, isEditing, handleDateEdit }: { started: string; isEditing: boolean; handleDateEdit: () => void; }) {

    // this component will receive the 'started' prop, and also an isEditing prop and a handleDateEdit prop

    return (
        <>
        teh date:
        {started}
        </>
    )
}