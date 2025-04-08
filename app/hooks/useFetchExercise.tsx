import useSWR from 'swr';
import fetcher from '@/app/lib/fetcher';
export default function useFetchExercise(exerciseId?: string) {    
    
    const { data, error, isLoading, mutate } = useSWR(
        `/api/exercises?exerciseId=${exerciseId}`,
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
