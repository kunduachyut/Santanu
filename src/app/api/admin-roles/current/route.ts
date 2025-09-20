import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import AdminRole from "@/models/AdminRole";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    // auth() returns a promise — await it
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ role: null, isSuper: false });

    // get Clerk client & user info
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user?.emailAddresses?.[0]?.emailAddress?.toLowerCase() || null;

    // Identify superadmins:
    // - by environment email (SUPER_ADMIN_EMAIL)
    // - or by environment list of userIds (SUPER_ADMIN_USER_IDS = "id1,id2")
    // use env if provided, otherwise fallback to the desired dev email
    const superAdminEmail = (process.env.SUPER_ADMIN_EMAIL || "kunduachyut19@gmail.com").toLowerCase();
    const superAdminIds = (process.env.SUPER_ADMIN_USER_IDS || "").split(",").map(s => s.trim()).filter(Boolean);
    
    const isSuper =
      !!(superAdminEmail && email && email === superAdminEmail) ||
      superAdminIds.includes(userId);

    if (isSuper) {
      // Super admin gets full visibility (role not used)
      return NextResponse.json({ role: null, isSuper: true });
    }

    // Not super: check if a sub-admin role exists for this email
    if (!email) return NextResponse.json({ role: null, isSuper: false });

    const roleDoc = await AdminRole.findOne({ email }).lean().exec();
    return NextResponse.json({ role: roleDoc?.role || null, isSuper: false });
  } catch (err) {
    console.error("GET /api/admin-roles/current error", err);
    return NextResponse.json({ role: null, isSuper: false });
  }
}