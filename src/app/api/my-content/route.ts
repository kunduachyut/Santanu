import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { UserContent } from "@/models/Content";

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

    const arrayBuffer = await fileLike.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const created = await UserContent.create({
      userId,
      websiteId,
      requirements,
      pdf: {
        data: buffer,
        contentType: fileLike.type || "application/pdf",
        filename: fileLike.name,
        size: fileLike.size,
      },
    });

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
    const websiteId = searchParams.get("websiteId") || undefined as any;
    const items = await UserContent.find(
      websiteId ? { userId, websiteId } : { userId }
    )
      .sort({ createdAt: -1 })
      .select("requirements createdAt pdf.filename pdf.size websiteId");

    return NextResponse.json({ items });
  } catch (err) {
    console.error("/api/my-content GET error", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


