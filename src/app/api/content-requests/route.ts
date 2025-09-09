import { NextResponse } from "next/server";
import {dbConnect} from "@/lib/db";
import ContentRequest, { IContentRequest } from "@/models/ContentRequest";
import { auth } from '@clerk/nextjs/server';
import { getOrCreateUser } from '@/lib/user';

// ✅ Create a new content request
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const body = await req.json();

    const { websiteId, websiteTitle, topic, wordCount, contentRequest } = body;

    if (!websiteId || !topic || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get or create user to fetch real email
    const user = await getOrCreateUser(userId);

    const newRequest = await ContentRequest.create<IContentRequest>({
      websiteId,
      websiteTitle,
      topic,
      wordCount,
      customerId: userId,
      customerEmail: user.email, // Use real email from Clerk
      status: "pending",
      contentRequest // Store the detailed content request data
    }as any);

    return NextResponse.json(
      { success: true, request: newRequest },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Content Request Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ Get all content requests (for super admin)
export async function GET() {
  try {
    await dbConnect();

    const requests: IContentRequest[] = await ContentRequest.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, items: requests });
  } catch (err: any) {
    console.error("Fetch Content Requests Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
