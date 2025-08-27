// app/api/purchases/route.ts (updated)
import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for demo purposes (replace with database in production)
let purchaseRequests: any[] = [];

export async function GET() {
  try {
    // Return all purchase requests for super admin
    return NextResponse.json(purchaseRequests);
  } catch (error) {
    console.error('Failed to fetch purchase requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch purchase requests' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { items, customerId, customerEmail } = await req.json();
    
    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Items array is required' },
        { status: 400 }
      );
    }

    // Process each item in the cart
    const purchaseResults = [];
    
    for (const item of items) {
      // Create a purchase request for each item
      const purchase = await createPurchase(item, customerId, customerEmail);
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
async function createPurchase(item: any, customerId: string, customerEmail: string) {
  // This would typically create a database record
  return {
    id: Math.random().toString(36).substr(2, 9),
    websiteId: item.websiteId,
    websiteTitle: item.title,
    quantity: item.quantity,
    priceCents: item.priceCents,
    totalCents: item.priceCents * item.quantity,
    customerId,
    customerEmail,
    status: 'pending',
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