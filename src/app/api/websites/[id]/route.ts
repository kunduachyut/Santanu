// src/app/api/websites/[id]/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Website from "@/models/Website";
import { requireAuth } from "@/lib/auth";
import { Types } from "mongoose";

export async function DELETE(_: Request, { params }: { params: { id: string }}) {
  await dbConnect();
  const userId = requireAuth();
  if (!Types.ObjectId.isValid(params.id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const site = await Website.findById(params.id);
  if (!site) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (site.ownerId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await site.deleteOne();
  return NextResponse.json({ ok: true });
}
