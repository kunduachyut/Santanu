import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Website from "@/models/Website";
import { requireAuth } from "@/lib/auth";
import { WebsiteCreateSchema } from "@/utils/types";

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const owner = searchParams.get("owner");

  if (owner === "me") {
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) return authResult;
    const userId = authResult;

    const websites = await Website.find({ ownerId: userId })
      .sort({ createdAt: -1 })
      .exec();
    return NextResponse.json(websites);
  }

  const websites = await Website.find().sort({ createdAt: -1 }).exec();
  return NextResponse.json(websites);
}

export async function POST(req: Request) {
  await dbConnect();
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;
  const userId = authResult;

  const json = await req.json();
  const parsed = WebsiteCreateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const site = await Website.create({ ...parsed.data, ownerId: userId });
  return NextResponse.json(site, { status: 201 });
}
