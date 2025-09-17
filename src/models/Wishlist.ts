import mongoose from 'mongoose';

export interface IWishlist extends mongoose.Document {
  userId: string; // Clerk user ID
  websiteIds: string[]; // Array of website IDs in the wishlist
  createdAt: Date;
  updatedAt: Date;
}

const WishlistSchema = new mongoose.Schema<IWishlist>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  websiteIds: [{
    type: String,
    required: true
  }]
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret.__v;
      return ret;
    }
  }
});

// Ensure unique index on userId
WishlistSchema.index({ userId: 1 }, { unique: true });

const Wishlist = mongoose.models.Wishlist || mongoose.model<IWishlist>('Wishlist', WishlistSchema);

export default Wishlist;