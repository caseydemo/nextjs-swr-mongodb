import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import Exercise from "@/app/models/Exercise";

export async function GET(request: Request) {
	try {
		await dbConnect();
        
        const { searchParams } = new URL(request.url);        
        const exerciseId = await searchParams.get("exerciseId")?.trim(); // get the exerciseId from the query string
        
        if(exerciseId && exerciseId.length > 0) {
            
            console.log('why is this being called when it is undefined?', typeof exerciseId); // log the exerciseId to the console

            const exercise = await Exercise.findById(exerciseId);
            if (!exercise) {
                return NextResponse.json(
                    { message: "Exercise not found" },
                    { status: 404 }
                );
            }
            return NextResponse.json({ exercise }, { status: 200 });
        } else {
            // if no id is provided, return all exercises        
            const exercises = await Exercise.find({});
            if (!exercises) {
                return NextResponse.json(
                    { message: "No exercises found" },
                    { status: 404 }
                );
            }
            return NextResponse.json({ exercises }, { status: 200 });
        }
        

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