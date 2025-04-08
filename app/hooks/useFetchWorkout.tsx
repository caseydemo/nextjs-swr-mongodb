import useSWR from 'swr';
import { useSWRConfig } from "swr"
import fetcher from "@/app/lib/fetcher";
export default function useFetchWorkout(workoutId: string) {
    const { data, error, isLoading } = useSWR(
        `/api/workouts?workoutId=${workoutId}`,
        fetcher
    );

    const { mutate } = useSWRConfig();

    // handle loading and error states
    return {
        data,
        error,
        isLoading,
        mutate,
    }
}