import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import Workout from "@/app/models/Workout";

export async function GET() {
	try {
		await dbConnect();
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