import useSWR from 'swr';
import fetcher from '@/app/lib/fetcher';
export default function useExercise(exerciseId: string) {
    const { data, error, isLoading } = useSWR(
        `/api/exercises?exerciseId=${exerciseId}`,
        fetcher
    );
    // handle loading and error states
    return {
        data,
        error,
        isLoading,
    }
}