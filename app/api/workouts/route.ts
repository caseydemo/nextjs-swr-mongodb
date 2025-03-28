import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import Workout from "@/app/models/Workout";

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


/* export async function POST(request: Request) {
	try {
		await dbConnect();
		const { name, description } = await request.json();
		const newItem = new Item({ name, description });
		await newItem.save();
		return NextResponse.json(
			{ message: "Item created successfully", item: newItem },
			{ status: 201 }
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ message: "Error creating item" },
			{ status: 500 }
		);
	}
}
 */