"use client";
import useSWR from "swr";

async function fetcher(url: string) {
	const res = await fetch(url);
	if (!res.ok) {
		const error = new Error("An error occurred while fetching the data.");
		throw error;
	}
	return res.json();
}

export default function ExerciseList() {
	const { data, error, isLoading } = useSWR("/api/exercises", fetcher);

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Failed to load items</div>;

	return (
		<ul>
			{data.exercises.map(
				(exercise: {
					_id: string;
					name: string;
					description: string;
				}) => (
					<li key={exercise._id}>
						{exercise.name}: {exercise.description}
					</li>
				)
			)}
		</ul>
	);
}
