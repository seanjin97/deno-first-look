import mongoose from "npm:mongoose@7.3.2";
import Dinosaur from "./model/Dinosaur.ts";
import { load } from "https://deno.land/std@0.193.0/dotenv/mod.ts";
const env = await load();
const DB_URI = env["DB_URI"];

console.log(DB_URI)

await mongoose.connect(DB_URI);

// Check to see connection status.
console.log(mongoose.connection.readyState);

const deno = new Dinosaur({
    name: "Deno",
    description: "The fastest dinosaur ever lived.",
});

// // Insert deno.
await deno.save();

// Find Deno by name.
const denoFromMongoDb = await Dinosaur.findOne({ name: "Deno" });
console.log(denoFromMongoDb!.description);

// Update description for Deno and save it.
await denoFromMongoDb!.updateDescription(
    "The fastest and most secure dinosaur ever lived.",
);

// Check MongoDB to see Deno's updated description.
const newDenoFromMongoDb = await Dinosaur.findOne({ name: "Deno" });
console.log(newDenoFromMongoDb!.description);