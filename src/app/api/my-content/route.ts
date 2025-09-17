import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { UserContent } from "@/models/Content";
import Website from "@/models/Website";
import User from "@/models/User";
import Purchase from "@/models/Purchase";
import { Types } from "mongoose";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (typeof authResult !== "string") return authResult;
    const userId = authResult;

    await dbConnect();

    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
    }

    const formData = await req.formData();
    const file = formData.get("pdfFile");
    const requirements = String(formData.get("requirements") || "").trim();
    const websiteId = String(formData.get("websiteId") || "").trim() || undefined;
    const purchaseId = String(formData.get("purchaseId") || "").trim() || undefined;

    if (!requirements) {
      return NextResponse.json({ error: "requirements is required" }, { status: 400 });
    }
    // Avoid instanceof checks across runtimes; duck-type instead
    const isFileLike = file && typeof (file as any).arrayBuffer === "function" && typeof (file as any).name === "string";
    if (!isFileLike) {
      return NextResponse.json({ error: "pdfFile is required" }, { status: 400 });
    }
    const fileLike = file as unknown as { type?: string; name: string; size?: number; arrayBuffer: () => Promise<ArrayBuffer> };
    if (fileLike.type && fileLike.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
    }
    if (fileLike.size && fileLike.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 10MB" }, { status: 400 });
    }

    // Get website information if websiteId is provided
    let websiteTitle = "Untitled";
    if (websiteId) {
      try {
        const website = await Website.findById(websiteId);
        if (website) {
          websiteTitle = website.title;
        }
      } catch (err) {
        console.error("Error fetching website:", err);
      }
    }

    // Get user information
    let userEmail = "unknown";
    try {
      const user = await (User as any).findOne({ clerkId: userId });
      if (user) {
        userEmail = user.email;
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    }

    // Create new filename with the format: website name_user email_date_real name
    const originalFileName = fileLike.name.replace(/\.[^/.]+$/, ""); // Remove extension
    const dateStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const newFileName = `${websiteTitle}_${userEmail}_${dateStr}_${originalFileName}.pdf`;

    const arrayBuffer = await fileLike.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create content with proper purchaseId linking
    const created = await UserContent.create({
      userId,
      websiteId,
      purchaseId: purchaseId ? new Types.ObjectId(purchaseId) : undefined, // Use purchaseId if provided
      requirements,
      pdf: {
        data: buffer,
        contentType: fileLike.type || "application/pdf",
        filename: newFileName, // Use the new filename
        size: fileLike.size,
      },
    });

    // If we have a purchaseId, link this content to the purchase using direct database update
    if (purchaseId && Types.ObjectId.isValid(purchaseId)) {
      try {
        // Use $addToSet to avoid duplicates
        await Purchase.findByIdAndUpdate(
          purchaseId,
          { $addToSet: { contentIds: created._id } },
          { new: true }
        );
      } catch (err) {
        console.error("Error linking content to purchase:", err);
      }
    }

    return NextResponse.json({ id: created._id }, { status: 201 });
  } catch (err: any) {
    console.error("/api/my-content error", err);
    const message = typeof err?.message === "string" ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (typeof authResult !== "string") return authResult;
    const userId = authResult;

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const websiteId = searchParams.get("websiteId") || undefined;
    const purchaseId = searchParams.get("purchaseId") || undefined;
    
    // Build query based on provided parameters
    const query: any = { userId };
    if (websiteId) query.websiteId = websiteId;
    if (purchaseId && Types.ObjectId.isValid(purchaseId)) query.purchaseId = new Types.ObjectId(purchaseId);
    
    const items = await UserContent.find(query)
      .sort({ createdAt: -1 })
      .select("requirements createdAt pdf.filename pdf.size websiteId purchaseId");

    return NextResponse.json({ items });
  } catch (err) {
    console.error("/api/my-content GET error", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}