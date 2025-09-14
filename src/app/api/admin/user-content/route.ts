import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { UserContent } from "@/models/Content";
import Website from "@/models/Website";
import { getOrCreateUser } from "@/lib/user";

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
    const searchQuery = searchParams.get("search"); // For website name search
    const startDate = searchParams.get("startDate"); // For date range filter
    const endDate = searchParams.get("endDate"); // For date range filter
    
    // Build query based on provided filters
    const query: any = {};
    if (customerId) query.userId = customerId;
    if (websiteId) query.websiteId = websiteId;
    
    // Add date range filter with proper date handling
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        // Create a date at the start of the day
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        query.createdAt.$gte = start;
      }
      if (endDate) {
        // Create a date at the end of the day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    // Get user content with additional information
    const items = await UserContent.find(query)
      .sort({ createdAt: -1 })
      .select("userId requirements createdAt pdf.filename pdf.size websiteId");
    
    // Fetch website information for each item
    let enrichedItems = await Promise.all(items.map(async (item) => {
      const itemObj = item.toObject() as any;
      
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
      
      // Get user email from Clerk
      try {
        const user = await getOrCreateUser(itemObj.userId);
        itemObj.userEmail = user.email;
      } catch (err) {
        console.error(`Error fetching user ${itemObj.userId}:`, err);
        itemObj.userEmail = `user_${itemObj.userId}@yourdomain.com`; // Fallback
      }
      
      return itemObj;
    }));
    
    // Apply search filter after enrichment (filter by website title or user email)
    if (searchQuery) {
      enrichedItems = enrichedItems.filter(item => 
        (item.websiteTitle && item.websiteTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.userEmail && item.userEmail.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return NextResponse.json({ items: enrichedItems });
  } catch (err) {
    console.error("/api/admin/user-content GET error", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}