import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { UserContent } from "@/models/Content";
import Website from "@/models/Website";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// API route for super admin to view all user content
export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (typeof authResult !== "string") return authResult;
    const userId = authResult;

    // In a real app, you would check if the user is a super admin here
    // For now, we'll assume any authenticated user can access this endpoint

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customerId");
    const websiteId = searchParams.get("websiteId");
    
    // Build query based on provided filters
    const query: any = {};
    if (customerId) query.userId = customerId;
    if (websiteId) query.websiteId = websiteId;

    // Get user content with additional information
    const items = await UserContent.find(query)
      .sort({ createdAt: -1 })
      .select("userId requirements createdAt pdf.filename pdf.size websiteId");
    
    // Fetch website information for each item
    const enrichedItems = await Promise.all(items.map(async (item) => {
      const itemObj = item.toObject();
      
      // If websiteId exists, get website title
      if (itemObj.websiteId) {
        try {
          const website = await Website.findById(itemObj.websiteId);
          if (website) {
            itemObj.websiteTitle = website.title;
          }
        } catch (err) {
          console.error("Error fetching website:", err);
        }
      }
      
      // Get user email from Clerk (in a real app)
      // For now, we'll use a more realistic mock email based on userId
      // Format: user_ID@yourdomain.com
      itemObj.userEmail = `user_${itemObj.userId}@yourdomain.com`;
      
      return itemObj;
    }));

    return NextResponse.json({ items: enrichedItems });
  } catch (err) {
    console.error("/api/admin/user-content GET error", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}