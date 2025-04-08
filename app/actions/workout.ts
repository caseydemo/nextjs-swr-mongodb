"use server";
import Workout from "../models/Workout";
import dbConnect from "@/app/lib/db";
import useFetchExercise from "@/app/hooks/useFetchExercise";

async function getWorkoutById(workoutId: string) {
    await dbConnect();
    // find by the field called workoutId
    const workout = await Workout.findOne({ workoutId: workoutId });
    if (!workout) {
        throw new Error("Workout not found in getWorkoutById action");
    }
    return workout;
}


export async function addBlankSet(workoutId: string, exerciseGroupIndex: string) {

    // first make sure we've got the required fields
    if (!workoutId || !exerciseGroupIndex) {
        throw new Error("Missing required fields in addBlankSet action");
    }

    await dbConnect();

    // then grab the workout from the database
    const existingWorkout = await getWorkoutById(workoutId);
    if (!existingWorkout) {
        throw new Error("Workout not found in addBlankSet action");
    }

    // add a new set to the sets array
    existingWorkout.exercises[exerciseGroupIndex]['sets'].push({
        weight: 0,
        reps: 0,
        notes: "",
    });

    // mark the exercises array as modified
    existingWorkout.markModified(`exercises.${exerciseGroupIndex}.sets`);

    // save the workout back to the database
    const updatedWorkout = await existingWorkout.save();
    if (!updatedWorkout) {
        throw new Error("Failed to update workout in addBlankSet action");
    }
}

export async function deleteSet(workoutId: string, exerciseGroupIndex: string, setIndex: number) {
    // first make sure we've got the required fields
    if (!workoutId || !exerciseGroupIndex || setIndex === undefined) {
        throw new Error("Missing required fields in deleteSet action");
    }

    await dbConnect();

    // then grab the workout from the database
    const existingWorkout = await getWorkoutById(workoutId);
    if (!existingWorkout) {
        throw new Error("Workout not found in deleteSet action");
    }

    // remove the set at the specified index from the sets array
    existingWorkout.exercises[exerciseGroupIndex]['sets'].splice(setIndex, 1);

    // mark the exercises array as modified
    existingWorkout.markModified(`exercises.${exerciseGroupIndex}.sets`);

    // save the workout back to the database
    const updatedWorkout = await existingWorkout.save();
    if (!updatedWorkout) {
        throw new Error("Failed to update workout in deleteSet action");
    }
}


export async function deleteExerciseGroup(workoutId: string, exerciseGroupIndex: string) {
    // first make sure we've got the required fields
    if (!workoutId || !exerciseGroupIndex) {
        throw new Error("Missing required fields in deleteExerciseGroup action");
    }

    await dbConnect();

    // then grab the workout from the database
    const existingWorkout = await getWorkoutById(workoutId);
    if (!existingWorkout) {
        throw new Error("Workout not found in deleteExerciseGroup action");
    }

    // remove the exercise group at the specified index from the exercises array
    existingWorkout.exercises.splice(parseInt(exerciseGroupIndex), 1);

    // mark the exercises array as modified
    existingWorkout.markModified(`exercises`);

    // save the workout back to the database
    const updatedWorkout = await existingWorkout.save();
    if (!updatedWorkout) {
        throw new Error("Failed to update workout in deleteExerciseGroup action");
    }
}

// this makes an update to the db
export async function addExerciseGroup(workoutId: string, exerciseId: string) {

    if(!workoutId || !exerciseId) {
        throw new Error("Missing required fields in addExerciseGroup action");
    }

    await dbConnect();

    // then grab the workout from the database
    const existingWorkout = await getWorkoutById(workoutId);
    if (!existingWorkout) {
        throw new Error("Workout not found in addExerciseGroup action");
    }

    // add a new exercise group to the exercises array
    existingWorkout.exercises.push({
        name: "New Exercise Group",
        notes: "",
        sets: [
            {
                weight: 0,
                reps: 0,
                notes: "",
            },
            {
                weight: 0,
                reps: 0,
                notes: "",
            },
            {
                weight: 0,
                reps: 0,
                notes: "",
            },
        ],
    });

    // mark the exercises array as modified
    existingWorkout.markModified(`exercises`);

    // save the workout back to the database
    const updatedWorkout = await existingWorkout.save();
    if (!updatedWorkout) {
        throw new Error("Failed to update workout in addExerciseGroup action");
    }

}