import useSWR from 'swr';
import fetcher from '@/app/lib/fetcher';
export default function useFetchExercise(exerciseId?: string) {    
    
    const url = exerciseId ? `/api/exercises?exerciseId=${exerciseId}` : '/api/exercises';

    const { data, error, isLoading, mutate } = useSWR(
        url,
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
