import { NextResponse } from "next/server";
import mongoose, { Document, Schema, Model } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

// --- Define TypeScript interface for request ---
interface IRequest extends Document {
  email: string;
  phone: string;
  message?: string;
  createdAt: Date;
}

// --- Define Schema ---
const requestSchema = new Schema<IRequest>({
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Prevent recompiling model in dev/hot-reload
const RequestModel: Model<IRequest> =
  (mongoose.models.Request as Model<IRequest>) ||
  mongoose.model<IRequest>("Request", requestSchema);

// --- DB Connection ---
async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(MONGODB_URI);
      console.log("✅ MongoDB connected");
    } catch (err) {
      console.error("❌ MongoDB connection error:", err);
      throw new Error("MongoDB connection failed");
    }
  }
}

// --- POST Handler (Save new request) ---
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.email || !body.phone) {
      return NextResponse.json(
        { success: false, error: "Email and phone are required" },
        { status: 400 }
      );
    }

    const requestDoc = new RequestModel(body);
    await requestDoc.save();

    return NextResponse.json({ success: true, message: "Request saved" });
  } catch (error) {
    console.error("Error saving request:", error);
    return NextResponse.json(
      { success: false, error: "DB error" },
      { status: 500 }
    );
  }
}

// --- GET Handler (Fetch all requests) ---
export async function GET() {
  try {
    await connectDB();
    const requests: IRequest[] = await RequestModel.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}
