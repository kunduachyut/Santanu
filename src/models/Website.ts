import mongoose from 'mongoose';

// Define the Website interface
export interface IWebsite extends mongoose.Document {
  title: string;
  url: string;
  description: string;
  category: string;
  price: number;
  image: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  views: number;
  clicks: number;
  featured: boolean;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Virtuals
  formattedCreatedAt: string;
  isNew: boolean;
  
  // Methods
  approve(reason?: string): Promise<IWebsite>;
  reject(reason: string): Promise<IWebsite>;
  isPending(): boolean;
  isApproved(): boolean;
  isRejected(): boolean;
}

// Define the static methods
interface WebsiteModel extends mongoose.Model<IWebsite> {
  findByStatus(status: string): mongoose.Query<IWebsite[], IWebsite>;
  findPending(): mongoose.Query<IWebsite[], IWebsite>;
  findApproved(): mongoose.Query<IWebsite[], IWebsite>;
  findRejected(): mongoose.Query<IWebsite[], IWebsite>;
  findByUser(userId: string, status?: string): mongoose.Query<IWebsite[], IWebsite>;
}

const WebsiteSchema = new mongoose.Schema({
  // Existing fields
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  url: {
    type: String,
    required: [true, 'URL is required'],
    validate: {
      validator: function(v: string) {
        return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(v);
      },
      message: 'Please enter a valid URL'
    }
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['ecommerce', 'blog', 'portfolio', 'business', 'educational', 'entertainment', 'other']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  image: {
    type: String,
    required: false, // Change to false
    default: '/default-website-image.png'
  },
  userId: {
    type: String,
    required: true
  },
  // New approval workflow fields
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvedAt: {
    type: Date,
    default: null
  },
  rejectedAt: {
    type: Date,
    default: null
  },
  rejectionReason: {
    type: String,
    trim: true,
    maxlength: [500, 'Rejection reason cannot exceed 500 characters'],
    default: ''
  },
  // Additional metadata
  views: {
    type: Number,
    default: 0
  },
  clicks: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  // SEO fields
  metaTitle: {
    type: String,
    trim: true,
    maxlength: [60, 'Meta title cannot exceed 60 characters']
  },
  metaDescription: {
    type: String,
    trim: true,
    maxlength: [160, 'Meta description cannot exceed 160 characters']
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
WebsiteSchema.index({ userId: 1, status: 1 });
WebsiteSchema.index({ status: 1, createdAt: -1 });
WebsiteSchema.index({ category: 1, status: 1 });

// Virtual for formatted date
// WebsiteSchema.virtual('formattedCreatedAt').get(function(this: IWebsite) {
//   return this.createdAt.toLocaleDateString();
// });

// Virtual for isNew (less than 7 days old)
WebsiteSchema.virtual('isNew').get(function(this: IWebsite) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return this.createdAt > sevenDaysAgo;
});

// Method to approve website
WebsiteSchema.methods.approve = function(this: IWebsite, reason?: string) {
  this.status = 'approved';
  this.approvedAt = new Date();
  this.rejectionReason = '';
  return this.save();
};

// Method to reject website
WebsiteSchema.methods.reject = function(this: IWebsite, reason: string = '') {
  this.status = 'rejected';
  this.rejectedAt = new Date();
  this.rejectionReason = reason;
  return this.save();
};

// Method to check if website is pending
WebsiteSchema.methods.isPending = function(this: IWebsite) {
  return this.status === 'pending';
};

// Method to check if website is approved
WebsiteSchema.methods.isApproved = function(this: IWebsite) {
  return this.status === 'approved';
};

// Method to check if website is rejected
WebsiteSchema.methods.isRejected = function(this: IWebsite) {
  return this.status === 'rejected';
};

// Static method to get websites by status
WebsiteSchema.statics.findByStatus = function(status: string) {
  return this.find({ status }).sort({ createdAt: -1 });
};

// Static method to get pending websites
WebsiteSchema.statics.findPending = function() {
  return this.find({ status: 'pending' }).sort({ createdAt: -1 });
};

// Static method to get approved websites
WebsiteSchema.statics.findApproved = function() {
  return this.find({ status: 'approved' }).sort({ createdAt: -1 });
};

// Static method to get rejected websites
WebsiteSchema.statics.findRejected = function() {
  return this.find({ status: 'rejected' }).sort({ createdAt: -1 });
};

// Static method to get websites by user with status filter
WebsiteSchema.statics.findByUser = function(userId: string, status?: string) {
  const query: any = { userId };
  if (status) {
    query.status = status;
  }
  return this.find(query).sort({ createdAt: -1 });
};

// Transform output to remove __v and convert _id to id
WebsiteSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    // Create id property from _id
    ret.id = ret._id ? ret._id.toString() : ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

// Apply the interface to the model
const Website = mongoose.models.Website as WebsiteModel || mongoose.model<IWebsite, WebsiteModel>('Website', WebsiteSchema);

export default Website;