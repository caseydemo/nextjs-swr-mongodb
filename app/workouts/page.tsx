import WorkoutsTable from "@/app/components/WorkoutsTable";
export default function Page() {
    return (
        <div>
            <h1>Workouts</h1>
            <p>This is the workouts page.</p>
            <p>Here you can find a WorkoutsTable of workouts.</p>
            <WorkoutsTable />
        </div>
    )
}