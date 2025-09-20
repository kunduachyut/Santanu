import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import AdminRole from "@/models/AdminRole";

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const roles = await AdminRole.find({}).lean().exec();
    return NextResponse.json({ success: true, roles });
  } catch (err) {
    console.error("GET /api/admin-roles error", err);
    return NextResponse.json({ success: false, error: "Failed to load roles" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const json = await req.json();
    const { email, role } = json;
    if (!email || !role || !["websites", "requests", "super"].includes(role)) {
      return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
    }

    // For websites/requests keep a single assignment (upsert)
    if (role === "websites" || role === "requests") {
      const existing = await AdminRole.findOne({ role }).exec();
      if (existing) {
        existing.email = email.toLowerCase().trim();
        await existing.save();
        return NextResponse.json({ success: true, role: existing });
      }
      const created = await AdminRole.create({ email: email.toLowerCase().trim(), role });
      return NextResponse.json({ success: true, role: created });
    }

    // For super role allow multiple super admins (create new document)
    const created = await AdminRole.create({ email: email.toLowerCase().trim(), role });
    return NextResponse.json({ success: true, role: created });
  } catch (err) {
    console.error("POST /api/admin-roles error", err);
    return NextResponse.json({ success: false, error: "Failed to save role" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const role = searchParams.get("role");
    if (!id && !role) {
      return NextResponse.json({ success: false, error: "Provide id or role to delete" }, { status: 400 });
    }
    let res;
    if (id) {
      res = await AdminRole.findByIdAndDelete(id).exec();
    } else {
      // delete by role (this deletes the first match)
      res = await AdminRole.findOneAndDelete({ role }).exec();
    }
    return NextResponse.json({ success: true, deleted: !!res });
  } catch (err) {
    console.error("DELETE /api/admin-roles error", err);
    return NextResponse.json({ success: false, error: "Failed to delete role" }, { status: 500 });
  }
}