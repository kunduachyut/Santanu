import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Website from "@/models/Website";
import { requireAuth } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await context.params; // <-- Await params
  console.log("GET request for website with ID:");
  console.log("Fetching website with ID:", id);
  const website = await Website.findById(id);
  if (!website) {
    return NextResponse.json({ error: "Website not found" }, { status: 404 });
  }

  const authCheck = await requireAuth();
  const isAuthenticated = !(authCheck instanceof NextResponse);

  if (!isAuthenticated && website.status !== 'approved') {
    return NextResponse.json({ error: "Website not found" }, { status: 404 });
  }

  if (isAuthenticated) {
    const userId = authCheck;
    const userRole = await getUserRole(userId);

    // Use userId for ownership check
    if (website.userId.toString() !== userId && website.status !== 'approved') {
      if (userRole !== 'superadmin') {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }
    }
  }

  // Always return website as a plain object (with id, not _id)
  return NextResponse.json(website.toJSON());
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await context.params; // <-- Await params

  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;
  const userId = authResult;

  const website = await Website.findById(id);
  if (!website) {
    return NextResponse.json({ error: "Website not found" }, { status: 404 });
  }

  const userRole = await getUserRole(userId);
  const json = await req.json();
  console.log("Updating website with data:", json); 

  if (userRole === 'superadmin') {
    if (json.action === 'approve') {
      website.status = 'approved';
      website.approvedAt = new Date();
      website.rejectionReason = '';
    } else if (json.action === 'reject') {
      website.status = 'rejected';
      website.rejectedAt = new Date();
      website.rejectionReason = json.reason || '';
    }

    await website.save();
    return NextResponse.json(website.toJSON());
  }

  // Owners can update their own pending websites
  if (website.userId.toString() === userId && website.status === 'pending') {
    const allowedUpdates = ['title', 'description', 'url', 'image', 'category', 'price', 'tags'];
    Object.keys(json).forEach(key => {
      if (allowedUpdates.includes(key)) {
        website[key] = json[key];
      }
    });

    await website.save();
    return NextResponse.json(website.toJSON());
  }

  return NextResponse.json({ error: "Access denied" }, { status: 403 });
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await context.params; // <-- Await params

  // Validate ObjectId
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid website ID" }, { status: 400 });
  }

  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;
  const userId = authResult;

  const website = await Website.findById(id);
  if (!website) {
    return NextResponse.json({ error: "Website not found" }, { status: 404 });
  }

  const userRole = await getUserRole(userId);

  // Only owners and superadmins can delete
  if (website.userId.toString() === userId || userRole === 'superadmin') {
    await Website.findByIdAndDelete(id);
    return NextResponse.json({ message: "Website deleted successfully" });
  }

  return NextResponse.json({ error: "Access denied" }, { status: 403 });
}

// Helper function to get user role
async function getUserRole(userId: string): Promise<string> {
  // Implement based on your user model
  return 'consumer'; // Default role
}