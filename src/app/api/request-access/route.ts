import { NextResponse } from "next/server";
import mongoose, { Document, Schema, Model } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

// --- Define TypeScript interface for request ---
interface IRequest extends Document {
  email: string;
  phone: string;
  password: string;
  country: string;
  traffic: string;
  numberOfWebsites: string;
  message?: string;
  status: "pending" | "approved";
  createdAt: Date;
}

// --- Define Schema ---
const requestSchema = new Schema<IRequest>({
  email: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  country: { type: String, required: true },
  traffic: { type: String, required: true },
  numberOfWebsites: { type: String, required: true },
  message: { type: String },
  status: { type: String, enum: ["pending", "approved"], default: "pending" },
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

    // Validate required fields
    const requiredFields = ['email', 'phone', 'password', 'country', 'traffic', 'numberOfWebsites'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Set default status to pending
    const requestData = {
      ...body,
      status: 'pending'
    };

    const requestDoc = new RequestModel(requestData);
    await requestDoc.save();

    return NextResponse.json({ 
      success: true, 
      message: "Request saved successfully",
      id: requestDoc._id 
    });
  } catch (error) {
    console.error("Error saving request:", error);
    return NextResponse.json(
      { success: false, error: "Database error occurred" },
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

// --- PATCH Handler (Update request status) ---
// In your API route
export async function PATCH(request) {
  try {
    await connectDB();
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: "Request ID and status are required" },
        { status: 400 }
      );
    }

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: "Status must be either 'pending', 'approved' or 'rejected'" },
        { status: 400 }
      );
    }

    // Update the request status
    const updatedRequest = await RequestModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Request status updated successfully",
      request: updatedRequest 
    });
  } catch (error) {
    console.error("Error updating request:", error);
    return NextResponse.json(
      { error: "Failed to update request" },
      { status: 500 }
    );
  }
}