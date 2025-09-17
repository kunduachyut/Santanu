// app/api/purchases/route.ts (updated)
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getOrCreateUser } from '@/lib/user';

// In-memory storage for demo purposes (replace with database in production)
let purchaseRequests: any[] = [];

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is super admin (you might want to implement proper role checking)
    const url = new URL(req.url);
    const isSuperAdmin = url.searchParams.get('role') === 'superadmin';
    
    // If super admin, return all purchases, otherwise filter for current user
    const userPurchases = isSuperAdmin 
      ? purchaseRequests 
      : purchaseRequests.filter(purchase => purchase.customerId === userId);
    
    return NextResponse.json(userPurchases);
  } catch (error) {
    console.error('Failed to fetch purchases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch purchases' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { items, contentSelections } = await req.json();
    
    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Items array is required' },
        { status: 400 }
      );
    }

    // Get or create user to fetch real email
    const user = await getOrCreateUser(userId);

    // Process each item in the cart
    const purchaseResults = [];
    
    for (const item of items) {
      // Get content selection for this item
      const contentSelection = contentSelections?.[item.websiteId];
      
      // Create a purchase request for each item
      const purchase = await createPurchase(item, userId, user.email, contentSelection);
      purchaseResults.push(purchase);
      purchaseRequests.push(purchase);
    }

    // For now, we'll just return a success message
    return NextResponse.json({ 
      success: true, 
      message: 'Purchase requests sent to administrator for approval',
      purchases: purchaseResults
    });

  } catch (error) {
    console.error('Purchase error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Mock function to create a purchase
async function createPurchase(item: any, customerId: string, customerEmail: string, contentSelection?: string) {
  // This would typically create a database record
  return {
    id: Math.random().toString(36).substr(2, 9),
    _id: Math.random().toString(36).substr(2, 9), // Add _id for compatibility
    websiteId: item.websiteId,
    websiteTitle: item.title,
    priceCents: item.priceCents,
    totalCents: item.priceCents,
    amountCents: item.priceCents, // Add amountCents for compatibility
    customerId,
    customerEmail,
    status: 'pending',
    contentType: contentSelection || null, // 'content' for My Content, 'request' for Request Content
    createdAt: new Date().toISOString()
  };
}

// API endpoint to update purchase status
export async function PATCH(req: NextRequest) {
  try {
    const { purchaseId, status } = await req.json();
    
    if (!purchaseId || !status) {
      return NextResponse.json(
        { error: 'Purchase ID and status are required' },
        { status: 400 }
      );
    }

    // Find and update the purchase request
    const purchaseIndex = purchaseRequests.findIndex(p => p.id === purchaseId);
    if (purchaseIndex === -1) {
      return NextResponse.json(
        { error: 'Purchase request not found' },
        { status: 404 }
      );
    }

    const allowedStatuses = ["pending", "ongoing", "pendingPayment", "approved", "rejected"];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }
    purchaseRequests[purchaseIndex].status = status;
    purchaseRequests[purchaseIndex].updatedAt = new Date().toISOString();

    return NextResponse.json({ 
      success: true, 
      message: 'Purchase status updated',
      purchase: purchaseRequests[purchaseIndex]
    });

  } catch (error) {
    console.error('Update purchase error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}