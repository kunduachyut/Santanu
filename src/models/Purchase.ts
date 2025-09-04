import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { IWebsite } from "./Website";

export interface IPurchase extends Document {
  websiteId: Types.ObjectId | IWebsite;
  buyerId: string;
  amountCents: number;
  status: "pending" | "paid" | "rejected";
  stripeSessionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PurchaseSchema = new Schema<IPurchase>({
  websiteId: { type: Schema.Types.ObjectId, ref: "Website", required: true },
  buyerId: { type: String, required: true },
  amountCents: { type: Number, required: true },
  status: { type: String, enum: ["pending", "paid", "rejected"], required: true },
  stripeSessionId: { type: String },
}, { timestamps: true });

const Purchase: Model<IPurchase> =
  mongoose.models.Purchase || mongoose.model<IPurchase>("Purchase", PurchaseSchema);

export default Purchase;
