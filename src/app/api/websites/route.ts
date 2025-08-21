import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Website from "@/models/Website";
import { requireAuth } from "@/lib/auth";
import { WebsiteCreateSchema } from "@/utils/types";

// Helper function to safely count documents
async function safeCountDocuments(filter: any): Promise<number> {
  try {
    const result = await Website.countDocuments(filter).exec();
    return result;
  } catch (error) {
    console.error("Error counting documents:", error);
    return 0;
  }
}

export async function GET(req: Request) {
  await dbConnect();
  
  const { searchParams } = new URL(req.url);
  const owner = searchParams.get("owner");
  const status = searchParams.get("status");
  const category = searchParams.get("category");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  // Build filter object
  let filter: any = {};

  // Handle status filtering
  if (status && ['pending', 'approved', 'rejected'].includes(status)) {
    filter.status = status;
  }

  // Handle category filtering
  if (category) {
    filter.category = category;
  }

  // Check if user is authenticated
  const authCheck = await requireAuth();
  const isAuthenticated = !(authCheck instanceof NextResponse);
  
  try {
    if (owner === "me") {
      if (!isAuthenticated) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
      }
      const userId = authCheck;
      console.log("Authenticated user ID:", userId);
      // Users can only see their own websites with optional status filter
      filter.userId = userId;
      const websites = await Website.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();
      
      const total = await safeCountDocuments(filter);
      
      return NextResponse.json({
        websites,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    }

    // Public access - only show approved websites
    if (!isAuthenticated) {
      filter.status = 'approved';
      
      const websites = await Website.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();
      
      const total = await safeCountDocuments(filter);
      
      return NextResponse.json({
        websites,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    }

    // Authenticated user with specific role-based filtering
    const userId = authCheck;
    const userRole = await getUserRole(userId);
    console.log("Authenticated user role:", userRole);
            console.log("Filter for authenticated user:", filter);
    if (userRole === 'superadmin') {
      // Superadmins can see all websites with any status
            // console.log("Filter for authenticated user:", filter);
      const websites = await Website.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();
      
      const total = await safeCountDocuments(filter);
      
      return NextResponse.json({
        websites,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } else if (userRole === 'consumer') {
      // Consumers can only see approved websites
      filter.status = 'approved';
      
      const websites = await Website.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();
      
      const total = await safeCountDocuments(filter);
      
      return NextResponse.json({
        websites,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } else if (userRole === 'publisher') {
      // Publishers can see their own websites and approved ones
      const orFilter = {
        $or: [
          { ownerId: userId },
          { status: 'approved' }
        ]
      };
      
      const websites = await Website.find(orFilter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();
      
      const total = await safeCountDocuments(orFilter);
      
      return NextResponse.json({
        websites,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    }

    // Default fallback - only approved websites
    filter.status = 'approved';
    const websites = await Website.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    
    const total = await safeCountDocuments(filter);
    
    return NextResponse.json({
      websites,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error in websites API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
export async function POST(req: Request) {
  await dbConnect();
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;
  const userId = authResult;

  try {
    const json = await req.json();
    
    const parsed = WebsiteCreateSchema.safeParse(json);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    // Create website with pending status by default
    const site = await Website.create({ 
      ...parsed.data,
      userId: userId, // Keep as string - update schema to accept string
      price: parsed.data.priceCents / 100, // Convert cents to dollars
      image: parsed.data.image || '/default-website-image.png', // Provide default image if not provided
      status: 'pending'
    });
    
    return NextResponse.json(site, { status: 201 });
  } catch (error) {
    console.error("Error creating website:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function getUserRole(userId: string): Promise<string> {
  // Implement based on your user model
  return 'superadmin';
}