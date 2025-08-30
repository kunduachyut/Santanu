import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContentRequest extends Document {
  websiteId: string;
  websiteTitle?: string;
  topic: string;
  wordCount?: number;
  customerId: string;
  customerEmail?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const ContentRequestSchema: Schema<IContentRequest> = new Schema(
  {
    websiteId: { type: String, required: true },
    websiteTitle: { type: String },
    topic: { type: String, required: true },
    wordCount: { type: Number },
    customerId: { type: String, required: true },
    customerEmail: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const ContentRequest: Model<IContentRequest> =
  mongoose.models.ContentRequest ||
  mongoose.model<IContentRequest>("ContentRequest", ContentRequestSchema);

export default ContentRequest;
