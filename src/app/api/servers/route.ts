import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

// Mock server data - in a real application, this would come from a database
const mockServers = [
  {
    id: "1",
    number: "01",
    serviceName: "VPS-2 (Windows)",
    osType: "windows",
    serviceLocation: "Frankfurt, Germany",
    countryCode: "de",
    ip: "198.51.100.211",
    dueDate: "14 Oct 2027",
    cpuPercentage: 80,
    status: "active"
  },
  {
    id: "2", 
    number: "02",
    serviceName: "VPS-1 (Windows)",
    osType: "windows",
    serviceLocation: "Frankfurt, Germany", 
    countryCode: "de",
    ip: "203.0.113.158",
    dueDate: "14 Oct 2027",
    cpuPercentage: 90,
    status: "active"
  },
  {
    id: "3",
    number: "03", 
    serviceName: "VPS-1 (Ubuntu)",
    osType: "ubuntu",
    serviceLocation: "Paris, France",
    countryCode: "fr",
    ip: "192.0.2.37",
    dueDate: "27 Jun 2027",
    cpuPercentage: 50,
    status: "paused"
  },
  {
    id: "4",
    number: "04",
    serviceName: "Cloud Server (Ubuntu)",
    osType: "ubuntu",
    serviceLocation: "California, US West",
    countryCode: "us",
    ip: "198.51.100.23",
    dueDate: "30 May 2030",
    cpuPercentage: 95,
    status: "active"
  },
  {
    id: "5",
    number: "05",
    serviceName: "Dedicated Server (Windows)",
    osType: "windows",
    serviceLocation: "Virginia, US East",
    countryCode: "us",
    ip: "203.0.113.45",
    dueDate: "15 Dec 2026",
    cpuPercentage: 25,
    status: "inactive"
  }
];

// GET: Fetch all servers for the authenticated user
export async function GET(req: Request) {
  try {
    // In a real application, you would:
    // 1. Authenticate the user
    // const authResult = await requireAuth();
    // if (authResult instanceof NextResponse) return authResult;
    // const userId = authResult;
    
    // 2. Connect to database
    // await dbConnect();
    
    // 3. Fetch servers for this user from database
    // const servers = await ServerModel.find({ userId });
    
    // For now, we'll return mock data
    return NextResponse.json({ servers: mockServers });
  } catch (error) {
    console.error("Error fetching servers:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH: Update server status
export async function PATCH(req: Request) {
  try {
    // In a real application, you would:
    // 1. Authenticate the user
    // const authResult = await requireAuth();
    // if (authResult instanceof NextResponse) return authResult;
    // const userId = authResult;
    
    // 2. Connect to database
    // await dbConnect();
    
    // 3. Get the server ID and new status from request
    const { serverId, status } = await req.json();
    
    // 4. Update the server in the database
    // const updatedServer = await ServerModel.findOneAndUpdate(
    //   { id: serverId, userId }, 
    //   { status },
    //   { new: true }
    // );
    
    // For now, we'll just return success
    return NextResponse.json({ 
      success: true, 
      message: `Server ${serverId} status updated to ${status}` 
    });
  } catch (error) {
    console.error("Error updating server:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}