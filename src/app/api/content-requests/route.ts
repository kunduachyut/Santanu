// app/api/content-requests/route.ts
import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for demo purposes (replace with database in production)
let contentRequests: any[] = [];

export async function GET() {
  try {
    // Return all content requests for super admin
    return NextResponse.json(contentRequests);
  } catch (error) {
    console.error('Failed to fetch content requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content requests' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { websiteId, websiteTitle, topic, wordCount, customerId, customerEmail } = await req.json();
    
    if (!websiteId || !topic) {
      return NextResponse.json(
        { error: 'Website ID and topic are required' },
        { status: 400 }
      );
    }

    // Create a content request
    const contentRequest = {
      id: Math.random().toString(36).substr(2, 9),
      websiteId,
      websiteTitle,
      topic,
      wordCount,
      customerId,
      customerEmail,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    contentRequests.push(contentRequest);

    return NextResponse.json({ 
      success: true, 
      message: 'Content request submitted successfully',
      request: contentRequest
    });

  } catch (error) {
    console.error('Content request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}