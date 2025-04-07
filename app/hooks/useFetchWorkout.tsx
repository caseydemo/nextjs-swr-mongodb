import useSWR from 'swr';
import fetcher from "@/app/lib/fetcher";
export default function useFetchWorkout(workoutId: string) {
    const { data, error, isLoading, mutate } = useSWR(
        `/api/workouts?workoutId=${workoutId}`,
        fetcher
    );
    // handle loading and error states
    return {
        data,
        error,
        isLoading,
        mutate,
    }
}