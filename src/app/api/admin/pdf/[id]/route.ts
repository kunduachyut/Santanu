import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { UserContent } from "@/models/Content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// API route to serve PDF files for super admin
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await requireAuth();
    if (typeof authResult !== "string") return authResult;
    const userId = authResult;

    // In a real app, you would check if the user is a super admin here
    // For now, we'll assume any authenticated user can access this endpoint

    await dbConnect();

    const contentId = params.id;
    if (!contentId) {
      return NextResponse.json({ error: "Content ID is required" }, { status: 400 });
    }

    // Find the content with the PDF
    const content = await UserContent.findById(contentId).select("pdf");
    if (!content || !content.pdf || !content.pdf.data) {
      return NextResponse.json({ error: "PDF not found" }, { status: 404 });
    }

    // Set appropriate headers for PDF file
    const headers = new Headers();
    headers.set("Content-Type", content.pdf.contentType || "application/pdf");
    headers.set("Content-Disposition", `inline; filename="${content.pdf.filename || 'document.pdf'}"`); 

    // Return the PDF data
    return new NextResponse(content.pdf.data, {
      status: 200,
      headers,
    });
  } catch (err) {
    console.error("/api/admin/pdf/[id] GET error", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}