// src/app/api/check-data/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI);
  }
}

export async function GET() {
  try {
    await connectDB();
    
    // Check what collections exist
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
    
    // Check if we have a User collection
    const User = mongoose.models.User || mongoose.model("User", new mongoose.Schema({
      email: String,
      password: String,
      // other fields
    }));
    
    const users = await User.find({});
    console.log("Users:", users);
    
    // Check if we have a Request collection (from your access request form)
    const Request = mongoose.models.Request || mongoose.model("Request", new mongoose.Schema({
      email: String,
      password: String,
      // other fields
    }));
    
    const requests = await Request.find({});
    console.log("Requests:", requests);
    
    return NextResponse.json({ collections: collections.map(c => c.name), users, requests });
  } catch (error) {
    console.error("Error checking data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}