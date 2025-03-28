import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import Item from "@/app/models/Exercise";

export async function GET() {
	try {
		await dbConnect();
		const exercises = await Item.find({});
		return NextResponse.json({ exercises }, { status: 200 });
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