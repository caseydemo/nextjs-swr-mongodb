"use client";
import useSWR from "swr";
import fetcher from "../lib/fetcher";

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
