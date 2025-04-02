export type ExerciseGroup = {
    id: string;
    name: string;
    exercises: string[];
};

export type Workout = {
    id: string;
    workoutId: string;
    name: string;
    notes?: string;
    exercises: ExerciseGroup[];
    started: Date;
};