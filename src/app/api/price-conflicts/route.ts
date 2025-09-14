import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Website from "@/models/Website";
import { requireAuth } from "@/lib/auth";

async function getUserRole(userId: string): Promise<string> {
  if (
    userId === "user_31H9OiuHhU5R5ITj5AlP4aJBosn" ||
    userId === "user_31XHCLTOeZ74gf9COPnuyjHpQY6"
  )
    return "superadmin";
  return "consumer";
}

// GET: Fetch all price conflicts
export async function GET(req: Request) {
  await dbConnect();
  
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;
  const userId = authResult;

  // Check if user is super admin
  const userRole = await getUserRole(userId);
  if (userRole !== "superadmin") {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }

  try {
    // Find all websites with price conflicts, grouped by conflictGroup
    const conflictWebsites = await Website.find({ 
      status: 'priceConflict' 
    }).sort({ createdAt: -1 });

    // Group by conflictGroup
    const conflictGroups: Record<string, any[]> = {};
    
    conflictWebsites.forEach(website => {
      if (website.conflictGroup) {
        if (!conflictGroups[website.conflictGroup]) {
          conflictGroups[website.conflictGroup] = [];
        }
        conflictGroups[website.conflictGroup].push(website);
      }
    });

    // Convert to array format for easier frontend consumption
    const conflicts = Object.entries(conflictGroups).map(([groupId, websites]) => ({
      groupId,
      websites: websites.sort((a, b) => {
        // Sort so original website comes first
        if (a.isOriginal && !b.isOriginal) return -1;
        if (!a.isOriginal && b.isOriginal) return 1;
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }),
      url: websites[0]?.url,
      originalPrice: websites.find(w => w.isOriginal)?.price,
      newPrice: websites.find(w => !w.isOriginal)?.price
    }));

    return NextResponse.json({ conflicts });
  } catch (error) {
    console.error("Error fetching price conflicts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST: Resolve a price conflict
export async function POST(req: Request) {
  await dbConnect();
  
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;
  const userId = authResult;

  // Check if user is super admin
  const userRole = await getUserRole(userId);
  if (userRole !== "superadmin") {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }

  try {
    const { conflictGroup, selectedWebsiteId, reason } = await req.json();

    if (!conflictGroup || !selectedWebsiteId) {
      return NextResponse.json({ 
        error: "Missing required fields: conflictGroup and selectedWebsiteId" 
      }, { status: 400 });
    }

    // Find all websites in the conflict group
    const conflictWebsites = await Website.find({ 
      conflictGroup,
      status: 'priceConflict'
    });

    if (conflictWebsites.length === 0) {
      return NextResponse.json({ 
        error: "No websites found in conflict group" 
      }, { status: 404 });
    }

    // Find the selected website
    const selectedWebsite = conflictWebsites.find(
      w => w._id.toString() === selectedWebsiteId
    );

    if (!selectedWebsite) {
      return NextResponse.json({ 
        error: "Selected website not found in conflict group" 
      }, { status: 404 });
    }

    // Approve the selected website
    await selectedWebsite.approve(reason || `Selected as winner in price conflict resolution`);
    
    // Reject all other websites in the conflict
    const rejectionPromises = conflictWebsites
      .filter(w => w._id.toString() !== selectedWebsiteId)
      .map(w => w.reject(
        reason || `Rejected due to price conflict - another submission was selected`
      ));

    await Promise.all(rejectionPromises);

    return NextResponse.json({ 
      message: "Price conflict resolved successfully",
      approved: selectedWebsite._id,
      rejected: conflictWebsites
        .filter(w => w._id.toString() !== selectedWebsiteId)
        .map(w => w._id)
    });

  } catch (error) {
    console.error("Error resolving price conflict:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}