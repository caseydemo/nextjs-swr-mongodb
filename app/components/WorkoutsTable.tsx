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

export default function WorkoutsTable() {

    const endpoint = '/api/workouts';
    const slug = 'workouts';
    const { data, error, isLoading } = useSWR(endpoint, fetcher);
    
	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Failed to load items</div>;

    const items = data[slug]
    if(!items) {
        throw new Error('No items found in the data');
    }
    
    return (
        <div >
            <table className="table">
                <thead>
                    <tr>
                        <th>Workout ID</th>
                        <th>Timestamp</th>                        
                    </tr>
                </thead>
                <tbody>
                    {items.map((item: any) => (
                        <tr key={item.id}>
                            <td>{item.workoutId}</td>
                            <td>{new Date(item.timestamp).toLocaleString()}</td>                            
                        </tr>
                    ))}
                </tbody>
            </table>
                
                    
                        
        </div>
    );
}
