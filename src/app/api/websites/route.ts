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
    filter.category = category;
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
    const { title, url, description, priceCents, category, tags, DA, PA, Spam, OrganicTraffic, DR, RD } = json;

    if (!title || !url || !description || priceCents === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

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

    const site = await Website.create({
      title,
      url,
      description,
      priceCents: Number(priceCents),
      price: Number(priceCents) / 100,
      category: category || "",
      tags: normalizedTags,
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

    if (error.code === 11000) {
      return NextResponse.json({ error: "Website with this URL already exists" }, { status: 400 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function getUserRole(userId: string): Promise<string> {
  // implement with your user model
  return "superadmin";
}
