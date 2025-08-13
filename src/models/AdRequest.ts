import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IAdRequest extends Document {
  websiteId: Types.ObjectId;
  buyerId: string;
  publisherId: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdRequestSchema = new Schema<IAdRequest>({
  websiteId: { type: Schema.Types.ObjectId, ref: "Website", required: true },
  buyerId: { type: String, required: true },
  publisherId: { type: String, required: true },
  message: { type: String, required: true },
}, { timestamps: true });

const AdRequest: Model<IAdRequest> =
  mongoose.models.AdRequest || mongoose.model<IAdRequest>("AdRequest", AdRequestSchema);

export default AdRequest;
