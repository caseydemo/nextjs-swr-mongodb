"use server";
import Workout from "../models/Workout";
import dbConnect from "@/app/lib/db";
import { Workout as WorkoutType } from "../../types";

export async function updateWorkout({workout}: {workout: WorkoutType}) {
    await dbConnect();

    console.log('workout', workout);
    

}