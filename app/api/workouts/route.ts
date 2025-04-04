import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import Workout from "@/app/models/Workout";
// import useSWR, { useSWRConfig } from "swr";

// make this take an optional parameter for the id
export async function GET(request: Request) {
	try {
		await dbConnect();

		// get the id from the params
		// get the GET array
		const url = new URL(request.url);
		const id = url.searchParams.get("workoutId");

		// if an id is provided, return the workout with that id
		if (id) {
			// find by field named workoutId
			// const workout = await Workout.findById(id);
			const workout = await Workout.findOne({ workoutId: id });
			if (!workout) {
				return NextResponse.json(
					{ message: "Workout not found" },
					{ status: 404 }
				);
			}
			return NextResponse.json({ workout }, { status: 200 });
		}
		// if no id is provided, return all workouts
		const workouts = await Workout.find({});
		return NextResponse.json({ workouts }, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ message: "Error fetching items" },
			{ status: 500 }
		);
	}
}

// PUT request to update a workout
// the request body contains the updated data for the exercise group
// the parameter is a single json object with the following properties:
// workoutId, exerciseGroupId, and the updated data for the exercise group
export async function PUT(request: Request) {
	try {
		// pull out the parts of the body
		const params = await request.json();

		// should be three things: workoutId, exerciseGroupId, and the updated data for the exercise group
		const { workoutId, exerciseGroupId, setsArray } = params;

		// all three need to be there, throw a fit if they aint
		if (!workoutId || !exerciseGroupId || !setsArray) {
			return NextResponse.json(
				{ message: "Missing required fields" },
				{ status: 400 }
			);
		}

		await dbConnect();

		// find the workout by the field called workoutId
		// const workout = await Workout.findOne({ workoutId });
		const workout = await Workout.findOne({ workoutId: workoutId });
		if (!workout) {
			return NextResponse.json(
				{ message: "Workout not found" },
				{ status: 404 }
			);
		}

		// find the exercise group's sets array - this is an array of objects
		const exerciseGroupSets = workout.exercises[exerciseGroupId]?.sets;
		if (!exerciseGroupSets) {
			return NextResponse.json(
				{ message: "Exercise group sets array not found" },
				{ status: 404 }
			);
		}
		// update the exercise group's sets array with the updated data
		// this will replace the entire sets array with the updated data
		workout.exercises[exerciseGroupId].sets = setsArray;

		// Mark the exercises array as modified
		workout.markModified(`exercises.${exerciseGroupId}.sets`);

		// ok... now that we have the data all set we need to save the workout
		// this updates the db, we will also need to update the cache in the frontend
		await workout.save();
		
        // Revalidate the data using SWR mutate

        // Revalidate the cache for the specific workout
        // const { mutate } = useSWRConfig();
        // This will re-fetch the data for the workout with the given workoutId
        // mutate(`/api/workouts?workoutId=${workoutId}`);
        
        
        
        return NextResponse.json(
			{ message: "Exercise group updated" },
			{ status: 200 }
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ message: "Error updating exercise group" },
			{ status: 500 }
		);
	}






}
