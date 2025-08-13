import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWebsite extends Document {
  ownerId: string;
  title: string;
  description: string;
  priceCents: number;
  createdAt: Date;
  updatedAt: Date;
}

const WebsiteSchema = new Schema<IWebsite>({
  ownerId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  priceCents: { type: Number, required: true },
}, { timestamps: true });

const Website: Model<IWebsite> =
  mongoose.models.Website || mongoose.model<IWebsite>("Website", WebsiteSchema);

export default Website;
