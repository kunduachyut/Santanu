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

  if (status && ["pending", "approved", "rejected"].includes(status)) {
    filter.status = status;
  }

  if (category) {
    // For category search, use regex to match any category that contains the search term
    // Since category is now an array, we need to search within the array
    filter.category = { $regex: category, $options: 'i' };
  }

  const authCheck = await requireAuth();
  const isAuthenticated = !(authCheck instanceof NextResponse);

  try {
    if (owner === "me") {
      if (!isAuthenticated) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
      }
      const userId = authCheck;
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
          pages: Math.ceil(total / limit),
        },
      });
    }

    // Public access → only approved websites
    if (!isAuthenticated) {
      filter.status = "approved";

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
          pages: Math.ceil(total / limit),
        },
      });
    }

    // Authenticated user role handling
    const userId = authCheck;
    const userRole = await getUserRole(userId);

    if (userRole === "superadmin") {
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
          pages: Math.ceil(total / limit),
        },
      });
    } else if (userRole === "consumer") {
      filter.status = "approved";

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
          pages: Math.ceil(total / limit),
        },
      });
    } else if (userRole === "publisher") {
      const orFilter = {
        $or: [{ ownerId: userId }, { status: "approved" }],
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
          pages: Math.ceil(total / limit),
        },
      });
    }

    // Default fallback → only approved
    filter.status = "approved";
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
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error in websites API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await dbConnect();
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;
  const userId = authResult;

  try {
    const json = await req.json();
    const { title, url, description, priceCents, category, tags, DA, PA, Spam, OrganicTraffic, DR, RD, primaryCountry } = json;

    if (!title || !url || !description || priceCents === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check for existing website with same URL (excluding rejected and priceConflict ones)
    const existingWebsite = await Website.findOne({ 
      url, 
      status: { $in: ['pending', 'approved'] } // Only check active submissions
    });

    console.log('🔍 URL conflict check:', {
      url,
      existingFound: !!existingWebsite,
      existingStatus: existingWebsite?.status,
      existingUserId: existingWebsite?.userId,
      newUserId: userId
    });

    // ✅ Normalize tags into array of strings
    let normalizedTags: string[] = [];
    if (typeof tags === "string") {
      normalizedTags = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
    } else if (Array.isArray(tags)) {
      normalizedTags = tags.map((tag) => String(tag).trim()).filter((tag) => tag);
    }

    // ✅ Normalize categories into array of strings
    let normalizedCategories: string[] = [];
    if (typeof category === "string") {
      // If it's a comma-separated string, split it
      if (category.includes(",")) {
        normalizedCategories = category
          .split(",")
          .map((cat) => cat.trim())
          .filter((cat) => cat);
      } else {
        // Single category
        normalizedCategories = [category.trim()];
      }
    } else if (Array.isArray(category)) {
      normalizedCategories = category.map((cat) => String(cat).trim()).filter((cat) => cat);
    }

    if (existingWebsite) {
      console.log('🔍 Found existing website:', {
        existingUserId: existingWebsite.userId,
        newUserId: userId,
        sameUser: existingWebsite.userId === userId,
        existingStatus: existingWebsite.status
      });
      
      // Check if it's the same user trying to submit the same URL
      if (existingWebsite.userId === userId) {
        console.log('❌ Same user attempting duplicate submission');
        return NextResponse.json({
          error: "This URL has already been published by you. You cannot submit the same URL twice."
        }, { status: 400 });
      }
      
      console.log('⚔️ Different users - creating price conflict');
      // Different user - create price conflict
      // Create new website first
      const newSite = await Website.create({
        title,
        url,
        description,
        priceCents: Number(priceCents),
        price: Number(priceCents) / 100,
        category: normalizedCategories, // Use normalized categories
        tags: normalizedTags,
        primaryCountry: primaryCountry || undefined, // Add primaryCountry field
        DA: DA ? Number(DA) : undefined,
        PA: PA ? Number(PA) : undefined,
        Spam: Spam ? Number(Spam) : undefined,
        OrganicTraffic: OrganicTraffic ? Number(OrganicTraffic) : undefined,
        DR: DR ? Number(DR) : undefined,
        RD: RD || undefined,
        userId: userId,
        image: "/default-website-image.png",
        status: "pending", // Will be changed to priceConflict
      });

      console.log('✅ New website created:', { id: newSite._id, status: newSite.status });
      
      try {
        // Create price conflict between existing and new website
        await newSite.createPriceConflict(existingWebsite);
        console.log('✅ Price conflict created successfully');
        
        // Reload the updated website to get the new status
        const updatedNewSite = await Website.findById(newSite._id);
        const updatedExistingSite = await Website.findById(existingWebsite._id);
        
        console.log('🔄 After conflict creation:', {
          newSite: { id: updatedNewSite?._id, status: updatedNewSite?.status, conflictGroup: updatedNewSite?.conflictGroup },
          existingSite: { id: updatedExistingSite?._id, status: updatedExistingSite?.status, conflictGroup: updatedExistingSite?.conflictGroup }
        });
        
      } catch (conflictError) {
        console.error('❌ Error creating price conflict:', conflictError);
        // If conflict creation fails, we should still return the website but log the error
      }

      return NextResponse.json({
        ...newSite.toJSON(),
        message: "Website submitted successfully! Since this URL already exists from another user, both submissions are now in price conflict review for admin decision."
      }, { status: 201 });
    }

    // No conflict - create normally

    const site = await Website.create({
      title,
      url,
      description,
      priceCents: Number(priceCents),
      price: Number(priceCents) / 100,
      category: normalizedCategories, // Use normalized categories
      tags: normalizedTags,
      primaryCountry: primaryCountry || undefined, // Add primaryCountry field
      DA: DA ? Number(DA) : undefined,
      PA: PA ? Number(PA) : undefined,
      Spam: Spam ? Number(Spam) : undefined,
      OrganicTraffic: OrganicTraffic ? Number(OrganicTraffic) : undefined,
      DR: DR ? Number(DR) : undefined,
      RD: RD || undefined,
      userId: userId,
      image: "/default-website-image.png",
      status: "pending",
    });

    return NextResponse.json(site, { status: 201 });
  } catch (error: any) {
    console.error("Error creating website:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
    }

    // Remove the old duplicate URL error handling since we now allow duplicates
    // if (error.code === 11000) {
    //   return NextResponse.json({ error: "Website with this URL already exists" }, { status: 400 });
    // }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function getUserRole(userId: string): Promise<string> {
  // implement with your user model
  return "superadmin";
}
