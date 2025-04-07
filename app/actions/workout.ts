"use server";
import Workout from "../models/Workout";
import dbConnect from "@/app/lib/db";

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