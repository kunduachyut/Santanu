import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Website from "@/models/Website";
import Purchase from "@/models/Purchase";
import { requireAuth } from "@/lib/auth";
import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey ? new Stripe(stripeKey, { apiVersion: "2025-07-30.basil" }) : null;

export async function GET() {
  await dbConnect();
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;
  const userId = authResult;

  const purchases = await Purchase.find({ buyerId: userId })
    .populate("websiteId")
    .exec();
  return NextResponse.json(purchases);
}

export async function POST(req: Request) {
  await dbConnect();
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;
  const buyerId = authResult;

  const { websiteId } = await req.json();
  const website = await Website.findById(websiteId).exec();
  if (!website) return NextResponse.json({ error: "Website not found" }, { status: 404 });

  if (stripe) {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: website.title, description: website.description },
          unit_amount: website.priceCents,
        },
        quantity: 1,
      }],
      metadata: { websiteId: String(website._id), buyerId },
      success_url: process.env.STRIPE_SUCCESS_URL!,
      cancel_url: process.env.STRIPE_CANCEL_URL!,
    });

    await Purchase.create({
      websiteId: website._id,
      buyerId,
      amountCents: website.priceCents,
      status: "pending",
      stripeSessionId: session.id,
    });

    return NextResponse.json({ checkoutUrl: session.url }, { status: 201 });
  }

  const purchase = await Purchase.create({
    websiteId: website._id,
    buyerId,
    amountCents: website.priceCents,
    status: "paid",
  });
  return NextResponse.json(purchase, { status: 201 });
}
