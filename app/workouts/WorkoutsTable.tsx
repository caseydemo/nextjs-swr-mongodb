"use client";
import useSWR from "swr";
import fetcher from "@/app/lib/fetcher";

export default function WorkoutsTable() {
	const endpoint = "/api/workouts";
	const slug = "workouts";
	const { data, error, isLoading } = useSWR(endpoint, fetcher);

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Failed to load items</div>;

	const items = data[slug];
	if (!items) {
		throw new Error("No items found in the data");
	}

	return (
		<div>
			<table className='table table-hover table-dark'>
				<thead>
					<tr>
						<th>Workout ID</th>
						<th>Timestamp</th>
					</tr>
				</thead>
				<tbody>
					{items.map((item: any) => (
						<tr key={item.id}>
							<td>
								<a
									href={`/workouts/${item.workoutId}`}
									className='text-decoration-none text-white'
								>
									{item.workoutId}
								</a>
							</td>
							<td>{new Date(item.started).toLocaleString()}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
