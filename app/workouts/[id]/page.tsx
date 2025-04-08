// take the id from the url and use it to fetch the workout
import WorkoutTable from "./components/tables/WorkoutTable";

export default async function WorkoutPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    return (
        <div className="container">
            <WorkoutTable workoutId={id} />
        </div>
    )
}