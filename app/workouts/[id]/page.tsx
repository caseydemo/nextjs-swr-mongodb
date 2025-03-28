// take the id from the url and use it to fetch the workout
import WorkoutTable from "./WorkoutTable";

export default async function WorkoutPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    return (
        <div className="container">
            {/* I need to await the id param? */}
            <h1>Workout id: {id}</h1>
            <WorkoutTable workoutId={id} />
        </div>
    )
}