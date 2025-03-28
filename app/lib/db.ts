"use server";
import mongoose from "mongoose";

declare global {
	var mongoose: any; // This must be a `var` and not a `let / const`
}

let cached = global.mongoose;
if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
	
    // Construct the MongoDB URI using the secret
	// const MONGODB_URI = `mongodb://${mongoSecretJson.username}:${mongoSecretJson.password}@${mongoSecretJson.host}/${mongoSecretJson.database}`;
    const MONGODB_URI = process.env.MONGO_URL;

    if(!MONGODB_URI) {
        console.error("MONGO_URL is not set");
        return;
    }

	if (cached.conn) {
        console.log('using cached mongo db connection');
		return cached.conn;
	}
	if (!cached.promise) {
		const opts = {
			bufferCommands: false,
		};
		cached.promise = mongoose
			.connect(MONGODB_URI, opts)
			.then((mongoose) => {
				return mongoose;
			});
	}
	try {
		cached.conn = await cached.promise;
	} catch (e) {
		cached.promise = null;
		throw e;
	}

	return cached.conn;
}

export default dbConnect;
